import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please add a valid email"],
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    }, // required only if not Google user
    minlength: 6,
    select: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // allows multiple nulls
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  picture: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["freelancer", "employer", "admin"],
    default: "freelancer",
  },
  // Profile Information
  bio: {
    type: String,
    maxlength: 500,
  },
  skills: [
    {
      type: String,
      trim: true,
    },
  ],
  location: {
    type: String,
    trim: true,
  },
  resume: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  // Professional Details
  company: {
    type: String,
    trim: true,
  },
  jobTitle: {
    type: String,
    trim: true,
  },
  experience: {
    type: String,
    enum: ["entry", "intermediate", "expert", ""],
    default: "",
  },
  hourlyRate: {
    type: Number,
    min: 0,
  },
  // Social Links
  socialLinks: {
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    portfolio: { type: String, trim: true },
    twitter: { type: String, trim: true },
  },
  // Profile Image
  profileImage: {
    type: String,
    default: "",
  },
  // Account Status
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Update the updatedAt timestamp
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
