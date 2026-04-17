<x-mail::message>
# Alhamdulillah, Halo {{ $member->name }}!

Pembayaran Anda untuk kelas **{{ $course->nama }}** telah kami verifikasi. Akun Anda sekarang sudah aktif untuk mengakses materi tersebut.

Silakan klik tombol di bawah untuk mulai mengakses modul bimbingan Anda.

<x-mail::button :url="url('/dashboard')">
Mulai Belajar Sekarang
</x-mail::button>

Semoga ilmunya berkah dan dilancarkan ibadahnya.

Salam hangat,<br>
**Tim MiqotHub**
</x-mail::message>