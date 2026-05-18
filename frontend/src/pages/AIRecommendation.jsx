import { useEffect, useState } from "react";
import { BrainCircuit, Sparkles } from "lucide-react";
import API from "../api";

export default function AIRecommendation() {
  const [employees, setEmployees] = useState([]);
  const [recommendation, setRecommendation] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/employees")
      .then(({ data }) => setEmployees(data.employees))
      .catch(() => setMessage("Unable to load employee data"));
  }, []);

  const generateRecommendation = async () => {
    setLoading(true);
    setMessage("");
    try {
      const { data } = await API.post("/ai/recommend", { employees });
      setRecommendation(data.recommendation);
      setSource(data.source);
    } catch (error) {
      setMessage(error.response?.data?.message || "AI recommendation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="page-heading">
        <p className="eyebrow">OpenRouter/OpenAI Compatible API</p>
        <h1>AI Recommendations</h1>
        <p>Generate promotion suggestions, rankings, training plans and HR feedback.</p>
      </section>

      {message && <div className="alert error">{message}</div>}

      <section className="ai-layout">
        <div className="panel">
          <div className="section-heading">
            <h2>Employee Data Sent to AI</h2>
            <p>{employees.length} employee records available for analysis.</p>
          </div>
          <div className="mini-list">
            {employees.map((employee) => (
              <div key={employee._id}>
                <strong>{employee.name}</strong>
                <span>{employee.department} | Score {employee.performanceScore}</span>
              </div>
            ))}
            {employees.length === 0 && <p>Add employee records before generating AI recommendations.</p>}
          </div>
          <button className="primary-button wide" onClick={generateRecommendation} disabled={loading || employees.length === 0}>
            <Sparkles size={18} /> {loading ? "Generating..." : "Generate AI Recommendation"}
          </button>
        </div>

        <div className="panel recommendation-panel">
          <div className="section-heading">
            <h2><BrainCircuit size={22} /> AI Recommendation Output</h2>
            <p>Source: {source || "Waiting for generation"}</p>
          </div>
          <pre>{recommendation || "The AI feedback will appear here after generation."}</pre>
        </div>
      </section>
    </main>
  );
}
