import { useFieldArray } from "react-hook-form";

export default function OptionInput({ control, register, errors, questionIndex }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const addOption = () => {
    append({ option_text: "", score_value: 0 });
  };

  return (
    <div className="ml-6 mt-3 space-y-2">
      <label className="text-sm font-medium text-gray-700">Opsi Jawaban</label>

      {fields.map((field, optionIndex) => (
        <div key={field.id} className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder={`Opsi ${optionIndex + 1}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register(`questions.${questionIndex}.options.${optionIndex}.option_text`)}
            />
          </div>
          <div className="w-24">
            <input
              type="number"
              placeholder="Skor"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register(`questions.${questionIndex}.options.${optionIndex}.score_value`, {
                valueAsNumber: true,
              })}
            />
          </div>
          <button
            type="button"
            onClick={() => remove(optionIndex)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addOption}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        + Tambah Opsi
      </button>
    </div>
  );
}