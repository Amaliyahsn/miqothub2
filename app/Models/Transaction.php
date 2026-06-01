<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
    'user_id',
    'kode_transaksi',
    'total_harga',
    'bukti_pembayaran',
    'status',
    'catatan_admin',
    'snap_token', // <--- TAMBAHKAN INI
];

    /**
     * Relasi: Transaksi ini milik siapa?
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi: Kelas (Course) apa saja yang ada di dalam transaksi ini?
     */
    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class)
                    ->withPivot('harga_saat_beli')
                    ->withTimestamps();
    }
}