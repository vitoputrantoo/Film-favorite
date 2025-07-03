# Film-favorite
# Aplikasi Film Favorit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=flat&logo=mariadb&logoColor=white)](https://mariadb.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=flat&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![OMDB API](https://img.shields.io/badge/OMDB_API-FFC107?style=flat&logo=themoviedb&logoColor=black)](http://www.omdbapi.com/)

## Deskripsi Proyek

Aplikasi Film Favorit adalah aplikasi web full-stack sederhana yang memungkinkan pengguna untuk mencari film berdasarkan judul menggunakan OMDB API, menampilkan detail film (judul, tahun, poster), menyimpan film favorit ke database pribadi, dan melihat daftar film favorit mereka. Aplikasi ini dirancang dengan antarmuka pengguna yang modern, responsif, dan mendukung mode terang serta gelap untuk pengalaman menonton yang lebih nyaman.

## Fitur Unggulan

* **Pencarian Film:** Cari film dengan mudah berdasarkan judul menggunakan OMDB API.
* **Detail Film:** Tampilkan informasi relevan seperti judul, tahun rilis, dan poster film.
* **Manajemen Film Favorit (CRUD):**
    * **Create (Tambah):** Simpan film yang Anda sukai ke database favorit pribadi.
    * **Read (Lihat):** Tampilkan semua film yang telah Anda tandai sebagai favorit.
    * **Delete (Hapus):** Hapus film dari daftar favorit Anda kapan saja.
* **Antarmuka Pengguna Modern:** Menggunakan Bootstrap 5 untuk desain yang bersih dan responsif.
* **Mode Terang/Gelap:** Beralih antara tema terang dan gelap untuk kenyamanan visual.
* **Navigasi 4 Halaman:**
    * **Beranda:** Pengantar aplikasi dan fitur-fiturnya.
    * **Cari Film:** Halaman utama untuk mencari dan menambahkan film.
    * **Favorit Saya:** Halaman untuk melihat dan mengelola daftar film favorit.
    * **Tentang Kami:** Informasi tentang pengembang/owner aplikasi.

## Tampilan (Screenshots - opsional, tambahkan setelah aplikasi berjalan)

* **Beranda (Light Mode)**
    ![Homepage Light Mode](https://via.placeholder.com/600x400?text=Homepage+Light)
* **Cari Film (Dark Mode)**
    ![Search Page Dark Mode](https://via.placeholder.com/600x400?text=Search+Page+Dark)
* **Favorit Saya**
    ![Favorites Page](https://via.placeholder.com/600x400?text=Favorites+Page)
* **Tentang Kami**
    ![About Us Page](https://via.placeholder.com/600x400?text=About+Us+Page)

## Teknologi yang Digunakan

**Backend:**
* **Node.js:** Lingkungan runtime JavaScript.
* **Express.js:** Framework web minimalis dan fleksibel untuk Node.js.
* **MariaDB:** Sistem manajemen database relasional.
* **`mysql2/promise`:** Driver MySQL untuk Node.js dengan dukungan Promise.
* **`dotenv`:** Untuk mengelola variabel lingkungan (kredensial database).
* **`cors`:** Middleware untuk mengaktifkan Cross-Origin Resource Sharing.

**Frontend:**
* **HTML5:** Struktur konten web.
* **CSS3:** Styling dengan custom properties untuk mode terang/gelap.
* **Vanilla JavaScript:** Logika interaksi klien, panggilan API, dan manajemen DOM.
* **Bootstrap 5:** Framework CSS untuk desain responsif dan komponen UI.
* **OMDB API:** API eksternal untuk data film.

## Instalasi & Setup

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi secara lokal:

### 1. Dapatkan OMDB API Key

Aplikasi ini memerlukan kunci API dari OMDB.
* Kunjungi: [http://www.omdbapi.com/](http://www.omdbapi.com/)
* Daftar untuk mendapatkan kunci API gratis Anda. Anda akan menerima kunci melalui email.
* Simpan kunci ini, Anda akan membutuhkannya di langkah selanjutnya.

### 2. Klon Repositori

```bash
git clone <URL_REPO_ANDA>
cd movie_app
