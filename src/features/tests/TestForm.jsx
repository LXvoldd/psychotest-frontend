import { useState } from "react";

export default function TestForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    passing_score: "",
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
        Create Test Package
      </h2>

      <div>
        <label className="block mb-2 font-medium">
          Test Name
        </label>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          placeholder="DISC"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          rows="4"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="block mb-2 font-medium">
            Duration (Minutes)
          </label>

          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Passing Score
          </label>

          <input
            type="number"
            name="passing_score"
            value={form.passing_score}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
      >
        Save Test Package
      </button>

    </form>
  );
}