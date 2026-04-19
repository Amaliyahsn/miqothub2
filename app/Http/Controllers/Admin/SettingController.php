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
        $settings = Setting::pluck('value', 'key')->toArray();
        
        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        // Daftar key diperbarui dengan menyertakan stat1 sampai stat4
        $keys = [
            'wa_admin', 
            'hero_description',
            'bank1_name', 'bank1_number', 'bank1_owner', 'bank1_active',
            'bank2_name', 'bank2_number', 'bank2_owner', 'bank2_active',
            'qris_active',
            // Key Statistik Dinamis
            'stat1_value', 'stat1_label',
            'stat2_value', 'stat2_label',
            'stat3_value', 'stat3_label',
            'stat4_value', 'stat4_label',
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

        // 2. Handle Update File QRIS
        if ($request->hasFile('qris_image')) {
            $request->validate([
                'qris_image' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);

            $oldPath = Setting::where('key', 'qris_path')->value('value');
            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('qris_image')->store('settings', 'public');

            Setting::updateOrCreate(
                ['key' => 'qris_path'],
                ['value' => $path]
            );
        }

        return back()->with('success', 'Pengaturan sistem berhasil diperbarui!');
    }
}