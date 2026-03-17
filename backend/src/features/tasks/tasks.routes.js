const router = require("express").Router();
const controller = require("./tasks.controller");
const authMiddleware = require("../../middleware/authMiddleware");

// to get all tasks 
router.get("/", authMiddleware, controller.getTasks);

// to creat a new task  
router.post("/", authMiddleware, controller.createTask);

// to edit a task 
router.patch('/edit/:id', authMiddleware, controller.editTask);

// to mark a task 
router.patch("/:id", authMiddleware, controller.markTask);

// to delete a task
router.delete("/:id", authMiddleware, controller.deleteTask);

module.exports = router;
