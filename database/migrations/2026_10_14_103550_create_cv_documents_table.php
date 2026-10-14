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
        Schema::create('cv_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('purpose')->default('one_off');
            $table->string('original_name');
            $table->string('mime')->nullable();
            $table->unsignedInteger('size');
            $table->string('sha256', 64);
            $table->string('storage_path');
            $table->string('status')->default('quarantined');
            $table->string('failure_reason')->nullable();
            $table->timestamp('expires_at')->index();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cv_documents');
    }
};
