<x-mail::message>
# Notifikasi Transaksi Baru

Halo Admin **MiqotHub**,

Laporan sistem menunjukkan adanya transaksi baru yang memerlukan perhatian Anda. Mohon segera melakukan verifikasi pada bukti pembayaran melalui panel admin.

<x-mail::panel>
### Ringkasan Pesanan
* **Nama Member:** {{ $data['nama_member'] }}
* **Program Kelas:** {{ $data['nama_kelas'] }}
* **Metode Bayar:** {{ $data['metode_pembayaran'] }}
</x-mail::panel>

<x-mail::button :url="route('admin.dashboard')" color="primary">
Verifikasi di Dashboard
</x-mail::button>

Jika tombol di atas tidak berfungsi, Anda dapat menyalin tautan berikut ke browser Anda:
[{{ route('admin.dashboard') }}]({{ route('admin.dashboard') }})

Terima kasih,<br>
**Tim Sistem {{ config('app.name') }}**
</x-mail::message>