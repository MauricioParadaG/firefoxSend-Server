const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");
const Links = require("../models/Link");

exports.uploadFile = async (req, res, next) => {
  const settingMulter = {
    limits: { fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 },
    storage: (fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname + "/../uploads");
      },
      filename: (req, file, cb) => {
        const extension = file.originalname.substring(
          file.originalname.lastIndexOf("."),
          file.originalname.length
        );
        cb(null, `${shortid.generate()}${extension}`);
      },
    })),
  };

  const upload = multer(settingMulter).single("documentFile");

  upload(req, res, async (error) => {
    //console.log(req.file);

    if (!error) {
      res.json({ documentFile: req.file.filename });
    } else {
      console.log(error);
      return next();
    }
  });
};

exports.deleteFile = async (req, res) => {
  //console.log(req.file);

  try {
    fs.unlinkSync(__dirname + `/../uploads/${req.file}`);
    console.log("The file was deleted");
  } catch (error) {
    console.log(error);
  }
};

exports.downloading = async (req, res, next) => {
  const { file } = req.params;
  const link = await Links.findOne({ name: file });

  const fileToDownload = __dirname + "/../uploads/" + file;
  res.download(fileToDownload);

  //delete, only if downloads === 1, not downloads left
  const { downloads, name } = link;

  if (downloads === 1) {
    req.file = name;

    await Links.findOneAndRemove(link.id);
    next();
  } else {
    link.downloads--;
    await link.save();
  }
};
