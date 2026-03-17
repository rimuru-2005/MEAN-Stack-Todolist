const service = require("./task.service");

// get all tasks
const getTasks = async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await service.getTasks(userId);

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

// create a task
const createTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const newTask = await service.createTask(userId, title);

    res.status(201).json({
      success: true,
      task: newTask,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

// edit a task or to-do
const editTask = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.params.id;
    const { title } = req.body;

    // validate title and id
    if (!title) {
      return res.status(400).json({
        error: "Task title required to edit task",
      });
    }

    const editedTask = await service.editTask(userId, id, title);

    // validate editedTask if empty
    if (!editedTask) {
      return res.status(404).json({
        error: "Task Not Found",
      });
    }

    res.status(200).json({
      success: true,
      editedTask,
      message: "Task Edited Successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

// mark task completion
const markTask = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.params.id;
    const { completed } = req.body;

    // console.log(completed);
    const updatedTask = await service.markTask(userId, id, completed);

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      task: updatedTask,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

// delete task
const deleteTask = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.params.id;

    const deletedTask = await service.deleteTask(userId, id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  markTask,
  deleteTask,
  editTask,
};
