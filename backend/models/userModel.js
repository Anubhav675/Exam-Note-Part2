const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: "user" }, //e.g., 'user', 'admin', 'trainer'
  },
  { timestamps: true, versionKey: false }
);

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

module.exports = mongoose.model("User", userSchema);
