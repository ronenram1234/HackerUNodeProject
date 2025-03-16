const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Card = require("../models/Card");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

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

    return res.status(200).send(newUser);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(`Invalide request - ${err.message}`);
  }
});

// login
const loginSchema = Joi.object({
  email: Joi.string().required().min(2).email(),
  password: Joi.string().required().min(8),
});

router.post("/login", async (req, res) => {
  try {
    // 1. body validation
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // 2. check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email or password are incorrect");

    // 3. compare the password
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(400).send("Email or password are incorrect");

    // 4. create token
    const token = jwt.sign(
      { _id: user._id, isBusiness: user.isBusiness, isAdmin: user.isAdmin },
      process.env.JWTKEY
    );
    res.status(200).send(token);
  } catch (error) {
    res.status(400).send(error);
  }
});

// get all users
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id);
    if (!user) return res.status(404).send("No such user");

    if (!user.isAdmin) return res.status(400).send("User is not Admin");
    const allUsers = await User.find().select("-password");

    return res.status(200).send(allUsers);
  } catch (err) {
    res.status(400).send(`Invalide request - ${err.message}`);
  }
});

// any register user ask for retrieve use by user_id
router.get("/:id", async (req, res) => {
  try {
    // const user = await User.findById(req.payload._id);
    // if (!user) return res.status(404).send("No such user");

    const reqUser = await User.findById(req.params.id).select("-password");
    if (!reqUser) return res.status(404).send("No such user");

    return res.status(200).send(reqUser);
  } catch (err) {
    res.status(400).send(`Invalide request - ${err.message}`);
  }
});

// Edit  user
router.put("/:id", auth, async (req, res) => {
  try {
    // verfiy user change only his own record
    const user = await User.findById(req.payload._id);
    if (!user) return res.status(404).send("No such user");

    if (req.payload._id !== req.params.id)
      return res.status(400).send("User can change only his own data");
    req.body.password = user.password;
    req.body.email = user.email;

    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if product exists + update
    const newUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(`Invalide request - ${err.message}`);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    if (req.payload._id !== req.params.id)
      return res.status(400).send("User can change only his own data");
    if (!Object.prototype.hasOwnProperty.call(req.body, "isBusiness")) {
      return res.status(400).send("Missing isBusiness field change");
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBusiness: req.body.isBusiness },
      { new: true }
    ).select("-password");
    console.log(user);
    if (!user) return res.status(400).send("No such user");
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(`Invalide request - ${err.message}`);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const reqUser = await User.findById(req.payload._id).select("-password");

    if (!reqUser) {
      return res.status(404).send("User doesn't exist");
    }

    // Ensure only the user themselves or an admin can delete
   
    

    if (!(reqUser.isAdmin || req.payload._id === req.params.id)) {
        return res
          .status(403)
          .send(
            "Unauthorized request - only a user can delete their own account, or an admin can delete any account"
          );
      }

    const product = await User.findByIdAndDelete(req.params.id);

    res.status(200).send("User has been deleted successfully!");
  } catch (err) {
    res.status(400).send(`Invalide request - ${err.message}`);
  }
});

module.exports = router;
