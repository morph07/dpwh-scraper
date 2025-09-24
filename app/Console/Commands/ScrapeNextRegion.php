<?php

namespace App\Console\Commands;

use App\Models\Region;
use App\Services\DpwhScraperService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ScrapeNextRegion extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dpwh:scrape-next';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scrape the next region in rotation (used for scheduled hourly scraping)';

    /**
     * Execute the console command.
     */
    public function handle(DpwhScraperService $scraperService): int
    {
        try {
            // Get the next region to scrape
            $region = $this->getNextRegion();

            if (!$region) {
                $this->error('No regions available for scraping');
                return 1;
            }

            $this->info("Scraping next region in rotation: {$region->name}");

            $startTime = now();

            // Always update the last scraped region to ensure rotation continues
            $this->updateLastScrapedRegion($region);

            try {
                // Scrape the region
                $result = $scraperService->scrapeRegion($region);

                // Display results
                $this->displayResult($region, $result, true);

                $duration = $startTime->diffInSeconds(now());
                $this->info("Scraping completed in {$duration} seconds");

                return 0;

            } catch (\Exception $scrapeError) {
                // Even if scraping fails, we continue the rotation
                $result = [
                    'success' => false,
                    'error' => $scrapeError->getMessage(),
                ];

                $this->displayResult($region, $result, false);

                Log::warning('Region scraping failed but rotation continues', [
                    'region' => $region->name,
                    'error' => $scrapeError->getMessage(),
                ]);

                return 0; // Return 0 so scheduler doesn't consider this a failure
            }

        } catch (\Exception $e) {
            $this->error('Rotational scraping system failed: ' . $e->getMessage());
            Log::error('Rotational scraping system failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return 1;
        }
    }

    /**
     * Get the next region to scrape in rotation
     */
    private function getNextRegion(): ?Region
    {
        $regions = Region::where('is_active', true)
            ->orderBy('name')
            ->get();

        if ($regions->isEmpty()) {
            return null;
        }

        // Get the last scraped region from cache
        $lastScrapedRegionId = Cache::get('dpwh_last_scraped_region_id');

        if (!$lastScrapedRegionId) {
            // If no previous scraping, start with the first region
            return $regions->first();
        }

        // Find the current region and get the next one
        $currentIndex = $regions->search(function ($region) use ($lastScrapedRegionId) {
            return $region->id == $lastScrapedRegionId;
        });

        if ($currentIndex === false) {
            // If the last scraped region is not found, start from the beginning
            return $regions->first();
        }

        // Get the next region (wrap around to first if at the end)
        $nextIndex = ($currentIndex + 1) % $regions->count();
        return $regions[$nextIndex];
    }

    /**
     * Update the last scraped region in cache
     */
    private function updateLastScrapedRegion(Region $region): void
    {
        Cache::put('dpwh_last_scraped_region_id', $region->id, now()->addDays(30));

        Log::info('Updated last scraped region', [
            'region_id' => $region->id,
            'region_name' => $region->name,
        ]);
    }

    /**
     * Display scraping result for a single region
     */
    private function displayResult(Region $region, array $result, bool $success): void
    {
        if ($success && ($result['success'] ?? false)) {
            $this->info("✅ {$region->name} - Scraping Successful:");
            $this->line("   Projects found: " . ($result['projects_found'] ?? 0));
            $this->line("   New projects: " . ($result['new_projects'] ?? 0));
            $this->line("   Updated projects: " . ($result['updated_projects'] ?? 0));
            $this->line("   Unchanged projects: " . ($result['unchanged_projects'] ?? 0));
            $this->line("   Errors: " . ($result['errors'] ?? 0));

            if (($result['new_projects'] ?? 0) > 0 || ($result['updated_projects'] ?? 0) > 0) {
                $this->info('✨ Database updated with changes!');
            }
        } else {
            $this->warn("⚠️  {$region->name} - Scraping Failed (continuing rotation):");
            $this->line("   Error: " . ($result['error'] ?? 'Unknown error'));
            $this->line("   This region will be retried in the next cycle.");
        }

        // Show rotation info
        $totalRegions = Region::where('is_active', true)->count();
        $currentRegionNumber = $this->getCurrentRegionNumber($region);

        $this->line('');
        $this->info("🔄 Rotation Info:");
        $this->line("   Current region: {$currentRegionNumber}/{$totalRegions}");
        $this->line("   Complete cycle time: ~{$totalRegions} hours");
        $this->line("   Next scrape: " . now()->addHour()->format('Y-m-d H:i:s'));

        // Show next region
        $nextRegion = $this->getNextRegion();
        if ($nextRegion) {
            $this->line("   Next region: {$nextRegion->name}");
        }
    }

    /**
     * Get the current region number in the rotation
     */
    private function getCurrentRegionNumber(Region $currentRegion): int
    {
        $regions = Region::where('is_active', true)
            ->orderBy('name')
            ->get();

        $index = $regions->search(function ($region) use ($currentRegion) {
            return $region->id == $currentRegion->id;
        });

        return $index !== false ? $index + 1 : 1;
    }
}
