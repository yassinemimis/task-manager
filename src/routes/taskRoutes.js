import express from "express";
import { getTasks, createTask, updateTask, deleteTask, clearcompletedTask, clearallTask,addSubTask, updateSubTask, deleteSubTask } from "../controllers/taskController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// المهام الرئيسية
router.get("/", protect, getTasks);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

// مسح المهام
router.delete("/clear/completed", protect, clearcompletedTask);
router.delete("/clear/all", protect, clearallTask);

// المهام الفرعية
router.post("/:taskId/subtasks", protect, addSubTask);
router.put("/:taskId/subtasks/:subTaskId", protect, updateSubTask);
router.delete("/:taskId/subtasks/:subTaskId", protect, deleteSubTask);

export default router;
