const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Tell us your name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Provide your email"],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Your email invalid"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Enter a password"],
    minLength: [8, "Password should be minimum 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords don't match",
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    console.log(this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
