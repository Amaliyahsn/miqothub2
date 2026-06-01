<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPhoneToUsersTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // 🔥 Menambahkan kolom phone (nullable atau default kosong agar user lama tidak error)
            // Diletakkan tepat di bawah kolom 'email' agar struktur tabel rapi
            $table->string('phone', 20)->nullable()->after('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Menghapus kolom kembali jika migrasi di-rollback
            $table->dropColumn('phone');
        });
    }
}