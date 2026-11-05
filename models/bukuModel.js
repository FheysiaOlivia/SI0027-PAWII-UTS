// TODO A: Rancang Schema & Model Buku sesuai tabel skema pada README.md
//
// Ketentuan:
//   judul      String, wajib diisi, spasi di awal/akhir dibuang
//   isbn       String, wajib, UNIK, harus tepat 13 digit angka
//   penulis    Array of String (EMBEDDED), minimal 1 penulis
//   penerbit   Subdocument (EMBEDDED, tanpa _id sendiri):
//                nama  String, wajib
//                tahun Number, 1900 s.d. tahun berjalan
//   kategoriId ObjectId (REFERENCING ke model "Kategori"), wajib
//   stok       Number, default 0, tidak boleh negatif
//   createdAt  Date, default waktu saat ini
//
// Petunjuk: lihat models/kategoriModel.js sebagai contoh sintaks dasar,
// dan materi Pertemuan 9-10 (embedding vs referencing).

const mongoose = require("mongoose");

// TODO A1: buat schema subdocument penerbit
const subdocumentSchema = new mongoose.Schema({
  nama: { type: String, required: true,},
  tahun: { type: Number, default: "1900", max: 2026},
  _id: false}
  );
// TODO A2: buat bukuSchema
const bukuSchema = new mongooseSchema({
    judul: { type: String, required: true, trim: true},
    isbn: {type: String, required: true, unique: true,},
    penulis: {type: String, required: true},
    kategoriId:{type: Types.ObjectId, ref: "Kategori" },
    stok: {type: Number, default: 0, negative: false},
    createdAt: {type: Date, default: Date.now}

})
// TODO A3: export model dengan nama "Buku"

module.exports = moongose.model("Buku", bukuSchema);
