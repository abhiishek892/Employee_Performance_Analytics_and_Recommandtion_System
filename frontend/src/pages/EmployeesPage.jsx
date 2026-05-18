import { useEffect, useState } from "react";
import API from "../api";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeTable from "../components/EmployeeTable";
import SearchFilter from "../components/SearchFilter";

const blankFilters = { department: "", skill: "", minScore: "", q: "" };

export default function EmployeesPage({ startWithForm = false }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filters, setFilters] = useState(blankFilters);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    const { data } = await API.get("/employees");
    setEmployees(data.employees);
  };

  useEffect(() => {
    let active = true;

    const loadEmployees = async () => {
      try {
        const { data } = await API.get("/employees");
        if (active) setEmployees(data.employees);
      } catch {
        if (active) setMessage("Unable to fetch employee list");
      }
    };

    loadEmployees();

    return () => {
      active = false;
    };
  }, []);

  const saveEmployee = async (payload) => {
    setLoading(true);
    setMessage("");
    try {
      if (selectedEmployee) {
        await API.put(`/employees/${selectedEmployee._id}`, payload);
        setMessage("Employee updated successfully");
      } else {
        await API.post("/employees", payload);
        setMessage("Employee stored successfully");
      }
      setSelectedEmployee(null);
      await fetchEmployees();
    } catch (error) {
      setMessage(error.response?.data?.message || "Employee save failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    const confirmed = window.confirm("Delete this employee?");
    if (!confirmed) return;

    try {
      await API.delete(`/employees/${id}`);
      setMessage("Employee removed successfully");
      await fetchEmployees();
    } catch (error) {
      setMessage(error.response?.data?.message || "Delete failed");
    }
  };

  const searchEmployees = async (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const { data } = await API.get(`/employees/search?${params.toString()}`);
    setEmployees(data.employees);
  };

  const resetFilters = () => {
    setFilters(blankFilters);
    fetchEmployees();
  };

  return (
    <main className="page">
      <section className="page-heading">
        <p className="eyebrow">Employee CRUD</p>
        <h1>{startWithForm ? "Register Employee" : "Employee Management"}</h1>
        <p>Add, update, delete, search and filter employee performance records.</p>
      </section>

      {message && <div className="alert">{message}</div>}

      <div className="split-layout">
        <EmployeeForm
          key={selectedEmployee?._id || "new-employee"}
          selectedEmployee={selectedEmployee}
          onSubmit={saveEmployee}
          onCancel={() => setSelectedEmployee(null)}
          loading={loading}
        />
        <div className="stack">
          <SearchFilter
            filters={filters}
            setFilters={setFilters}
            onSearch={searchEmployees}
            onReset={resetFilters}
          />
          <EmployeeTable
            employees={employees}
            onEdit={setSelectedEmployee}
            onDelete={deleteEmployee}
          />
        </div>
      </div>
    </main>
  );
}
