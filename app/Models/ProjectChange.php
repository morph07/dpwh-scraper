<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectChange extends Model
{
    protected $fillable = [
        'infrastructure_project_id',
        'change_type',
        'old_data',
        'new_data',
        'changed_fields',
        'contract_id',
        'detected_at',
    ];

    protected function casts(): array
    {
        return [
            'old_data' => 'array',
            'new_data' => 'array',
            'changed_fields' => 'array',
            'detected_at' => 'datetime',
        ];
    }

    public function infrastructureProject(): BelongsTo
    {
        return $this->belongsTo(InfrastructureProject::class);
    }

    /**
     * Create a change record
     */
    public static function recordChange(
        InfrastructureProject $project,
        string $changeType,
        ?array $oldData = null,
        ?array $newData = null,
        ?array $changedFields = null
    ): self {
        return self::create([
            'infrastructure_project_id' => $project->id,
            'change_type' => $changeType,
            'old_data' => $oldData,
            'new_data' => $newData,
            'changed_fields' => $changedFields,
            'contract_id' => $project->contract_id,
            'detected_at' => now(),
        ]);
    }
}
