// TODO D: Middleware error handling terpusat (Pertemuan 5 & 11-12)
// Didaftarkan PALING AKHIR pada app.js. Respons error SELALU berbentuk { message }.
//
// Pemetaan error -> status:
//   err.status ada (mis. { status: 404, message })  -> pakai status & message tersebut
//   ValidationError (Mongoose)                        -> 400, message dari error
//   CastError (format id/ObjectId salah)              -> 400, "Format <err.path> tidak valid"
//   Duplicate key (err.code === 11000)                -> 400, "Data dengan nilai unik tersebut sudah ada"
//   error lain yang tidak terduga                     -> 500, catat ke console.error,
//                                                        message ke client TETAP generik
//                                                        ("Terjadi kesalahan pada server"),
//                                                        stack trace jangan dibocorkan

function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  let status = err.status || err.statusCode || 500;
  let message = err.message || "Terjadi kesalahan pada server";

  if (err.name === "CastError") {
    status = 400;
    message = "ID atau format data tidak valid";
  }

  if (err.name === "ValidationError") {
    status = 400;
    message = err.message;
  }

  if (err.code === 11000) {
    status = 409;
    message = "Data sudah tersedia atau duplikat";
  }

  res.status(status).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
