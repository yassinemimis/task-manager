import Task from "../models/Task.js";

// ✅ جلب المهام الخاصة بالمستخدم
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ إنشاء مهمة مرتبطة بالمستخدم
export const createTask = async (req, res) => {
  const { title, description, priority, category, dueDate, subTasks } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      priority,
      category,
      dueDate,
      subTasks: subTasks || [],
      user: req.user._id, // 🔑 ربط بالمستخدم
    });

    await newTask.save();
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ تحديث مهمة مع التحقق من ملكية المستخدم
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id }, // 🔑 فقط لو المستخدم مالك المهمة
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "❌ Task not found or not authorized" });
    }

    res.json({ success: true, data: updatedTask });
  } catch (error) {
    console.error("❌ Error updating task:", error);
    res.status(500).json({ message: "⚠️ Server error" });
  }
};

// ✅ حذف مهمة
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deleted) {
      return res.status(404).json({ message: "❌ Task not found or not authorized" });
    }

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ حذف المهام المكتملة فقط للمستخدم
export const clearcompletedTask = async (req, res) => {
  try {
    await Task.deleteMany({ completed: true, user: req.user._id });
    const remaining = await Task.find({ user: req.user._id });
    res.json({ success: true, data: remaining });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ حذف جميع المهام للمستخدم
export const clearallTask = async (req, res) => {
  try {
    await Task.deleteMany({ user: req.user._id });
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ إضافة subTask لمهمة يملكها المستخدم
export const addSubTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, completed } = req.body;

  try {
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "عنوان المهمة الفرعية مطلوب" });
    }

    const task = await Task.findOne({ _id: taskId, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: "❌ Task not found or not authorized" });
    }

    const newSubTask = {
      title: title.trim(),
      description: description?.trim() || "",
      completed: completed ?? false,
    };

    task.subTasks.push(newSubTask);
    await task.save();

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    console.error("Error in addSubTask:", err.message);
    res.status(500).json({ message: "حدث خطأ في السيرفر" });
  }
};

// ✅ تعديل subTask
export const updateSubTask = async (req, res) => {
  const { taskId, subTaskId } = req.params;
  const { title, description, completed } = req.body;

  try {
    const task = await Task.findOne({ _id: taskId, user: req.user._id });
    if (!task) return res.status(404).json({ message: "❌ Task not found or not authorized" });

    const subTask = task.subTasks.id(subTaskId);
    if (!subTask) return res.status(404).json({ message: "المهمة الفرعية غير موجودة" });

    if (title !== undefined) subTask.title = title;
    if (description !== undefined) subTask.description = description;
    if (completed !== undefined) subTask.completed = completed;

    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ حذف subTask
export const deleteSubTask = async (req, res) => {
  const { taskId, subTaskId } = req.params;

  try {
    const task = await Task.findOne({ _id: taskId, user: req.user._id });
    if (!task) return res.status(404).json({ message: "❌ Task not found or not authorized" });

    task.subTasks = task.subTasks.filter(st => st._id.toString() !== subTaskId);
    await task.save();

    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
