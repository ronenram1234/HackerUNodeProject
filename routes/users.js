const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Card = require("../models/Card");
const Joi = require("joi");
const bcrypt = require("bcrypt");

// register
const registerSchema = Joi.object({
  name: Joi.object({
    first: Joi.string().required().min(2),
    middle: Joi.string().allow("").optional(), // Optional field
    last: Joi.string().required().min(2),
  }).required(),

  phone: Joi.string()
    .pattern(/^[0-9\- ]{10,15}$/)
    .required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(7).required(),

  image: Joi.object({
    url: Joi.string().uri().allow(""),
    alt: Joi.string().allow(""),
  }),

  address: Joi.object({
    state: Joi.string().allow("").optional(), // Default empty allowed
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    houseNumber: Joi.number().required(),
    zip: Joi.number().optional(),
  }).required(),

  isAdmin: Joi.boolean().default(false), // Default value
  isBusiness: Joi.boolean().default(false),
});
router.post("/", async (req, res) => {
  try {
    console.log(req.body);

    // check input validation
    const { error } = await registerSchema.validateAsync(req.body);
    if (error) return res.status(400).send("error schema");

    // check if user already exist
    let user = await User.findOne({ email: req.body.email });

    if (user) return res.status(400).send("User already exists");

    // create User
    user = new User(req.body);

    // generate salt for hash method
    const salt = await bcrypt.genSalt(10);

    // create the encrypted password
    user.password = await bcrypt.hash(req.body.password, salt);

    const newUser = await user.save();

    return res.status(200).send(`post / sucessful ${newUser}`);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(`Invalide request - ${err.message}`);
  }
});

router.post("/login", async (req, res) => {
  try {
    return res.status(200).send("post /login sucessful");
  } catch (err) {
    res.status(400).send(`Invalide request - ${err.message}`);
  }
});

router.get("/", async (req, res) => {
  try {
    return res.status(200).send("get / sucessful");
  } catch (err) {
    res.status(400).send(`Invalide request - ${err.message}`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    return res.status(200).send("get /:id sucessful");
  } catch (err) {
    res.status(400).send(`Invalide request - ${err.message}`);
  }
});

router.put("/:id", async (req, res) => {
  try {
    return res.status(200).send("put /:id sucessful");
  } catch (err) {
    res.status(400).send(`Invalide request - ${err.message}`);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    return res.status(200).send("patch /:id sucessful");
  } catch (err) {
    res.status(400).send(`Invalide request - ${err.message}`);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    return res.status(200).send("delete /:id sucessful");
  } catch (err) {
    res.status(400).send(`Invalide request - ${err.message}`);
  }
});

module.exports = router;
