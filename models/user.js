const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
    },
    password: {
      type: String,
      required: [true, "A user must have a passwod"],
      select: false,
      minLength: 6,
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
      validate: [validateEmail, "Enter a valid email address"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.validatePassword = async (input_password, user_password) => {
  return await bcrypt.compare(input_password, user_password);
};

module.exports = mongoose.model("User", userSchema);
