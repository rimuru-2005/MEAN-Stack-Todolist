const Task = require("../../models/task.model");

// get all taks form db
const getTasks = async (userId) => {
  // here a try catch is not used this service call will through error if db enquary fails which will be caught by the controller
  return Task.find({ userId });
};

// create a new Task
const createTask = async (userId, title) => {
  return Task.create({
    title,
    userId,
  });
};

// mark task
const markTask = async (userId, id, booldata) => {
  return Task.findOneAndUpdate(
    { _id: id, userId },
    { completed: booldata },
    { returnDocument: "after", runValidators: true },
  );
};

// delete task form db
const deleteTask = async (userId, id) => {
  return Task.findOneAndDelete({ _id: id, userId });
};

// const getOneTask = async (userId, id) => {
//     return Task.findOne({_id:id,userId})
// }

const editTask = async (userId, id, title) => {
  return Task.findOneAndUpdate(
    { userId, _id: id },
    { title },
    { returnDocument: "after", runValidators: true },
  );
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  markTask,
  editTask,
};
