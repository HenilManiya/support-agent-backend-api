const multer = require("multer");

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./public/images");
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_o_g_${file.originalname}`);
  },
});

const uploadFile = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    fieldSize: 10 * 1024 * 1024, // 10 MB
  },
});

module.exports = {
  uploadFile,
};
