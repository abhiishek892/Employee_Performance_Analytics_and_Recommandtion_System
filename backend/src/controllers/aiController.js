const axios = require("axios");
const Employee = require("../models/Employee");

const buildPrompt = (employees) => `
Analyze the following employee performance data for an HR/Admin user.

Return a practical report with these sections:
1. Employee ranking from strongest to weakest
2. Promotion recommendations with reasons
3. Training suggestions for skill gaps
4. Feedback for each employee
5. Short HR action plan

Rules:
- High performance score means 80 or above.
- Low performance score means below 60.
- Consider skills, department, performance score and experience.
- Keep recommendations specific and professional.

Employee data:
${JSON.stringify(employees, null, 2)}
`;

const localRecommendation = (employees) => {
  const ranked = [...employees].sort((a, b) => b.performanceScore - a.performanceScore);

  return ranked.map((employee, index) => {
    const score = employee.performanceScore;
    const promotion = score >= 80 && employee.experience >= 2
      ? "Promotion ready"
      : score < 60
        ? "Needs improvement before promotion"
        : "Continue monitoring";
    const training = employee.skills.length < 3
      ? "Add role-specific technical training and communication workshops"
      : "Advanced project ownership and leadership training";

    return `${index + 1}. ${employee.name} (${employee.department}) - Score: ${score}. ${promotion}. Suggested training: ${training}.`;
  }).join("\n");
};

const recommend = async (req, res, next) => {
  try {
    let employees = req.body.employees;

    if (!employees || employees.length === 0) {
      employees = await Employee.find().sort({ performanceScore: -1 }).lean();
    }

    if (!Array.isArray(employees) || employees.length === 0) {
      res.status(400);
      throw new Error("Provide employees array or add employees in database first");
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.json({
        success: true,
        source: "local-fallback",
        recommendation: localRecommendation(employees)
      });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert HR analytics assistant."
          },
          {
            role: "user",
            content: buildPrompt(employees)
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
          "X-Title": "Employee Performance Analytics"
        },
        timeout: 30000
      }
    );

    res.json({
      success: true,
      source: "openrouter",
      recommendation: response.data.choices?.[0]?.message?.content || "No recommendation returned"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { recommend };
