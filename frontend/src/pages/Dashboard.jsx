import { useEffect, useMemo, useState } from "react";
import { Award, BrainCircuit, GraduationCap, Users } from "lucide-react";
import API from "../api";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    API.get("/employees")
      .then(({ data }) => setEmployees(data.employees))
      .catch(() => setEmployees([]));
  }, []);

  const stats = useMemo(() => {
    const total = employees.length;
    const avg = total ? Math.round(employees.reduce((sum, emp) => sum + emp.performanceScore, 0) / total) : 0;
    const top = employees[0];
    const needsTraining = employees.filter((emp) => emp.performanceScore < 60 || emp.skills.length < 3).length;
    return { total, avg, top, needsTraining };
  }, [employees]);

  return (
    <main className="page">
      <section className="page-heading">
        <p className="eyebrow">HR/Admin Analytics</p>
        <h1>Performance Dashboard</h1>
        <p>Track employee metrics, rankings and AI-ready data from one place.</p>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <Users size={22} />
          <span>Total Employees</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="metric-card">
          <Award size={22} />
          <span>Average Score</span>
          <strong>{stats.avg}</strong>
        </article>
        <article className="metric-card">
          <BrainCircuit size={22} />
          <span>Top Performer</span>
          <strong>{stats.top?.name || "N/A"}</strong>
        </article>
        <article className="metric-card">
          <GraduationCap size={22} />
          <span>Training Needed</span>
          <strong>{stats.needsTraining}</strong>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Current Rankings</h2>
          <p>Employees appear in descending performance order.</p>
        </div>
        <div className="ranking-list">
          {employees.slice(0, 5).map((employee, index) => (
            <div className="ranking-row" key={employee._id}>
              <span>#{index + 1}</span>
              <strong>{employee.name}</strong>
              <em>{employee.department}</em>
              <b>{employee.performanceScore}</b>
            </div>
          ))}
          {employees.length === 0 && <p>No employee data yet. Add records to build analytics.</p>}
        </div>
      </section>
    </main>
  );
}
