<?php

namespace App\Console\Commands;

use App\Models\Region;
use App\Services\DpwhScraperService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ScrapeInfrastructureProjects extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dpwh:scrape {--region= : Scrape specific region only} {--dry-run : Run without saving to database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scrape infrastructure projects from DPWH website';

    /**
     * Execute the console command.
     */
    public function handle(DpwhScraperService $scraperService): int
    {
        $this->info('Starting DPWH infrastructure projects scraper...');

        $startTime = now();

        try {
            if ($regionName = $this->option('region')) {
                // Scrape specific region
                $region = Region::where('name', $regionName)->first();

                if (!$region) {
                    $this->error("Region '{$regionName}' not found");
                    return 1;
                }

                $this->info("Scraping region: {$region->name}");
                $result = $scraperService->scrapeRegion($region);
                $results = [$region->name => $result];

            } else {
                // Scrape all regions
                $this->info('Scraping all active regions...');
                $results = $scraperService->scrapeAllRegions();
            }

            $this->displayResults($results);

            $duration = $startTime->diffInSeconds(now());
            $this->info("Scraping completed in {$duration} seconds");

            return 0;

        } catch (\Exception $e) {
            $this->error('Scraping failed: ' . $e->getMessage());
            Log::error('Scraping command failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return 1;
        }
    }

    /**
     * Display scraping results
     */
    private function displayResults(array $results): void
    {
        $this->info('Scraping Results:');
        $this->line('');

        $totalNew = 0;
        $totalUpdated = 0;
        $totalFound = 0;
        $totalErrors = 0;
        $successfulRegions = 0;
        $failedRegions = 0;

        foreach ($results as $regionName => $result) {
            if ($result['success'] ?? false) {
                $this->info("✅ {$regionName}:");
                $this->line("   Projects found: " . ($result['projects_found'] ?? 0));
                $this->line("   New projects: " . ($result['new_projects'] ?? 0));
                $this->line("   Updated projects: " . ($result['updated_projects'] ?? 0));
                $this->line("   Unchanged projects: " . ($result['unchanged_projects'] ?? 0));
                $this->line("   Errors: " . ($result['errors'] ?? 0));

                $totalNew += $result['new_projects'] ?? 0;
                $totalUpdated += $result['updated_projects'] ?? 0;
                $totalFound += $result['projects_found'] ?? 0;
                $totalErrors += $result['errors'] ?? 0;
                $successfulRegions++;

            } else {
                $this->error("❌ {$regionName}: " . ($result['error'] ?? 'Unknown error'));
                $failedRegions++;
            }

            $this->line('');
        }

        $this->info('📊 Total Summary:');
        $this->line("Regions processed: " . ($successfulRegions + $failedRegions));
        $this->line("Successful regions: {$successfulRegions}");
        $this->line("Failed regions: {$failedRegions}");
        $this->line("Total projects found: {$totalFound}");
        $this->line("New projects: {$totalNew}");
        $this->line("Updated projects: {$totalUpdated}");

        if ($totalNew > 0 || $totalUpdated > 0) {
            $this->info('✨ Database has been updated with new changes!');
        }

        if ($failedRegions > 0) {
            $this->warn("⚠️  Some regions failed to scrape. Check logs for details.");
        }
    }
}
