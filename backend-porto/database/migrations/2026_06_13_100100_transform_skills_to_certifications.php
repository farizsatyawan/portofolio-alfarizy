<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Transforms the 'skills' table into a certifications system:
     * - Drops old enum 'category' column
     * - Adds new string 'category' (free-text)
     * - Adds 'issuer' for certificate issuing organization
     * - Adds 'pdf_file' for uploaded certificate PDF filename
     */
    public function up(): void
    {
        Schema::table('skills', function (Blueprint $table) {
            // Drop the old enum column
            $table->dropColumn('category');
        });

        Schema::table('skills', function (Blueprint $table) {
            // Re-add category as a free-text string
            $table->string('category')->nullable()->after('name');
            // New columns
            $table->string('issuer')->nullable()->after('name');
            $table->string('pdf_file')->nullable()->after('logo_icon');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('skills', function (Blueprint $table) {
            $table->dropColumn(['issuer', 'pdf_file', 'category']);
        });

        Schema::table('skills', function (Blueprint $table) {
            $table->enum('category', ['frontend', 'backend', 'tools'])->after('name');
        });
    }
};
