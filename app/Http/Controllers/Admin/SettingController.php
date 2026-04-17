<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        // Mengambil semua setting dan mengubahnya menjadi format key => value
        $settings = Setting::pluck('value', 'key')->toArray();
        
        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        // Daftar key input teks biasa
        $keys = [
            'wa_admin', 
            'bank1_name', 'bank1_number', 'bank1_owner', 'bank1_active',
            'bank2_name', 'bank2_number', 'bank2_owner', 'bank2_active',
            'qris_active' // Tambahkan status aktif QRIS
        ];

        // 1. Handle Update Input Teks
        foreach ($keys as $key) {
            if ($request->has($key)) {
                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $request->input($key)]
                );
            }
        }

        // 2. Handle Update File QRIS (Jika ada upload baru)
        if ($request->hasFile('qris_image')) {
            $request->validate([
                'qris_image' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);

            // Ambil path lama untuk dihapus jika ada
            $oldPath = Setting::where('key', 'qris_path')->value('value');
            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }

            // Simpan file baru
            $path = $request->file('qris_image')->store('settings', 'public');

            // Simpan path ke database dengan key 'qris_path'
            Setting::updateOrCreate(
                ['key' => 'qris_path'],
                ['value' => $path]
            );
        }

        return back()->with('success', 'Pengaturan sistem berhasil diperbarui!');
    }
}