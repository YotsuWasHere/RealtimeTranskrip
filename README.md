# Subtitle Studio

Subtitle realtime dari mic dengan animasi masuk/keluar, highlight per kata, glow, tema UI, rekaman sesi, dan overlay untuk OBS.

## Cara 1: Pakai server (disarankan, overlay transparan di OBS)
1. Pasang Node.js (nodejs.org), lalu jalankan `start-windows.bat` (Windows) atau `start-mac-linux.sh`.
2. Chrome/Edge terbuka di http://localhost:3000. Klik "Mulai mic".
3. Di OBS: Sources > + > Browser, URL `http://localhost:3000/overlay.html`, lebar 1920, tinggi 1080. Latar otomatis transparan.
4. Streamlabs Desktop dan TikTok LIVE Studio: tambahkan Browser/Web Source dengan URL yang sama.
5. Semua pengaturan di Studio langsung berlaku di overlay. Biarkan tab Studio tetap terbuka (mic jalan di sini).

## Cara 2: Tanpa server (chroma key)
Buka `index.html` di Chrome/Edge, atur gaya, aktifkan "Mode OBS: latar hijau", klik "Mode OBS" (Esc untuk keluar). Di OBS: Window Capture ke jendela itu + filter Chroma Key.

## Fitur
- 13 animasi masuk (pop, spring, bounce, ramping→melebar, pop ke samping, dst.) dan 8 animasi keluar (pop down, berhamburan, dst.), dengan kekuatan, durasi, dan jeda antar kata.
- Highlight hanya kata yang baru diucapkan (atau pelangi / mati), glow, hollow outline, stroke, kotak/garis bawah/tanpa background.
- Teks panjang otomatis turun baris; mode geser atau ganti halaman; lebar area bisa diatur.
- Kata kunci berwarna dan membesar, sensor kata, teks reaktif volume, Auto Translate (butuh internet), meter mic.
- REC: rekam sesi lalu unduh .srt atau .txt.
- Autocorrect (kamus, kosakata, AI konteks) dengan saklar on/off.
- 6 tema UI + warna aksen kustom, 6 Quick Preset, 6 tema warna teks, ekspor/impor pengaturan.

## Autocorrect
Kartu "Autocorrect" punya saklar utama (on/off) dan dua lapisan:
1. **Lokal (instan, offline)**: *Kamus koreksi* (`gua=gue, tiktok=TikTok`) dan *Kosakata penting* (nama, brand, istilah). Kata yang bunyinya mirip kosakata otomatis disamakan, mis. "valoran" jadi "Valorant".
2. **AI konteks** (opsional): memeriksa kata sebelum dan sesudah setiap kata. Kata yang tidak nyambung diganti satu per satu, dengan kilatan singkat. Pakai API key Claude milik sendiri (kunci hanya disimpan di browser dan tidak ikut ekspor/overlay), atau Chrome AI bawaan bila tersedia. Koreksi muncul sekitar 1 detik setelah kata tampil.

## Bahasa
37 bahasa bicara (termasuk Indonesia, Jawa, Sunda, Melayu, Inggris, Jepang, Korea, Mandarin, Kanton, Arab, Thai, Vietnam, dan Eropa) dan 24 bahasa terjemahan. Kualitas tergantung dukungan Chrome per bahasa.

## Izin mic diminta terus?
Itu terjadi kalau `index.html` dibuka langsung (alamat diawali `file://`): Chrome tidak menyimpan izin mic untuk file lokal. Buka lewat `http://localhost:3000` (jalankan start-windows.bat atau start-mac-linux.sh). Tanpa Node.js, jalankan `python -m http.server 8000` di folder ini lalu buka `http://localhost:8000`. Izin cukup sekali dan tersimpan.

## Mic menyala tapi tidak ada teks?
Lihat baris "Terdengar:" di kartu Mic Engine:
- Kalau teks muncul di situ tapi tidak di layar, cek pengaturan Auto-clear, Maks. kata, dan Background preview.
- Kalau kosong, baca pesan di bawah tombol: izin ditolak, mic dipakai aplikasi lain (OBS/Discord/Zoom), atau tidak ada internet ke server suara Google.
- Pastikan mic yang benar dipilih di pengaturan suara Windows/Chrome (chrome://settings/content/microphone).

## Catatan
- Speech recognition memakai layanan Chrome/Edge dan butuh internet.
- Tambah animasi baru: tulis keyframes dan class `.in-nama` / `.out-nama` di `css/subtitle.css`, lalu daftarkan di `SCHEMA` pada `js/studio.js`.
