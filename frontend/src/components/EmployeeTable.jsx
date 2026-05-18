import { Edit, Trash2 } from "lucide-react";

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  return (
    <div className="panel table-panel">
      <div className="section-heading">
        <h2>Employee List</h2>
        <p>Ranked by performance score for quick HR review.</p>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Department</th>
              <th>Skills</th>
              <th>Score</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-cell">No employees found</td>
              </tr>
            ) : employees.map((employee, index) => (
              <tr key={employee._id}>
                <td>#{index + 1}</td>
                <td>
                  <strong>{employee.name}</strong>
                  <span>{employee.email}</span>
                </td>
                <td>{employee.department}</td>
                <td>
                  <div className="skills">
                    {employee.skills.map((skill) => <span key={skill}>{skill}</span>)}
                  </div>
                </td>
                <td><strong>{employee.performanceScore}</strong></td>
                <td>{employee.experience} yrs</td>
                <td>
                  <div className="row-actions">
                    <button title="Edit employee" onClick={() => onEdit(employee)}><Edit size={17} /></button>
                    <button title="Delete employee" onClick={() => onDelete(employee._id)}><Trash2 size={17} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
