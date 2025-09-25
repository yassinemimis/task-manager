import mongoose from "mongoose";

const subTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  description: { type: String }
});

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    category: { type: String, default: "personal" },
    dueDate: { type: String },
    subTasks: [subTaskSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ ربط بالمستخدم
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
