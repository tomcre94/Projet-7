const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const jwtSecret = process.env.JWT_TOKEN_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

exports.signup = async (req, res, next) => {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res
        .status(400)
        .json({ error: "L'adresse email n'est pas valide." });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé !' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Paire identifiant/mot de passe incorrecte' });
    }
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ message: 'Paire identifiant/mot de passe incorrecte' });
    }
    const idUser = user._id.toString();
    const token = jwt.sign({ userId: idUser }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });
    res.status(200).json({ userId: idUser, token });
  } catch (error) {
    res.status(500).json({ error });
  }
};
