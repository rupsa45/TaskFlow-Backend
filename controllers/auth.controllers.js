const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      console.log("Please fill all fields");
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(409).json({ message: "user already exist!!" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hash,
    });
    res
      .status(201)
      .json({ message: "user registered successfully!!!", userId: user.id });
  } catch (error) {
    console.error("Error during user signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "invalid credentials" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "invalid password" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Logged in", token });
  } catch (error) {
    console.log("Login failed", error);
  }
};

exports.getProfile = async (req, res) => {
  const userId = req.user.userId;
//   console.log(userId);
  
  try {
    const profile = await User.findByPk(userId, {
      attributes: ["id", "username", "email"],
    });
    if (!profile) return res.status(404).json({ error: "user not found" });
    res.json({ profile });
  } catch (error) {
    console.log("error while fetching the profile", error);
    res.status(500).json({ error: "Fetching profile error" });
  }
};
