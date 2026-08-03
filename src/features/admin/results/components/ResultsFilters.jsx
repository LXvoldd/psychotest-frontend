import { useState } from "react";

export default function ResultsFilters({ filters, onFilterChange }) {
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "");

  const handleSearch = (e) => {
    e.preventDefault();
    onFilterChange({ search, status });
  };

  const handleReset = () => {
    setSearch("");
    setStatus("");
    onFilterChange({ search: "", status: "" });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Cari kandidat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="w-40">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Semua Status</option>
            <option value="completed">Selesai</option>
            <option value="in_progress">Sedang Berjalan</option>
            <option value="expired">Kadaluarsa</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
        >
          Cari
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
        >
          Reset
        </button>
      </form>
    </div>
  );
}