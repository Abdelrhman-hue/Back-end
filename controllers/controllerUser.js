const users = require("../module/usersShcema");

const getallusers = async (req, res) => {
  const users = await users.find({});
  if (!users) return res.status(404).send("No users found");
  res.status(200).json(users);
};

const getusersingle = async (req, res) => {
  const id = +req.params.id;
  const user = await users.findOne({ id: id });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.status(200).json(user);
};

const adduser = async (req, res) => {
  const newUser = new users(req.body);
  await newUser.save();
  console.log(newUser);
  res.status(201).json(newUser);
};

const updateuser = async (req, res) => {
  const id = +req.params.id;
  const user = await users.findOne({ id: id });
  if (!user) return res.status(404).json({ error: "User not found" });
  await users.updateOne({ id: id }, { $set: { ...req.body } });
  res.status(200).json({ message: "User updated successfully" });
};

const deleteuser = async (req, res) => {
  const id = +req.params.id;
  const user = await users.findOne({ id: id });
  if (!user) return res.status(404).json({ error: "User not found" });
  await users.deleteOne({ id: id });
  res.status(200).json({ message: "User deleted successfully" });
};

module.exports = {
  getallusers,
  getusersingle,
  adduser,
  updateuser,
  deleteuser,
};
