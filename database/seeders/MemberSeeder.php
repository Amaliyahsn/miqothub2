<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MemberSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Member Haji 01',
            'email' => 'member@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'member',
            'foto_profile' => null,
            'alamat' => 'Jl. Kebon Jeruk No. 12, Jakarta',
            'pekerjaan' => 'PNS',
            'status' => 'menikah',
        ]);
    }
}