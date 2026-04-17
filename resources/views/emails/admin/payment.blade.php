<x-mail::message>
# Halo Admin MiqotHub,

Ada transaksi baru yang masuk. Mohon segera cek bukti pembayaran di Dashboard Admin.

**Detail Transaksi:**
- **Nama Member:** {{ $data['nama_member'] }}
- **Program Kelas:** {{ $data['nama_kelas'] }}
- **Metode Bayar:** {{ $data['metode_pembayaran'] }}

<x-mail::button :url="url('/admin/dashboard')">
Cek Dashboard Admin
</x-mail::button>

Terima kasih,<br>
Sistem Otomatis {{ config('app.name') }}
</x-mail::message>