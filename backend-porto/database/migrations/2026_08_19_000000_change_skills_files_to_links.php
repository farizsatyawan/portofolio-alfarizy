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
        Schema::table('skills', function (Blueprint $table) {
            if (Schema::hasColumn('skills', 'logo_icon')) {
                $table->dropColumn('logo_icon');
            }
            if (Schema::hasColumn('skills', 'pdf_file')) {
                $table->dropColumn('pdf_file');
            }
            $table->text('link_logo')->nullable()->after('category');
            $table->text('link_sertifikat')->nullable()->after('link_logo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('skills', function (Blueprint $table) {
            if (Schema::hasColumn('skills', 'link_logo')) {
                $table->dropColumn('link_logo');
            }
            if (Schema::hasColumn('skills', 'link_sertifikat')) {
                $table->dropColumn('link_sertifikat');
            }
            $table->string('logo_icon')->nullable()->after('category');
            $table->string('pdf_file')->nullable()->after('logo_icon');
        });
    }
};
