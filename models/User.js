import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define the User schema
const UserSchema = new mongoose.Schema({
  // User's email address
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
    unique: true,
  },
  // User's password
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
    select: false,
  },
  // User's first name
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 20,
    trim: true, // trims extra space.
  },
  // User's last name
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true, // trims extra space.
    default: "lastName",
  },
  // User's location
  location: {
    type: String,
    maxlength: 20,
    trim: true, // trims extra space.
    default: "my city",
  },
  role: {
    type: String,
    required: true,
    enum: ['teacher', 'student'],
    validate: {
      validator: (val) => ['teacher', 'student'].includes(val),
      message: 'Role must be either "teacher" or "student"',
    },
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value) => {
        const user = await mongoose.model('User').findById(value);
        return !!user; // Returns true if user exists, false otherwise
      },
      message: 'Invalid teacher ID. Must reference an existing user',
    },
  },
});

// Hash the password before saving the user
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create a JSON Web Token for the user
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Compare the user's password with a candidate password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

// Export the User model
export default mongoose.model("Users", UserSchema);
