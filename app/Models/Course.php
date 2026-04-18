<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Carbon\Carbon; // Pastikan Carbon diimport

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'slug',
        'deskripsi',
        'fitur',
        'harga',
        'harga_coret',
        'thumbnail',
        'link_grup_wa',
        'batch',
        'status',
        'kuota',
        'tanggal_mulai',
        'tanggal_selesai'
    ];

    /**
     * Tambahkan ini agar 'is_expired' otomatis ikut terkirim ke Inertia/Frontend
     */
    protected $appends = ['is_expired', 'thumbnail_url'];

    protected function casts(): array
    {
        return [
            'fitur' => 'array',
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
        ];
    }

    /**
     * Logic pengecekan apakah pendaftaran kelas sudah lewat tanggal pendaftaran
     */
    public function getIsExpiredAttribute(): bool
    {
        // Jika hari ini sudah melewati tanggal_selesai, maka dianggap expired
        if (!$this->tanggal_selesai) return false;
        
        return Carbon::parse($this->tanggal_selesai)->isPast();
    }

    /**
     * Accessor untuk mempermudah pemanggilan URL thumbnail
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        return $this->thumbnail ? asset('storage/' . $this->thumbnail) : null;
    }

    public function transactions(): BelongsToMany
    {
        return $this->belongsToMany(Transaction::class)
                    ->withPivot('harga_saat_beli')
                    ->withTimestamps();
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class)->orderBy('urutan', 'asc');
    }
}