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
        Schema::create('infrastructure_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->cascadeOnDelete();
            $table->string('contract_id')->unique(); // Primary identifier from DPWH
            $table->string('project_name');
            $table->text('description')->nullable();
            $table->decimal('contract_amount', 20, 2)->nullable();
            $table->string('contractor')->nullable();
            $table->string('status')->nullable();
            $table->date('contract_date')->nullable();
            $table->date('start_date')->nullable();
            $table->date('target_completion')->nullable();
            $table->date('actual_completion')->nullable();
            $table->decimal('physical_progress', 5, 2)->nullable(); // Percentage
            $table->decimal('financial_progress', 5, 2)->nullable(); // Percentage
            $table->string('implementing_unit')->nullable();
            $table->string('location')->nullable();
            $table->json('additional_data')->nullable(); // For any extra fields we discover
            $table->timestamp('last_scraped_at')->nullable();
            $table->string('data_hash'); // To quickly detect changes
            $table->timestamps();

            $table->index(['region_id', 'status']);
            $table->index('last_scraped_at');
            $table->index('data_hash');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('infrastructure_projects');
    }
};
