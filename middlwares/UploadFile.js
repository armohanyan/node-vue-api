const multer = require('multer');
const fs = require('fs');
const path = require('path');

const imageFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Please upload only images.', false);
  }
};

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    const path = `./public/images/`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }

});

const uploadFile = multer({
  storage,
  fileFilter: imageFilter
});

module.exports = uploadFile;
