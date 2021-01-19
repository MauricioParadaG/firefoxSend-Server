const express = require("express");
const router = express.Router();
const filesController = require("../controllers/filesController");
const auth = require("../middleware/auth");

router.post("/", auth, filesController.uploadFile);

router.get(
  "/:file",
  filesController.downloading,
  filesController.deleteFile
);

module.exports = router;
