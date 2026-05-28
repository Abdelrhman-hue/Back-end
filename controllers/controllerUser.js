const Users = require("../module/usersShcema");
const bcrypt = require("bcrypt");
const generateJWT = require("../utils/generateToken");
const httpresponser = require("../utils/httpjsend");
const roles = require("../utils/roles");

// ------------------------------------------------------------------------------------------------------

// get all users
const getallusers = async (req, res) => {
  const users = await Users.find({});
  if (!users)
    return res
      .status(404)
      .json({ status: httpresponser.FAIL, error: "No users found" });
  res.status(200).json({ status: httpresponser.SUCCESS, data: users });
};

// ------------------------------------------------------------------------------------------------------

// login user
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const user = await Users.findOne({ email: email });
  if (!user)
    return res
      .status(404)
      .json({ status: httpresponser.FAIL, error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res
      .status(401)
      .json({ status: httpresponser.FAIL, error: "Invalid credentials" });

  const token = await generateJWT({
    email: user.email,
    fristname: user.fristname,
    lastname: user.lastname,
    id: user._id,
    roles: user.roles,
  });
  res.status(200).json({ status: httpresponser.SUCCESS, data: { token } });
};

// ------------------------------------------------------------------------------------------------------

// register user
const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password, roles } = req.body;

    if (!firstname || !lastname || !email || !password || !roles) {
      return res
        .status(400)
        .json({ status: httpresponser.FAIL, error: "All fields are required" });
    }

    // handle duplicate accounts
    const existing = await Users.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({
        status: httpresponser.FAIL,
        error: "Email already registered",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      fristname: firstname,
      lastname,
      email: email.toLowerCase(),
      password: hashedPassword,
      roles: roles || [roles.USER],
    });

    const token = await generateJWT({
      email: newUser.email,
      fristname: newUser.fristname,
      lastname: newUser.lastname,
      id: newUser._id,
      roles: newUser.roles,
    });
    newUser.token = token;

    await newUser.save();
    res.status(201).json({ status: httpresponser.SUCCESS, data: newUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: httpresponser.ERROR, error: "Server error" });
  }
};

// ------------------------------------------------------------------------------------------------------

// update user
const updateuser = async (req, res) => {
  const id = +req.params.id;
  const user = await Users.findOne({ id: id });
  if (!user) return res.status(404).json({ error: "User not found" });
  await Users.updateOne({ id: id }, { $set: { ...req.body } });
  res.status(200).json({ message: "User updated successfully" });
};
// delete user
const deleteuser = async (req, res) => {
  const id = +req.params.id;
  const user = await Users.findOne({ id: id });
  if (!user) return res.status(404).json({ error: "User not found" });
  await Users.deleteOne({ id: id });
  res.status(200).json({ message: "User deleted successfully" });
};

module.exports = {
  getallusers,
  login,
  register,
  updateuser,
  deleteuser,
};
