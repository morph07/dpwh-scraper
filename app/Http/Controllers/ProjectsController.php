<?php

namespace App\Http\Controllers;

use App\Models\InfrastructureProject;
use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectsController extends Controller
{
    public function index(Request $request)
    {
        $query = InfrastructureProject::with('region')
            ->when($request->region, function ($query, $regionId) {
                return $query->where('region_id', $regionId);
            })
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('project_name', 'like', "%{$search}%")
                        ->orWhere('contract_id', 'like', "%{$search}%")
                        ->orWhere('contractor', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc');

        $projects = $query->paginate(25);

        $regions = Region::where('is_active', true)->get();
        $statuses = InfrastructureProject::select('status')
            ->whereNotNull('status')
            ->distinct()
            ->pluck('status');

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'regions' => $regions,
            'statuses' => $statuses,
            'filters' => $request->only(['region', 'status', 'search']),
        ]);
    }

    public function show(InfrastructureProject $project)
    {
        $project->load(['region', 'projectChanges' => function ($query) {
            $query->latest('detected_at')->limit(20);
        }]);

        return Inertia::render('Projects/Show', [
            'project' => $project,
        ]);
    }
}
