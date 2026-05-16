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
        // Kita ubah nama tabelnya menjadi 'transactions'
        Schema::table('transactions', function (Blueprint $table) {
            
            // Kita hanya menambah snap_token saja, ditaruh setelah kolom status
            $table->string('snap_token', 255)->nullable()->after('status');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            
            // Hapus kolom snap_token jika di-rollback
            $table->dropColumn('snap_token');
            
        });
    }
};