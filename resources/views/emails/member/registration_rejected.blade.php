<x-mail::message>
# Update Status Pendaftaran

Halo **{{ $member->name }}**,

Terima kasih telah tertarik untuk bergabung dengan **{{ config('app.name') }}**.

Mohon maaf, pendaftaran Anda untuk kelas **{{ $courseNames }}** saat ini belum dapat kami setujui. Hal ini biasanya terjadi karena beberapa alasan, seperti:

- Bukti pembayaran yang diunggah tidak valid atau tidak terbaca.
- Nominal pembayaran tidak sesuai dengan tagihan.
- Data pendaftaran yang belum lengkap.

<x-mail::panel>
**Saran Tindakan:**
Silakan lakukan pengecekan kembali pada detail pendaftaran Anda atau hubungi tim administrasi kami melalui WhatsApp untuk bantuan verifikasi ulang.
</x-mail::panel>

Jangan berkecil hati, kami tetap menunggu kehadiran Anda di dalam kelas. Jika ada kesalahan dari sisi kami, mohon informasikan segera agar bisa kami perbaiki.

Salam hangat,<br>
**Tim {{ config('app.name') }}**
</x-mail::message>