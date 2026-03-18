const User = require("../../models/user.model");
const Task = require("../../models/task.model");

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

// to delete a user account using id and also deleting all related tasks 
async function deleteUser(id) {
  // here using promise .all to exexcutre multiple async await calls at once in parallel
  const [deletedUser] = await Promise.all([
    User.findByIdAndDelete(id),
    Task.deleteMany({ userId: id }),
  ]);

  return deletedUser;
}

module.exports = {
  getCurrentUser,
  addEmail,
  updateUserRole,
  deleteUser,
};
