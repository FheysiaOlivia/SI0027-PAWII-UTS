// TODO B: Controller Buku - CRUD lengkap (Pertemuan 3-4, 9-12)
//
// Format error: lempar objek { status, message } (lihat middlewares/errorHandler.js),
// mis. throw { status: 404, message: "Buku tidak ditemukan" }
// express-async-errors sudah aktif di app.js, jadi tidak perlu try/catch.

const Buku = require("../models/bukuModel");

const MAX_LIMIT = 100;

// GET /buku
// Query opsional:
//   kategoriId  filter berdasarkan kategori
//   sort        nama field, urut ascending (default: createdAt)
//   page        default 1
//   limit       default 10, maksimum 100
//   fields      projection, dipisah koma, mis. fields=judul,isbn
// Respons 200: { data, page, limit, total }
//   - total = jumlah dokumen yang cocok dengan filter (BUKAN jumlah data pada halaman ini)
//   - data memuat kategoriId yang ter-populate (objek Kategori)
exports.getAll = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const requestedLimit = parseInt(req.query.limit, 10) || 10;
    const limit = Math.min(100, Math.max(1, requestedLimit));
    const skip = (page - 1) * limit;

    const filter = {};
    filter.kategori = {
        $regex: req.query.kategori,
        $options: "i",
      };


    const allowedSortFields = ["nama", "createdAt"];

    const sortField = allowedSortFields.includes(req.query.sort)
      ? req.query.sort
      : "nama";

    const sortOrder = req.query.order === "desc" ? -1 : 1;

    const allowedFields = ["nama", "createdAt"];

    let selectedFields = allowedFields;
    if (req.query.fields) {
      selectedFields = req.query.fields
        .split(",")
        .map((field) => field.trim())
        .filter((field) => allowedFields.includes(field));

      if (selectedFields.length === 0) {
        const err = new Error("Field yang diminta tidak valid");
        err.status = 400;
        throw err;
      }
    }
    const projection = selectedFields.join(" ");

    const [data, total] = await Promise.all([
      Buku.find(filter)
        .select(projection)
        .populate("kategoriId")
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit),
      Buku.countDocuments(filter),
    ]);

    res.json({
      success: true,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data,
    });

  // TODO B

// GET /buku/:id
//   - 200 -> dokumen buku, kategoriId ter-populate
//   - tidak ada -> 404 { message }
//   - format id salah -> 400 (ditangani errorHandler lewat CastError)
exports.getById = async (req, res) => {
  try {
    const data = await Buku.findById(req.params.id).populate("kategoriId");

    if (!data) {
      const err = new Error("Buku Tidak Ditemukan");
      err.status = 404;
      throw err;
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};
  // TODO B2
};

// POST /buku
//   - 201 -> dokumen yang baru dibuat
//   - validasi gagal / ISBN duplikat -> 400 (ditangani errorHandler)
exports.create = async (req, res) => {
  // TODO B3
  try {
    const buku = await Buku.create(req.body);
    res.status(201).json(buku);
  } catch (err) {
    next(err);
  }
};

// PUT /buku/:id
//   - 200 -> dokumen setelah diperbarui (bukan sebelum)
//   - validasi schema HARUS tetap berjalan saat update
//   - tidak ada -> 404 { message }
exports.update = async (req, res) => {
  // TODO B4
   try {
    const data = await Buku.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      const err = new Error("Id Buku tidak ditemukan");
      err.status = 404;
      throw err;
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


// DELETE /buku/:id
//   - 204 tanpa body
//   - tidak ada -> 404 { message }
exports.remove = async (req, res) => {
  // TODO B5
  try {
    const data = await Buku.findByIdAndDelete(req.params.id);

    if (!data) {
      const err = new Error("Buku tidak ditemukan");
      err.status = 404;
      throw err;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// const Buku = require("../models/bukuModel");
// const MAX_LIMIT = 100;

// // exports.getAll = async (req, res) => {
  
// //   try {
// //     const data = await Buku.find().populate("kategoriId");
// //     res.json(data);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // exports.getById = async (req, res) => {
// //   try {
// //     const data = await Buku.findById(req.params.id).populate("kategoriId");

// //     if (!data) {
// //       return res.status(404).json({ message: "Tidak ditemukan" });
// //     }

// //     res.json(data);
// //   } catch (err) {
// //     res.status(400).json({ message: err.message });
// //   }
// // };

// // exports.create = async (req, res) => {
// //   try {
// //     const Buku = await Buku.create(req.body);
// //     res.status(201).json(Buku);
// //   } catch (err) {
// //     res.status(400).json({ message: err.message });
// //   }
// // };

// // exports.update = async (req, res) => {
// //   try {
// //     const data = await Buku.findByIdAndUpdate(req.params.id, req.body, {
// //       new: true,
// //       runValidators: true,
// //     });

// //     if (!data) {
// //       return res.status(404).json({ message: "Tidak ditemukan" });
// //     }

// //     res.json(data);
// //   } catch (err) {
// //     res.status(400).json({ message: err.message });
// //   }
// // };

// // exports.remove = async (req, res) => {
// //   try {
// //     const data = await Buku.findByIdAndDelete(req.params.id);

// //     if (!data) {
// //       return res.status(404).json({ message: "Tidak ditemukan" });
// //     }

// //     res.status(204).send();
// //   } catch (err) {
// //     res.status(400).json({ message: err.message });
// //   }
// // };
// exports.getAll = async (req, res) => {
//   const filter = {};
//   if (req.query.kategoriId) {
//     filter.kategoriId = req.query.kategoriId;
//   }

//   const page = Math.max(parseInt(req.query.page) || 1, 1);
//   const limit = Math.min(parseInt(req.query.limit) || 10, MAX_LIMIT);
//   const sortField = req.query.sort || "createdAt";
//   const projection = req.query.fields ? req.query.fields.split(",").join(" ") : "";

//   const data = await Buku.find(filter)
//     .populate("kategoriId")
//     .select(projection)
//     .sort({ [sortField]: 1 })
//     .skip((page - 1) * limit)
//     .limit(limit);

//   const total = await Buku.countDocuments(filter);

//   res.json({ data, page, limit, total });
// };

// exports.getById = async (req, res) => {
//   const data = await Buku.findById(req.params.id).populate("kategoriId");
//   if (!data) throw { status: 404, message: "Tidak ditemukan" };
//   res.json(data);
// };

// exports.create = async (req, res) => {
//   const Buku = await Buku.create(req.body);
//   res.status(201).json(Buku);
// };

// exports.update = async (req, res) => {
//   const data = await Buku.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!data) throw { status: 404, message: "Tidak ditemukan" };
//   res.json(data);
// };

// exports.remove = async (req, res) => {
//   const data = await Buku.findByIdAndDelete(req.params.id);
//   if (!data) throw { status: 404, message: "Tidak ditemukan" };
//   res.status(204).send();
// };
