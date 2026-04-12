
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# 💈 Miqothub

Sistem Antrean Barbershop adalah aplikasi berbasis Laravel 12 yang dirancang untuk membantu barbershop dalam mengatur jadwal layanan, antrean pelanggan, dan pengelolaan tukang cukur. Sistem ini mendukung **role user**, khususnya untuk admin, di landing page bisa diakses guest dan juga pelanggan.


## 🛠️ Instalasi dan Setup

Ikuti langkah-langkah berikut untuk menjalankan project ini secara lokal:

### 1. Clone Repository

```bash
git clone https://github.com/fiebryhoga/miqothub-v2.git
cd barbershop-antrean
````

### 2. Install Dependensi

```bash
composer install
npm install && npm run dev
```

### 3. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` sesuai konfigurasi database kamu, lalu jalankan:

```bash
php artisan key:generate
```

### 4. Setup Database

Pastikan database sudah tersedia, lalu jalankan:

```bash
php artisan migrate --seed
```




---

## 🤝 Kontribusi & 📄 Lisensi

Proyek ini dikembangkan oleh Difi Labs Studio. Kontribusi dan feedback sangat kami hargai. Silakan fork repo ini, buat perubahan yang dibutuhkan, dan kirim pull request.

---

Lisensi MIT.
=======
#
>>>>>>> fec71f7b25e0016c96a86dd919886ab54a247495
