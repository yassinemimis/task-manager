import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

// 🔑 hook pre-save -> يتشفر تلقائياً قبل الحفظ
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // لو كلمة السر ما تغيّرت ما نعيد التشفير
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🛠️ method لمقارنة كلمة المرور في login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
