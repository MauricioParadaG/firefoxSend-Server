const Links = require("../models/Link");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.newLink = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { original_name, name } = req.body;

  const link = new Links();
  link.url = shortid.generate();
  link.name = name;
  link.original_name = original_name;

  // User is auth?
  if (req.user) {
    const { password, downloads } = req.body;

    if (downloads) {
      link.downloads = downloads;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      link.password = await bcrypt.hash(password, salt);
    }

    link.author = req.user.id;
  }

  // BD
  try {
    await link.save();
    return res.json({ msg: `${link.url}` });
    next();
  } catch (error) {
    console.log(error);
  }
};

exports.getLink = async (req, res, next) => {
  // console.log(req.params.url);
  const { url } = req.params;

  console.log(url);

  const link = await Links.findOne({ url });

  if (!link) {
    res.status(404).json({ msg: "This url/link does not exist" });
    return next();
  }

  res.json({ file: link.name, password: false });

  next();
};
 
