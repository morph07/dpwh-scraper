<?php

namespace App\Http\Controllers;

use App\Models\InfrastructureProject;
use App\Models\ProjectChange;
use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_projects' => InfrastructureProject::count(),
            'active_projects' => InfrastructureProject::whereIn('status', ['On-Going', 'Active'])->count(),
            'completed_projects' => InfrastructureProject::where('status', 'Completed')->count(),
            'total_regions' => Region::where('is_active', true)->count(),
            'total_changes' => ProjectChange::count(),
            'recent_changes' => ProjectChange::whereDate('detected_at', '>=', now()->subDays(7))->count(),
        ];

        $recentProjects = InfrastructureProject::with('region')
            ->latest('created_at')
            ->limit(10)
            ->get();

        $recentChanges = ProjectChange::with('infrastructureProject.region')
            ->latest('detected_at')
            ->limit(10)
            ->get();

        $regionStats = Region::withCount('infrastructureProjects')
            ->where('is_active', true)
            ->get()
            ->map(function ($region) {
                return [
                    'name' => $region->name,
                    'count' => $region->infrastructure_projects_count,
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentProjects' => $recentProjects,
            'recentChanges' => $recentChanges,
            'regionStats' => $regionStats,
        ]);
    }
}
