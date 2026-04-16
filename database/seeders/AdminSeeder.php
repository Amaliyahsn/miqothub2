<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrator Haji',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password.'),
            'role' => 'admin',
            'status_akun' => 'aktif',
            'foto_profile' => null,
        ]);
    }
}