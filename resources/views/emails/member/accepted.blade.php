<x-mail::message>
# Akses Kelas Berhasil Diaktifkan! 

Alhamdulillah, Halo **{{ $member->name }}**,

Kabar baik! Pembayaran Anda untuk kelas **{{ $course->nama }}** telah kami verifikasi secara manual. Saat ini, akses belajar Anda telah terbuka sepenuhnya.

<x-mail::panel>
**Informasi Kelas Anda:**
- **Nama Program:** {{ $course->nama }}
{{-- Gunakan pengecekan jika properti batch mungkin tidak ada --}}
- **Batch:** {{ $course->batch ?? 'Umum' }} 
- **Status Akun:** Aktif (Siap Belajar)
</x-mail::panel>

Ayo mulai langkah pertama Anda sekarang dengan mengeklik tombol di bawah ini:

<x-mail::button :url="route('dashboard')" color="success">
Mulai Belajar Sekarang
</x-mail::button>

Semoga proses belajarnya berjalan lancar, ilmunya bermanfaat, dan dilancarkan niat ibadahnya. Jika menemui kendala akses, silakan hubungi tim dukungan kami melalui WhatsApp atau balas email ini.

Salam hangat,<br>
**Tim {{ config('app.name') }}**
</x-mail::message>