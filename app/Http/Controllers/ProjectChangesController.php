<?php

namespace App\Http\Controllers;

use App\Models\ProjectChange;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectChangesController extends Controller
{
    public function index(Request $request)
    {
        $changes = ProjectChange::with('infrastructureProject.region')
            ->when($request->type, function ($query, $type) {
                return $query->where('change_type', $type);
            })
            ->when($request->contract_id, function ($query, $contractId) {
                return $query->where('contract_id', 'like', "%{$contractId}%");
            })
            ->when($request->date_from, function ($query, $dateFrom) {
                return $query->whereDate('detected_at', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($query, $dateTo) {
                return $query->whereDate('detected_at', '<=', $dateTo);
            })
            ->orderBy('detected_at', 'desc')
            ->paginate(25);

        // Transform the data to match component expectations
        $changes->getCollection()->transform(function ($change) {
            // Since changed_fields is cast as array in the model, no need to json_decode
            $changedFields = $change->changed_fields ?: [];
            $change->field_name = is_array($changedFields) ? implode(', ', $changedFields) : ($change->changed_fields ?? 'N/A');
            $change->old_value = $change->old_data ? 'Previous data' : null;
            $change->new_value = $change->new_data ? 'Updated data' : null;

            return $change;
        });

        $changeTypes = ProjectChange::select('change_type')
            ->distinct()
            ->pluck('change_type');

        return Inertia::render('Changes/Index', [
            'changes' => $changes,
            'changeTypes' => $changeTypes,
            'filters' => $request->only(['type', 'contract_id', 'date_from', 'date_to']),
        ]);
    }

    public function show(ProjectChange $change)
    {
        $change->load('infrastructureProject.region');

        // Transform data to match component expectations
        $changedFields = $change->changed_fields ?: [];
        $change->field_name = is_array($changedFields) ? implode(', ', $changedFields) : ($change->changed_fields ?? 'N/A');
        $change->old_value = $change->old_data ? 'Previous data' : null;
        $change->new_value = $change->new_data ? 'Updated data' : null;

        return Inertia::render('Changes/Show', [
            'change' => $change,
        ]);
    }
}
