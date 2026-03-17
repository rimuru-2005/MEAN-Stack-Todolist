const User = require("../../models/user.model");

async function createGuest() {
  const guest = new User({ username: "Guest" });

  return await guest.save();
}

async function createUserEmail(username, email, password) {
  const account = new User({ username, email, password });

  return await account.save();
}

async function createUserEmailAdmin(username, email, password) {
  const adminAccount = new User({ username, email, role: "admin", password });

  return await adminAccount.save();

  // both the above function and the below one works(use of await is only necessary when assigning the value to another variable)
  // return adminAccount.save();
}

async function validateUser(email) {
  return await User.findOne({ email }).select("+password");
}

module.exports = {
  createUserEmail,
  createGuest,
  createUserEmailAdmin,
  validateUser
};
