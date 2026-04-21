<x-mail::message>
{{-- Header Logo --}}
<div style="text-align: center;">
</div>  

Halo,

Kami menerima permintaan untuk mengatur ulang kata sandi akun **MiqotHub** Anda. Jangan khawatir, hal ini biasa terjadi! Silakan klik tombol di bawah ini untuk melanjutkan:

<x-mail::button :url="$url" color="primary">
Atur Ulang Kata Sandi
</x-mail::button>

**Penting untuk diketahui:**
* Tautan ini hanya berlaku selama **60 menit**.
* Jika Anda tidak merasa meminta perubahan ini, abaikan saja email ini. Akun Anda tetap aman dan tidak ada perubahan yang dilakukan.

Terima kasih.

Salam hangat,<br>
**Tim {{ config('app.name') }}**

<x-slot:subcopy>
Jika Anda mengalami kendala saat menekan tombol "Atur Ulang Kata Sandi", silakan salin dan tempel URL di bawah ini ke browser Anda:
<span class="break-all">[{{ $url }}]({{ $url }})</span>
</x-slot:subcopy>
</x-mail::message>