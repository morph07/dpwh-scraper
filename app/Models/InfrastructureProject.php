<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InfrastructureProject extends Model
{
    protected $fillable = [
        'region_id',
        'contract_id',
        'project_name',
        'description',
        'contract_amount',
        'contractor',
        'status',
        'contract_date',
        'start_date',
        'target_completion',
        'actual_completion',
        'physical_progress',
        'financial_progress',
        'implementing_unit',
        'location',
        'additional_data',
        'last_scraped_at',
        'data_hash',
    ];

    protected function casts(): array
    {
        return [
            'contract_amount' => 'decimal:2',
            'physical_progress' => 'decimal:2',
            'financial_progress' => 'decimal:2',
            'contract_date' => 'date',
            'start_date' => 'date',
            'target_completion' => 'date',
            'actual_completion' => 'date',
            'last_scraped_at' => 'datetime',
            'additional_data' => 'array',
        ];
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function projectChanges(): HasMany
    {
        return $this->hasMany(ProjectChange::class);
    }

    /**
     * Generate a hash from the project data to detect changes
     */
    public function generateDataHash(): string
    {
        $data = $this->only([
            'project_name',
            'description',
            'contract_amount',
            'contractor',
            'status',
            'contract_date',
            'start_date',
            'target_completion',
            'actual_completion',
            'physical_progress',
            'financial_progress',
            'implementing_unit',
            'location',
            'additional_data',
        ]);

        return md5(json_encode($data));
    }

    /**
     * Update the data hash
     */
    public function updateDataHash(): void
    {
        $this->data_hash = $this->generateDataHash();
    }
}
