import { useState } from "react";
import { Save } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  department: "",
  skills: "",
  performanceScore: "",
  experience: ""
};

export default function EmployeeForm({ selectedEmployee, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(() => {
    if (selectedEmployee) {
      return {
        name: selectedEmployee.name || "",
        email: selectedEmployee.email || "",
        department: selectedEmployee.department || "",
        skills: selectedEmployee.skills?.join(", ") || "",
        performanceScore: selectedEmployee.performanceScore ?? "",
        experience: selectedEmployee.experience ?? ""
      };
    }
    return initialForm;
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
      performanceScore: Number(form.performanceScore),
      experience: Number(form.experience)
    });

    if (!selectedEmployee) setForm(initialForm);
  };

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div className="section-heading">
        <h2>{selectedEmployee ? "Update Employee" : "Employee Registration"}</h2>
        <p>Store HR details, skills and performance metrics.</p>
      </div>

      <label>
        Employee Name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>

      <label>
        Email
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </label>

      <label>
        Department
        <input name="department" value={form.department} onChange={handleChange} required />
      </label>

      <label>
        Skills
        <input name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" required />
      </label>

      <label>
        Performance Score
        <input type="number" min="0" max="100" name="performanceScore" value={form.performanceScore} onChange={handleChange} required />
      </label>

      <label>
        Years of Experience
        <input type="number" min="0" name="experience" value={form.experience} onChange={handleChange} required />
      </label>

      <div className="form-actions">
        <button className="primary-button" disabled={loading}>
          <Save size={18} /> {loading ? "Saving..." : selectedEmployee ? "Update Employee" : "Add Employee"}
        </button>
        {selectedEmployee && (
          <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}
