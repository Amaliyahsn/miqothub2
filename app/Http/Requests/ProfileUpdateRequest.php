<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            
            // ✅ TAMBAHKAN VALIDASI UNTUK FIELD BARU DI SINI
            'phone' => ['required', 'string', 'max:20'],
            'pekerjaan' => ['nullable', 'string', 'max:255'],
            'umur' => ['nullable', 'integer', 'min:1'],
            'alamat' => ['nullable', 'string'],
            'status' => ['nullable', 'in:menikah,belum'],
            
            // ✅ Validasi agar foto yang diupload benar-benar gambar dan ukurannya aman (Maks 2MB)
            'foto_profile' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
        ];
    }
}