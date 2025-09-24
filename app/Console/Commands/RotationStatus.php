<?php

namespace App\Console\Commands;

use App\Models\Region;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class RotationStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dpwh:rotation {--reset : Reset rotation to start from the first region}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Show current rotation status or reset rotation';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if ($this->option('reset')) {
            return $this->resetRotation();
        }

        return $this->showStatus();
    }

    /**
     * Show current rotation status
     */
    private function showStatus(): int
    {
        $regions = Region::where('is_active', true)
            ->orderBy('name')
            ->get();

        $totalRegions = $regions->count();
        $lastScrapedRegionId = Cache::get('dpwh_last_scraped_region_id');

        $this->info('🔄 DPWH Scraper Rotation Status');
        $this->line('');

        if (!$lastScrapedRegionId) {
            $this->line('Status: Not started yet');
            $this->line('Next region: ' . ($regions->first()->name ?? 'None available'));
        } else {
            $currentRegion = $regions->firstWhere('id', $lastScrapedRegionId);
            $currentIndex = $regions->search(function ($region) use ($lastScrapedRegionId) {
                return $region->id == $lastScrapedRegionId;
            });

            $nextIndex = ($currentIndex + 1) % $totalRegions;
            $nextRegion = $regions[$nextIndex] ?? null;

            $this->line('Status: Active');
            $this->line('Last scraped: ' . ($currentRegion->name ?? 'Unknown'));
            $this->line('Current position: ' . ($currentIndex !== false ? $currentIndex + 1 : '?') . '/' . $totalRegions);
            $this->line('Next region: ' . ($nextRegion->name ?? 'Unknown'));
        }

        $this->line('');
        $this->info('Schedule Info:');
        $this->line('Frequency: Every hour');
        $this->line('Total regions: ' . $totalRegions);
        $this->line('Complete cycle time: ~' . $totalRegions . ' hours');

        $this->line('');
        $this->info('All Active Regions:');
        foreach ($regions as $index => $region) {
            $marker = '';
            if ($lastScrapedRegionId && $region->id == $lastScrapedRegionId) {
                $marker = ' ← Last scraped';
            } elseif ($lastScrapedRegionId) {
                $currentIndex = $regions->search(function ($r) use ($lastScrapedRegionId) {
                    return $r->id == $lastScrapedRegionId;
                });
                $nextIndex = ($currentIndex + 1) % $totalRegions;
                if ($index == $nextIndex) {
                    $marker = ' ← Next';
                }
            } elseif ($index === 0) {
                $marker = ' ← Next';
            }

            $this->line(sprintf('%2d. %s%s', $index + 1, $region->name, $marker));
        }

        return 0;
    }

    /**
     * Reset rotation to start from the first region
     */
    private function resetRotation(): int
    {
        Cache::forget('dpwh_last_scraped_region_id');

        $this->info('✅ Rotation reset successfully!');
        $this->line('Next scrape will start from the first region.');

        return $this->showStatus();
    }
}
