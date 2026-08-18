# Jawaban Pertanyaan Technical Test NTX
---

## BAB 01: AI-Assisted Problem Solving (Promise Queue)

### BAG 2: Pemanfaatan AI

**1. Prompt yang saya gunakan**

Kurang lebih seperti ini: "Buatkan fungsi TypeScript `promiseQueue(tasks)` yang menjalankan array of async task satu per satu secara berurutan (bukan paralel), kumpulkan setiap hasilnya ke dalam array sesuai urutan, lalu kembalikan seluruh hasil setelah semua task selesai. Buat versi paling sederhana dahulu tanpa error handling, gunakan async/await, dan sertakan tipe generic agar type-safe. Contoh input: `[() => Promise.resolve('Task 1'), () => Promise.resolve('Task 2')]`, output yang diharapkan `['Task 1', 'Task 2']`."

**2. Alasan memilih prompt tersebut dan strategi prompting saya**

Saya selalu menyebutkan requirement secara eksplisit, terutama frasa "berurutan / bukan paralel". Sebab jika tidak ditegaskan, AI sering langsung memberikan solusi menggunakan `Promise.all` yang berjalan paralel, padahal maksud saya berbeda. Saya juga menyertakan contoh input dan output yang konkret, karena menurut saya itu cara paling efektif agar AI memahami bentuk data yang saya harapkan, bukan sekadar dari deskripsi. Selain itu, saya meminta versi paling sederhana terlebih dahulu, baru saya kembangkan sendiri. Alasannya agar kodenya mudah dibaca dan saya tetap memegang kendali saat menambahkan bagian yang lebih kompleks (seperti error handling pada BAB 02).

**3. Apakah hasil AI langsung digunakan atau dimodifikasi?**

Tidak langsung saya gunakan. Struktur intinya (loop `for...of` + `await` + `push`) saya pertahankan karena sudah benar, tetapi saya ubah beberapa bagian: tipe generic `<T>` saya perjelas, komentar saya tulis dalam bahasa Inggris agar konsisten, dan file-nya saya letakkan sesuai struktur folder FSD di `src/challenges/`. Untuk BAB 02, versi `promiseQueueSettled` saya turunkan sendiri.

**4. Alasan modifikasi**

Utamanya agar type-safe (generic membuat fungsinya reusable untuk tipe hasil apa pun), agar konsisten dengan coding style yang saya gunakan, dan agar dapat saya uji melalui unit test. Saya juga ingin memahami setiap baris, bukan sekadar menyalin.

**5. Kelebihan solusinya**

Sederhana dan mudah dibaca. Urutan eksekusinya pasti terjaga karena setiap task menunggu task sebelumnya. Selain itu, karena menggunakan generic, tipenya aman.

**6. Kekurangannya**

Sifatnya fail-fast: jika satu task reject, seluruh antrean langsung berhenti dan hasil yang sudah selesai ikut hilang. Selain itu belum ada concurrency control, sehingga jika task-nya banyak dan sebenarnya independen, prosesnya bisa lambat.

**7. Jika diberi kesempatan untuk memperbaiki**

Saya akan membungkus setiap task dengan try/catch di dalam loop, agar satu task yang gagal tidak mematikan sisanya dan error-nya tetap tercatat (persis seperti `promiseQueueSettled`). Jika membutuhkan throughput lebih, saya akan menambahkan batas concurrency untuk task yang independen.

---

## BAB 02: Explain & Review AI Output

### BAG 1: Memahami Kode

**1. Alur program langkah demi langkah**

Fungsi menerima `tasks`, yaitu array berisi function yang masing-masing mengembalikan Promise. Pertama, `results` diisi array kosong. Kemudian loop `for...of` berjalan ke setiap task: `await task()` menunggu Promise-nya selesai, lalu hasilnya di-`push` ke `results`. Karena `await` berada di dalam loop, setiap task baru dijalankan setelah task sebelumnya selesai, sehingga urutannya terjaga. Setelah semua selesai, `results` dikembalikan berisi seluruh hasil sesuai urutan aslinya.

**2. Mengapa menggunakan async/await dibanding .then()?**

Lebih mudah dibaca, karena kode async terlihat seperti kode sinkron biasa yang berjalan dari atas ke bawah. Error handling-nya juga cukup menggunakan try/catch biasa. Jika menggunakan `.then()`, kode mudah menjadi nested dan makin sulit diikuti, apalagi jika berada di dalam loop dan perlu menunggu satu per satu.

**3. Mengapa for...of? Bagaimana jika menggunakan forEach async?**

`for...of` mendukung `await` yang benar-benar menunggu, sehingga loop berhenti sejenak setiap menemui `await`. Jika diganti dengan `tasks.forEach(async (task) => { await task() })`, hasilnya berbeda. `forEach` tidak memperhatikan Promise yang dikembalikan callback-nya, sehingga tidak menunggu. Akibatnya semua task berjalan hampir bersamaan (paralel), urutannya tidak terjamin, dan saat fungsi mengembalikan nilai, `results`-nya kemungkinan masih kosong karena task-nya belum selesai. Jadi `forEach` tidak cocok untuk async yang harus berurutan.

**4. Tujuan array results, mengapa hasilnya disimpan ke sana?**

Untuk menampung hasil setiap task secara berurutan, agar di akhir seluruhnya dapat dikembalikan sekaligus sebagai satu array. Pemanggil fungsi ini membutuhkan semua hasil, bukan hanya yang terakhir, sehingga dikumpulkan terlebih dahulu baru di-return.

### BAG 2: Analisis & Critical Thinking

**5. Apa yang terjadi jika salah satu task gagal?**

Saat `await` sampai ke task kedua yang berisi `Promise.reject("Task 2 Error")`, karena tidak ada try/catch, error-nya langsung dilempar keluar dari fungsi. Akibatnya Promise yang dikembalikan `promiseQueue` ikut menjadi rejected dengan alasan "Task 2 Error", dan `results` tidak pernah sampai di-return.

**6. Apakah task ketiga tetap dijalankan?**

Tidak. Begitu `await` pada task kedua melempar error, eksekusi fungsi langsung berhenti di titik itu (keluar dari loop karena exception), sehingga iterasi ketiga tidak pernah terjadi.

**7. Menurut saya, apakah perilaku tersebut sudah sesuai?**

Tergantung kebutuhannya. Perilaku fail-fast seperti ini cocok untuk task yang saling bergantung, misalnya jika langkah pertama gagal maka langkah berikutnya memang sia-sia dijalankan. Namun jika tujuannya mengumpulkan semua hasil walaupun ada yang gagal, pendekatan ini justru tidak sesuai, karena satu kegagalan langsung mematikan sisanya. Jadi sesuai atau tidaknya bergantung pada apakah task-nya independen atau tidak.

**8. Bagaimana cara memperbaikinya (agar task berikutnya tetap berjalan, error tercatat, dan semua hasil dikembalikan)?**

Saya akan membungkus setiap `await task()` dengan try/catch di dalam loop. Jika sukses, simpan hasilnya sebagai `{ status: 'fulfilled', value }`. Jika gagal, catat sebagai `{ status: 'rejected', reason }`, lalu lanjutkan ke task berikutnya. Di akhir, seluruh outcome dikembalikan. Konsepnya mirip `Promise.allSettled`, bedanya tetap berjalan berurutan. Implementasinya ada pada fungsi `promiseQueueSettled`.

### BAG 3: Evaluasi Solusi AI

**9. Kelebihan solusi dari AI**

Sederhana, ringkas, dan mudah dipahami orang lain. Urutannya juga terjaga tanpa perlu kode tambahan.

**10. Kekurangannya**

Tidak ada error handling sama sekali (fail-fast), tidak mendukung concurrency, dan tidak ada fitur seperti timeout, retry, atau laporan progress.

**11. Apakah saya akan langsung menggunakannya di production?**

Tidak langsung, tergantung konteksnya. Jika task-nya independen, saya perlu menambahkan error handling per task terlebih dahulu. Jika volumenya besar, diperlukan concurrency control agar tidak lambat. Jadi harus disesuaikan dahulu sebelum masuk production.

**12. Apakah ada pendekatan lain? (chaining, reduce, recursive)**

Ada beberapa:

- `Array.reduce()` untuk melakukan chaining Promise. Tetap berurutan, tetapi menurut saya lebih sulit dibaca dibanding `for...of`.
- Rekursif. Juga berurutan dan bagi sebagian orang terlihat elegan, tetapi bisa boros call stack jika task-nya sangat banyak.
- `Promise.all(tasks.map(t => t()))`. Ini paralel sehingga cepat, tetapi urutan eksekusinya tidak terjamin dan sifatnya fail-fast. Semantiknya berbeda, bukan sequential.

Pilihan saya tetap `for...of` + `await`, karena paling mudah dibaca dan sesuai dengan requirement yang meminta eksekusi berurutan.

---

## BAB 03: VueJS + Vector Map

**1. Library pemetaan yang saya pilih dan alasannya**

Saya memilih MapLibre GL JS. Library ini open-source (fork dari Mapbox GL JS sebelum versinya menjadi berbayar), me-render vector tiles menggunakan WebGL, dan gratis tanpa API key. Untuk basemap-nya saya menggunakan OpenFreeMap (`tiles.openfreemap.org/styles/liberty`), yang datanya berasal dari OpenStreetMap, tanpa registrasi dan tanpa batas request. MapLibre juga sudah mendukung GeoJSON source, circle dan symbol layer, clustering bawaan, serta `fitBounds`, sehingga seluruh kebutuhan soal ini terpenuhi tanpa library tambahan.

**2. Mengapa saya memilih pendekatan visualisasi tertentu (GeoJSON + layer)?**

Saya me-render sekolah melalui GeoJSON source + circle layer beserta clustering, bukan membuat marker DOM satu per satu. Alasannya, marker DOM berat jika titiknya banyak, karena setiap marker menjadi elemen HTML tersendiri. Sedangkan layer GeoJSON di-render oleh GPU, sehingga jauh lebih ringan dan skalabel. Clustering juga membuat peta tetap terbaca ketika banyak titik menumpuk di satu area.

**3. Perbedaan raster map dan vector map**

Raster map berupa gambar (tile) yang sudah jadi per zoom level, contohnya Google Maps model lama. Saat di-zoom bisa pecah atau blur, style-nya statis, dan ukurannya relatif besar. Vector map mengirimkan data geometri (titik, garis, poligon) yang baru di-render di sisi client. Hasilnya tajam pada semua zoom, style-nya dapat diubah secara dinamis (warna, layer, dan sebagainya), serta lebih ringan karena yang dikirim adalah data, bukan gambar.

**4. Jika endpoint mengembalikan 50.000 sekolah, apakah pendekatan saat ini masih optimal?**

Untuk skala puluhan ribu, marker DOM jelas tidak sanggup. Namun pendekatan GeoJSON + clustering yang saya gunakan sudah cukup tahan, karena rendering-nya berada di GPU. Untuk skala tersebut, saya akan menambahkan beberapa hal: mengambil data sesuai area peta yang sedang terlihat (viewport-based loading), mempertimbangkan clustering di sisi server atau menggunakan vector tiles, serta memperbarui data melalui `source.setData()` alih-alih me-render ulang komponen. Jika parsing datanya berat, prosesnya dapat dipindahkan ke Web Worker agar UI tidak membeku.

**5. Cara mengurangi render ulang peta yang tidak perlu**

Yang terpenting, instance `map` tidak diletakkan di dalam reactive state Vue yang dalam. Saya menyimpannya pada variabel biasa (atau `shallowRef`) agar Vue tidak melacak isinya. Pembaruan data cukup melalui `source.setData()`, bukan me-mount ulang komponennya. Saya juga membatasi `watch` hanya pada data yang relevan, dan menghindari hal yang membuat peta ter-inisialisasi ulang setiap kali ada prop lain yang berubah.

**6. Jika data perlu diperbarui berkala atau realtime, perubahan arsitektur apa yang dilakukan?**

Saya akan memisahkan urusan data dari urusan peta. Pembaruan diambil melalui polling atau WebSocket di composable/store terpisah, kemudian peta cukup diperbarui melalui `source.setData()` secara incremental (membandingkan data lama dengan data baru). Pembaruan tersebut saya debounce agar tidak terlalu sering di-render, dan posisi/zoom peta saya jaga agar tampilan pengguna tidak ter-reset setiap kali ada data masuk.

---

## BAB 04: VueJS + GraphQL

**1. Perbedaan mengambil data melalui REST dan GraphQL**

REST memiliki banyak endpoint, dan bentuk response-nya ditentukan oleh server. Sering kali pada akhirnya terjadi over-fetch (data yang diterima berlebih) atau under-fetch (perlu memanggil beberapa endpoint untuk data yang lengkap). GraphQL hanya memiliki satu endpoint, dan yang menentukan field mana yang diambil adalah kita di sisi client. Satu request juga dapat langsung mengambil data nested sekaligus.

**2. Mengapa GraphQL menggunakan variables, bukan menyisipkan keyword langsung ke query string?**

Karena variables memisahkan query (yang statis) dari datanya (yang dinamis). Dengan begitu query dapat di-cache dan digunakan ulang, lebih aman dari injection, dan tipenya divalidasi oleh server. Jika keyword disisipkan langsung ke string, selain rawan salah, juga lebih berisiko dari sisi keamanan.

**3. Risiko jika query mengambil terlalu banyak field**

Response menjadi berat, waktu loading meningkat, serta boros bandwidth dan memori di client. Di sisi server juga bisa terkena batas kompleksitas atau rate limit. Intinya terjadi over-fetching yang tidak perlu.

**4. Cara mencegah race condition ketika pengguna mengetik cepat**

Saya menggunakan stale-response guard dengan request ID, sehingga hanya response dari request paling akhir yang boleh mengubah state (ini sudah saya implementasikan pada composable-nya). Alternatif lain adalah menggunakan `AbortController` untuk membatalkan request lama. Ditambah debounce pada input, jumlah request-nya juga jauh berkurang.

**5. Jika response GraphQL memiliki struktur nested yang kompleks, bagaimana menjaga agar komponen Vue tetap bersih?**

Saya menggunakan data mapper (misalnya fungsi `mapAnime`) untuk mengubah response mentah menjadi tipe yang bersih (`AnimeItem`) sebelum masuk ke UI. Proses fetch dan mapping saya bungkus di dalam composable, sehingga komponen hanya menerima data yang sudah siap pakai dan tidak perlu mengutak-atik struktur nested secara langsung.

**6. Kapan saya akan memilih Apollo Client dibanding fetch biasa?**

Apollo baru layak dipertimbangkan jika membutuhkan normalized cache, banyak query yang saling terkait, manipulasi cache, optimistic update, subscription untuk realtime, atau aturan pagination yang kompleks. Untuk kasus sesederhana pencarian anime seperti ini, `graphql-request` atau `fetch` sudah cukup dan lebih ringan, sehingga saya memilih opsi tersebut.

---

## Bukti Eksekusi (BAB 01 & 02)

Fungsi Promise Queue saya verifikasi melalui demo (`tsx`) dan unit test (`vitest`).

**1. Demo melalui `npx tsx src/challenges/promise-queue/promise-queue-demo.ts`**

```text
promiseQueue: [ 'Task 1', 'Task 2', 'Task 3' ]
promiseQueueSettled: [
  { status: 'fulfilled', value: 'Task 1' },
  { status: 'rejected', reason: 'Task 2 Error' },
  { status: 'fulfilled', value: 'Task 3' }
]
```

**2. Unit test melalui `npm test`**

```text
 RUN  v4.1.10

 ✓ src/challenges/promise-queue/promise-queue.test.ts (3 tests) 48ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
```

Test `preserves execution order` inilah yang membuktikan eksekusinya benar-benar sequential: task pertama sengaja diberi delay 30ms dan tetap selesai lebih dahulu daripada task kedua yang hanya 10ms. Jika berjalan paralel, urutannya pasti terbalik.

---

## Catatan Asumsi Teknis

- Autentikasi saya buat sebagai mock. Endpoint yang disediakan (data sekolah dan AniList) tidak memiliki login API, dan HttpOnly cookie hanya dapat di-set dari backend, sehingga alur JWT lengkapnya saya simulasikan di sisi client. Yang tetap saya tunjukkan: access token (60 detik) beserta refresh token, silent refresh di background, route guard, dan RBAC (role admin/user). Pada production nanti, refresh token akan disimpan di HttpOnly cookie oleh server, dan sesi dipulihkan saat aplikasi pertama kali dibuka. Konsekuensi dari mock ini, memuat ulang halaman menyebabkan logout, karena token disimpan di memory (sengaja bukan localStorage, agar aman dari XSS sesuai anjuran pada soal). Akun demo: `admin@ntx.test / admin123` dan `user@ntx.test / user123`.
- Basemap peta menggunakan OpenFreeMap (`tiles.openfreemap.org/styles/liberty`), yang bersifat vector dan gratis tanpa API key maupun registrasi, agar reviewer dapat langsung menjalankan tanpa menyiapkan kredensial. Label jumlah pada cluster menggunakan font `Noto Sans Bold`, karena glyph server OpenFreeMap menyediakan Noto, bukan Open Sans yang menjadi default spec.
- Terkait styling, Tailwind v4 menggunakan CSS cascade layers. CSS bawaan MapLibre saya import melalui `layer(components)` agar utility Tailwind tetap diprioritaskan. Jika tidak, `.maplibregl-map { position: relative }` akan menimpa `.absolute` dan membuat peta tampil kosong.

## Catatan Penggunaan AI

- AI saya gunakan untuk: membuat draft awal fungsi Promise Queue, menjelaskan konsep GraphQL dan MapLibre yang belum saya kuasai, serta menyusun kerangka composable.
- Bagian yang saya ubah sendiri: menambahkan tipe TypeScript, menyesuaikan ke struktur FSD, mengganti nama variabel agar lebih jelas, dan memastikan perilakunya melalui unit test.
- Bagian yang saya kerjakan/pahami sendiri: (sebutkan bagian yang Anda kerjakan tanpa AI, misalnya debugging map, styling, atau logika tertentu).
