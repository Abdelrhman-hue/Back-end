const Users = require("../module/usersShcema");
const bcrypt = require("bcrypt");
const generateJWT = require("../utils/generateToken");
const httpresponser = require("../utils/httpjsend");
const roles = require("../utils/roles");
const sendCode = require("../utils/sendCode");

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

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
  });

  res.cookie("user", {
    email: user.email,
    fristname: user.fristname,
    lastname: user.lastname,
    id: user._id,
    roles: user.roles,
  });

  res.status(200).json({
    status: httpresponser.SUCCESS,
    data: {
      user: {
        email: user.email,
        fristname: user.fristname,
        lastname: user.lastname,
        id: user._id,
        roles: user.roles,
      },
    },
  });
};

// ------------------------------------------------------------------------------------------------------

// register user
const register = async (req, res) => {
  console.log(req.body);
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
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
    });

    const token = await generateJWT({
      email: newUser.email,
      fristname: newUser.fristname,
      lastname: newUser.lastname,
      id: newUser._id,
    });
    newUser.token = token;

    // generate 6 digit reset code and hash it and set expiry and save user
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeHash = await bcrypt.hash(resetCode, 10);
    const resetCodeExpiry = Date.now() + 15 * 60 * 1000; // code valid for 15 minutes
    newUser.resetCode = resetCodeHash;
    newUser.resetCodeExpiry = resetCodeExpiry;
    await newUser.save();

    // send email with reset code
    sendCode({ email: newUser.email, resetCode });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
    });

    res.cookie("user", {
      email: newUser.email,
      fristname: newUser.fristname,
      lastname: newUser.lastname,
      id: newUser._id,
    });

    res.status(201).json({ status: httpresponser.SUCCESS, data: newUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: httpresponser.ERROR, error: "Server error" });
  }
};

// ------------------------------------------------------------------------------------------------------

// reset password
const resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const user = await Users.findOne({ email: email });
  if (!user) {
    return res
      .status(404)
      .json({ status: httpresponser.FAIL, error: "User not found" });
  }
  // generate 6 digit reset code and hash it and set expiry and save user
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCodeHash = await bcrypt.hash(resetCode, 10);
  const resetCodeExpiry = Date.now() + 15 * 60 * 1000; // code valid for 15 minutes
  user.resetCode = resetCodeHash;
  user.resetCodeExpiry = resetCodeExpiry;
  await user.save();

  // send email with reset code
  sendCode({ email: user.email, resetCode });

  res
    .status(200)
    .json({ status: httpresponser.SUCCESS, message: "Reset code sent" });
};

// ------------------------------------------------------------------------------------------------------
// verify reset code

const verifyResetCode = async (req, res) => {
  const { email, resetCode, newPassword } = req.body;
  console.log(req.body);
  if (!email || !resetCode || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const user = await Users.findOne({ email: email });
  if (!user) {
    return res
      .status(404)
      .json({ status: httpresponser.FAIL, error: "User not found" });
  }

  const isMatch = await bcrypt.compare(resetCode, user.resetCode);
  if (!isMatch) {
    return res
      .status(400)
      .json({ status: httpresponser.FAIL, error: "Invalid reset code" });
  }

  if (Date.now() > user.resetCodeExpiry) {
    return res
      .status(400)
      .json({ status: httpresponser.FAIL, error: "Reset code expired" });
  }
  const token = await generateJWT({
    email: user.email,
    fristname: user.fristname,
    lastname: user.lastname,
    id: user._id,
    roles: user.roles,
  });
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetCode = undefined;
  user.resetCodeExpiry = undefined;
  user.token = token;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
  });

  await user.save();

  res.status(200).json({
    status: httpresponser.SUCCESS,
    message: "Password reset successful",
  });
};

// ------------------------------------------------------------------------------------------------------
// Get user
const getuser = async (req, res) => {
  const user = await Users.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ status: httpresponser.SUCCESS, data: user });
};

// ------------------------------------------------------------------------------------------------------
// logout user

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
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
  resetPassword,
  verifyResetCode,
  getuser,
  logout,
};
