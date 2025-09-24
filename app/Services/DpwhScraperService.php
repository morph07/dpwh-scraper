<?php

namespace App\Services;

use App\Models\InfrastructureProject;
use App\Models\ProjectChange;
use App\Models\Region;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Symfony\Component\DomCrawler\Crawler;

class DpwhScraperService
{
    private Client $httpClient;
    private array $headers;

    public function __construct()
    {
        $this->httpClient = new Client([
            'timeout' => 30,
            'verify' => false, // Disable SSL verification if needed
        ]);

        $this->headers = [
            'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language' => 'en-US,en;q=0.5',
            'Accept-Encoding' => 'gzip, deflate',
            'Connection' => 'keep-alive',
        ];
    }

    /**
     * Scrape all regions for infrastructure projects
     */
    public function scrapeAllRegions(): array
    {
        $results = [];
        $regions = Region::where('is_active', true)->orderBy('name')->get();

        Log::info('Starting scrape for all regions', ['region_count' => $regions->count()]);

        foreach ($regions as $index => $region) {
            try {
                Log::info('Starting region scrape', [
                    'region' => $region->name,
                    'progress' => ($index + 1) . '/' . $regions->count()
                ]);

                $result = $this->scrapeRegion($region);
                $results[$region->name] = $result;

                Log::info('Completed scraping region', [
                    'region' => $region->name,
                    'projects_found' => $result['projects_found'] ?? 0,
                    'new_projects' => $result['new_projects'] ?? 0,
                    'updated_projects' => $result['updated_projects'] ?? 0,
                ]);

                // Add delay between regions to be respectful (longer delay for more regions)
                if ($index < $regions->count() - 1) {
                    $delaySeconds = min(5, max(2, intval($regions->count() / 6))); // 2-5 seconds based on region count
                    Log::debug("Waiting {$delaySeconds} seconds before next region...");
                    sleep($delaySeconds);
                }

            } catch (\Exception $e) {
                Log::error('Failed to scrape region', [
                    'region' => $region->name,
                    'error' => $e->getMessage(),
                ]);

                $results[$region->name] = [
                    'success' => false,
                    'error' => $e->getMessage(),
                ];
            }
        }

        Log::info('Completed scraping all regions', [
            'total_regions' => $regions->count(),
            'successful' => collect($results)->where('success', true)->count(),
            'failed' => collect($results)->where('success', false)->count(),
        ]);

        return $results;
    }

    /**
     * Scrape infrastructure projects for a specific region
     */
    public function scrapeRegion(Region $region): array
    {
        Log::info('Starting scrape for region', ['region' => $region->name, 'url' => $region->url]);

        try {
            $html = $this->fetchHtml($region->url);
            $projects = $this->parseProjects($html, $region);

            $stats = $this->processProjects($projects, $region);

            return array_merge($stats, ['success' => true]);

        } catch (\Exception $e) {
            Log::error('Error scraping region', [
                'region' => $region->name,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }

    /**
     * Fetch HTML content from URL
     */
    private function fetchHtml(string $url): string
    {
        try {
            $response = $this->httpClient->get($url, [
                'headers' => $this->headers,
            ]);

            if ($response->getStatusCode() !== 200) {
                throw new \Exception("HTTP {$response->getStatusCode()} received");
            }

            return (string) $response->getBody();

        } catch (RequestException $e) {
            throw new \Exception("Failed to fetch URL: " . $e->getMessage());
        }
    }

    /**
     * Parse infrastructure projects from HTML
     */
    private function parseProjects(string $html, Region $region): Collection
    {
        $crawler = new Crawler($html);
        $projects = collect();

        // Look for common table structures - we'll need to adapt this based on actual DPWH site structure
        $tableSelectors = [
            'table.gridview',
            'table#GridView1',
            'table[id*="GridView"]',
            'table[class*="grid"]',
            '.table',
            'table',
        ];

        $tableFound = false;

        foreach ($tableSelectors as $selector) {
            try {
                $table = $crawler->filter($selector)->first();

                if ($table->count() > 0) {
                    Log::info('Found table with selector', ['selector' => $selector]);
                    $projects = $this->parseTableRows($table, $region);
                    $tableFound = true;
                    break;
                }
            } catch (\Exception $e) {
                Log::debug('Selector failed', ['selector' => $selector, 'error' => $e->getMessage()]);
                continue;
            }
        }

        if (!$tableFound) {
            Log::warning('No project table found', ['region' => $region->name]);

            // Try to find any data in the page for debugging
            $allText = $crawler->filter('body')->text();
            Log::debug('Page content preview', [
                'region' => $region->name,
                'content_length' => strlen($allText),
                'content_preview' => substr($allText, 0, 500),
            ]);
        }

        Log::info('Parsed projects from HTML', [
            'region' => $region->name,
            'project_count' => $projects->count(),
        ]);

        return $projects;
    }

    /**
     * Parse table rows to extract project data
     */
    private function parseTableRows(Crawler $table, Region $region): Collection
    {
        $projects = collect();

        try {
            // Get header row to understand column structure
            $headers = [];
            $headerRow = $table->filter('tr')->first();

            if ($headerRow->count() > 0) {
                $headerRow->filter('th, td')->each(function (Crawler $cell, $index) use (&$headers) {
                    $headers[$index] = trim(strtolower($cell->text()));
                });
            }

            Log::debug('Table headers found', ['headers' => $headers]);

            // Process data rows
            $table->filter('tr')->each(function (Crawler $row, $rowIndex) use (&$projects, $headers, $region) {
                // Skip header row
                if ($rowIndex === 0) {
                    return;
                }

                $cells = [];
                $row->filter('td, th')->each(function (Crawler $cell, $cellIndex) use (&$cells) {
                    $cells[$cellIndex] = trim($cell->text());
                });

                // Skip empty rows
                if (empty(array_filter($cells))) {
                    return;
                }

                try {
                    $projectData = $this->mapRowToProject($cells, $headers, $region);

                    if (!empty($projectData['contract_id'])) {
                        $projects->push($projectData);
                    }
                } catch (\Exception $e) {
                    Log::warning('Failed to parse row', [
                        'region' => $region->name,
                        'row_index' => $rowIndex,
                        'cells' => $cells,
                        'error' => $e->getMessage(),
                    ]);
                }
            });

        } catch (\Exception $e) {
            Log::error('Failed to parse table rows', [
                'region' => $region->name,
                'error' => $e->getMessage(),
            ]);
        }

        return $projects;
    }

    /**
     * Map table row data to project structure
     */
    private function mapRowToProject(array $cells, array $headers, Region $region): array
    {
        // Create mapping between common field names and our database structure
        $fieldMap = [
            'contract' => 'contract_id',
            'contract id' => 'contract_id',
            'contract no' => 'contract_id',
            'contract number' => 'contract_id',
            'contract id a) contract description b) contractor c) implementing office d) source of funds' => 'project_details',
            'project' => 'project_name',
            'project name' => 'project_name',
            'title' => 'project_name',
            'description' => 'description',
            'amount' => 'contract_amount',
            'contract amount' => 'contract_amount',
            'contract cost (php)' => 'contract_amount',
            'cost' => 'contract_amount',
            'contractor' => 'contractor',
            'status' => 'status',
            'a) status b) % accomplishment' => 'status_progress',
            'date' => 'contract_date',
            'contract date' => 'contract_date',
            'a) contract effectivity date b) contract expiry date' => 'contract_dates',
            'start' => 'start_date',
            'start date' => 'start_date',
            'completion' => 'target_completion',
            'target completion' => 'target_completion',
            'end date' => 'target_completion',
            'progress' => 'physical_progress',
            'physical progress' => 'physical_progress',
            'location' => 'location',
            'unit' => 'implementing_unit',
            'implementing unit' => 'implementing_unit',
        ];

        $projectData = [
            'region_id' => $region->id,
            'contract_id' => '',
            'project_name' => '',
            'description' => null,
            'contract_amount' => null,
            'contractor' => null,
            'status' => null,
            'contract_date' => null,
            'start_date' => null,
            'target_completion' => null,
            'actual_completion' => null,
            'physical_progress' => null,
            'financial_progress' => null,
            'implementing_unit' => null,
            'location' => null,
            'additional_data' => [],
            'last_scraped_at' => now(),
        ];

        // Map known fields
        foreach ($headers as $index => $header) {
            $normalizedHeader = trim(strtolower($header));
            $fieldName = $fieldMap[$normalizedHeader] ?? null;

            if ($fieldName && isset($cells[$index])) {
                $value = trim($cells[$index]);

                if ($value !== '') {
                    if ($fieldName === 'project_details') {
                        $this->parseProjectDetails($value, $projectData);
                    } elseif ($fieldName === 'status_progress') {
                        $this->parseStatusProgress($value, $projectData);
                    } elseif ($fieldName === 'contract_dates') {
                        $this->parseContractDates($value, $projectData);
                    } else {
                        $projectData[$fieldName] = $this->castValue($fieldName, $value);
                    }
                }
            }
        }

        // Store any unmapped data in additional_data
        $additionalData = [];
        foreach ($headers as $index => $header) {
            $normalizedHeader = trim(strtolower($header));

            if (!isset($fieldMap[$normalizedHeader]) && isset($cells[$index])) {
                $additionalData[$header] = trim($cells[$index]);
            }
        }

        if (!empty($additionalData)) {
            $projectData['additional_data'] = $additionalData;
        }

        // Use first non-empty cell as contract_id if not found
        if (empty($projectData['contract_id'])) {
            foreach ($cells as $cell) {
                $cell = trim($cell);
                if (!empty($cell) && strlen($cell) < 50) { // Reasonable length for contract ID
                    $projectData['contract_id'] = $cell;
                    break;
                }
            }
        }

        return $projectData;
    }

    /**
     * Parse project details field
     */
    private function parseProjectDetails(string $value, array &$projectData): void
    {
        // Example: "24A00678 a) REPAIR / REHABILITATION OF BAAG BR. (B04590LZ) ALONG MANILA NORTH ROAD b) ALPHATEC CHEMICAL CORPORATION (39938) c) Region I - Region I d) Regular Infra - GAA 2025 LS Itemization"

        // Extract contract ID (first part before 'a)')
        if (preg_match('/^([^\s]+)\s+a\)/', $value, $matches)) {
            $projectData['contract_id'] = trim($matches[1]);
        }

        // Extract project description (between 'a)' and 'b)')
        if (preg_match('/a\)\s*([^b]+?)b\)/', $value, $matches)) {
            $projectData['project_name'] = trim($matches[1]);
        }

        // Extract contractor (between 'b)' and 'c)')
        if (preg_match('/b\)\s*([^c]+?)c\)/', $value, $matches)) {
            $contractor = trim($matches[1]);
            // Remove contractor ID in parentheses
            $contractor = preg_replace('/\s*\(\d+\)$/', '', $contractor);
            $projectData['contractor'] = $contractor;
        }

        // Extract implementing unit (between 'c)' and 'd)')
        if (preg_match('/c\)\s*([^d]+?)d\)/', $value, $matches)) {
            $projectData['implementing_unit'] = trim($matches[1]);
        }
    }

    /**
     * Parse status and progress field
     */
    private function parseStatusProgress(string $value, array &$projectData): void
    {
        // Example: "a) On-Going b) .00" or "a) Completed b) 100.00"

        // Extract status (between 'a)' and 'b)')
        if (preg_match('/a\)\s*([^b]+?)b\)/', $value, $matches)) {
            $projectData['status'] = trim($matches[1]);
        }

        // Extract progress (after 'b)')
        if (preg_match('/b\)\s*([\d.]+)/', $value, $matches)) {
            $projectData['physical_progress'] = (float) $matches[1];
        }
    }

    /**
     * Parse contract dates field
     */
    private function parseContractDates(string $value, array &$projectData): void
    {
        // Example: "a) April 7, 2025 b) July 20, 2025"

        // Extract start date (between 'a)' and 'b)')
        if (preg_match('/a\)\s*([^b]+?)b\)/', $value, $matches)) {
            $startDate = $this->parseDate(trim($matches[1]));
            if ($startDate) {
                $projectData['start_date'] = $startDate;
            }
        }

        // Extract end date (after 'b)')
        if (preg_match('/b\)\s*(.+)$/', $value, $matches)) {
            $endDate = $this->parseDate(trim($matches[1]));
            if ($endDate) {
                $projectData['target_completion'] = $endDate;
            }
        }
    }

    /**
     * Cast values to appropriate types
     */
    private function castValue(string $fieldName, string $value): mixed
    {
        $value = trim($value);

        if ($value === '' || strtolower($value) === 'null') {
            return null;
        }

        return match ($fieldName) {
            'contract_amount', 'physical_progress', 'financial_progress' => $this->parseNumeric($value),
            'contract_date', 'start_date', 'target_completion', 'actual_completion' => $this->parseDate($value),
            default => $value,
        };
    }

    /**
     * Parse numeric values from text
     */
    private function parseNumeric(string $value): ?float
    {
        // Remove common currency symbols and formatting
        $cleaned = preg_replace('/[₱$,\s%]/', '', $value);

        if (is_numeric($cleaned)) {
            return (float) $cleaned;
        }

        return null;
    }

    /**
     * Parse date values from text
     */
    private function parseDate(string $value): ?string
    {
        try {
            $date = \Carbon\Carbon::parse($value);
            return $date->format('Y-m-d');
        } catch (\Exception $e) {
            Log::debug('Failed to parse date', ['value' => $value, 'error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Process scraped projects and update database
     */
    private function processProjects(Collection $projects, Region $region): array
    {
        $stats = [
            'projects_found' => $projects->count(),
            'new_projects' => 0,
            'updated_projects' => 0,
            'unchanged_projects' => 0,
            'errors' => 0,
        ];

        foreach ($projects as $projectData) {
            try {
                $this->processProject($projectData, $stats);
            } catch (\Exception $e) {
                $stats['errors']++;
                Log::error('Failed to process project', [
                    'project_data' => $projectData,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // Mark projects as potentially deleted if they weren't found in this scrape
        $this->markMissingProjects($region, $projects);

        return $stats;
    }

    /**
     * Process individual project data
     */
    private function processProject(array $projectData, array &$stats): void
    {
        $existingProject = InfrastructureProject::where('contract_id', $projectData['contract_id'])->first();

        if (!$existingProject) {
            // Create new project
            $project = new InfrastructureProject($projectData);
            $project->updateDataHash();
            $project->save();

            ProjectChange::recordChange($project, 'created', null, $project->toArray());

            $stats['new_projects']++;

            Log::info('Created new project', [
                'contract_id' => $project->contract_id,
                'project_name' => $project->project_name,
            ]);

        } else {
            // Check for changes
            $newProject = new InfrastructureProject($projectData);
            $newDataHash = $newProject->generateDataHash();

            if ($existingProject->data_hash !== $newDataHash) {
                // Project has changed
                $oldData = $existingProject->toArray();
                $changedFields = $this->getChangedFields($existingProject, $projectData);

                $existingProject->fill($projectData);
                $existingProject->updateDataHash();
                $existingProject->save();

                ProjectChange::recordChange(
                    $existingProject,
                    'updated',
                    $oldData,
                    $existingProject->toArray(),
                    $changedFields
                );

                $stats['updated_projects']++;

                Log::info('Updated project', [
                    'contract_id' => $existingProject->contract_id,
                    'changed_fields' => $changedFields,
                ]);

            } else {
                // No changes, just update last_scraped_at
                $existingProject->last_scraped_at = now();
                $existingProject->save();

                $stats['unchanged_projects']++;
            }
        }
    }

    /**
     * Get fields that have changed between old and new data
     */
    private function getChangedFields(InfrastructureProject $existingProject, array $newData): array
    {
        $changedFields = [];
        $comparableFields = [
            'project_name', 'description', 'contract_amount', 'contractor', 'status',
            'contract_date', 'start_date', 'target_completion', 'actual_completion',
            'physical_progress', 'financial_progress', 'implementing_unit', 'location',
            'additional_data'
        ];

        foreach ($comparableFields as $field) {
            $oldValue = $existingProject->$field;
            $newValue = $newData[$field] ?? null;

            // Handle different data types appropriately
            if (is_array($oldValue) || is_array($newValue)) {
                if (json_encode($oldValue) !== json_encode($newValue)) {
                    $changedFields[] = $field;
                }
            } elseif ($oldValue != $newValue) {
                $changedFields[] = $field;
            }
        }

        return $changedFields;
    }

    /**
     * Mark projects that weren't found in the latest scrape
     */
    private function markMissingProjects(Region $region, Collection $scrapedProjects): void
    {
        $scrapedContractIds = $scrapedProjects->pluck('contract_id')->filter()->toArray();

        if (empty($scrapedContractIds)) {
            Log::warning('No contract IDs found in scraped data', ['region' => $region->name]);
            return;
        }

        // Find projects in this region that weren't in the scrape and were last seen more than 6 hours ago
        $missingProjects = InfrastructureProject::where('region_id', $region->id)
            ->whereNotIn('contract_id', $scrapedContractIds)
            ->where('last_scraped_at', '<', now()->subHours(6))
            ->get();

        foreach ($missingProjects as $project) {
            Log::info('Project potentially deleted from website', [
                'contract_id' => $project->contract_id,
                'project_name' => $project->project_name,
                'last_scraped' => $project->last_scraped_at,
            ]);

            // You might want to mark as deleted or handle differently
            ProjectChange::recordChange($project, 'potentially_deleted', $project->toArray(), null);
        }
    }
}
