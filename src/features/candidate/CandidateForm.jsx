import { useState } from "react";

export default function CandidateForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    test_package: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit(form);
    } else {
      console.log(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-5">

      <h2 className="text-2xl font-bold">
        Add Candidate
      </h2>

      <div>
        <label className="block mb-2 font-medium">
          Full Name
        </label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          placeholder="john@email.com"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Password
        </label>

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Assign Test Package
        </label>

        <select
          name="test_package"
          value={form.test_package}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          <option value="">Choose Test</option>
          <option>DISC</option>
          <option>MBTI</option>
          <option>Pauli</option>
          <option>Kraepelin</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
      >
        Save Candidate
      </button>

    </form>
  );
}