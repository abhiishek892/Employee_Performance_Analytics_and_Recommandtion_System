import { Search } from "lucide-react";

export default function SearchFilter({ filters, setFilters, onSearch, onReset }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  return (
    <form className="panel search-grid" onSubmit={onSearch}>
      <label>
        Department
        <input name="department" value={filters.department} onChange={handleChange} placeholder="Development" />
      </label>
      <label>
        Skill
        <input name="skill" value={filters.skill} onChange={handleChange} placeholder="React" />
      </label>
      <label>
        Min Score
        <input type="number" min="0" max="100" name="minScore" value={filters.minScore} onChange={handleChange} />
      </label>
      <label>
        Search Text
        <input name="q" value={filters.q} onChange={handleChange} placeholder="name, email, department" />
      </label>
      <div className="filter-actions">
        <button className="primary-button"><Search size={18} /> Search</button>
        <button type="button" className="secondary-button" onClick={onReset}>Reset</button>
      </div>
    </form>
  );
}
