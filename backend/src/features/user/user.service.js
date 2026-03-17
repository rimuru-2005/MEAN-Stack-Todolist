const User = require("../../models/user.model");

// to update the current user email or promote them form a guet user
async function addEmail(id, email, password) {
  return User.findByIdAndUpdate(
    id,
    { email, password },
    { returnDocument:'after', runValidators: true },
  );
}

// to get the curent user profile
async function getCurrentUser(id) {
  return User.findById(id);
}

// to update the user role or level
async function updateUserRole(id, role) {
  return User.findByIdAndUpdate(
    id,
    { role },
    { returnDocument:'after', runValidators: true },
  );
}

module.exports = {
  getCurrentUser,
  addEmail,
  updateUserRole,
};
