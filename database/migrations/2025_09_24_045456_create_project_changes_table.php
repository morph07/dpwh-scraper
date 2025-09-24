<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('project_changes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('infrastructure_project_id')->constrained()->cascadeOnDelete();
            $table->string('change_type'); // 'created', 'updated', 'deleted'
            $table->json('old_data')->nullable(); // Previous state (null for created)
            $table->json('new_data')->nullable(); // New state (null for deleted)
            $table->json('changed_fields')->nullable(); // Array of field names that changed
            $table->string('contract_id'); // For easy reference even if project is deleted
            $table->timestamp('detected_at');
            $table->timestamps();

            $table->index(['infrastructure_project_id', 'change_type']);
            $table->index('detected_at');
            $table->index('contract_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_changes');
    }
};
