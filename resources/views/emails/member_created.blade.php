@component('mail::message')
# Halo, {{ $user->name }}!

Akun Anda di MiqotHub telah berhasil didaftarkan oleh Admin. Berikut adalah detail akses Anda:

- **Email:** {{ $user->email }}
- **Password:** {{ $password }}

Silakan gunakan kredensial di atas untuk masuk ke akun Anda melalui halaman login.

@component('mail::button', ['url' => url('/login')])
Login Sekarang
@endcomponent

Terima kasih,<br>
Tim MiqotHub
@endcomponent