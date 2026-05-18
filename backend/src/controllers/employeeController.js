const Employee = require("../models/Employee");

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map((skill) => String(skill).trim()).filter(Boolean);
  }

  if (typeof skills === "string") {
    return skills.split(",").map((skill) => skill.trim()).filter(Boolean);
  }

  return [];
};

const addEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create({
      ...req.body,
      skills: normalizeSkills(req.body.skills)
    });

    res.status(201).json({
      success: true,
      message: "Employee stored successfully",
      employee
    });
  } catch (error) {
    next(error);
  }
};

const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1, createdAt: -1 });

    res.json({
      success: true,
      count: employees.length,
      employees
    });
  } catch (error) {
    next(error);
  }
};

const searchEmployees = async (req, res, next) => {
  try {
    const { department, skill, minScore, maxScore, q } = req.query;
    const filter = {};

    if (department) filter.department = new RegExp(department, "i");
    if (skill) filter.skills = new RegExp(skill, "i");
    if (q) {
      filter.$or = [
        { name: new RegExp(q, "i") },
        { email: new RegExp(q, "i") },
        { department: new RegExp(q, "i") },
        { skills: new RegExp(q, "i") }
      ];
    }
    if (minScore || maxScore) {
      filter.performanceScore = {};
      if (minScore) filter.performanceScore.$gte = Number(minScore);
      if (maxScore) filter.performanceScore.$lte = Number(maxScore);
    }

    const employees = await Employee.find(filter).sort({ performanceScore: -1 });

    res.json({
      success: true,
      count: employees.length,
      employees
    });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.skills) payload.skills = normalizeSkills(payload.skills);

    const employee = await Employee.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    if (!employee) {
      res.status(404);
      throw new Error("Employee not found");
    }

    res.json({
      success: true,
      message: "Employee updated successfully",
      employee
    });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      res.status(404);
      throw new Error("Employee not found");
    }

    res.json({
      success: true,
      message: "Employee removed successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addEmployee,
  getEmployees,
  searchEmployees,
  updateEmployee,
  deleteEmployee
};
