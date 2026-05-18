const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Employee name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Employee email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    trim: true
  },
  skills: {
    type: [String],
    required: [true, "At least one skill is required"],
    validate: {
      validator: (skills) => Array.isArray(skills) && skills.length > 0,
      message: "At least one skill is required"
    }
  },
  performanceScore: {
    type: Number,
    required: [true, "Performance score is required"],
    min: [0, "Performance score cannot be below 0"],
    max: [100, "Performance score cannot be above 100"]
  },
  experience: {
    type: Number,
    required: [true, "Years of experience is required"],
    min: [0, "Experience cannot be negative"]
  }
}, { timestamps: true });

employeeSchema.index({ department: 1, performanceScore: -1 });

module.exports = mongoose.model("Employee", employeeSchema);
