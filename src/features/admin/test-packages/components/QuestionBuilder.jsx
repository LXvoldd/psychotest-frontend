import { useFieldArray } from "react-hook-form";
import OptionInput from "./OptionInput";

export default function QuestionBuilder({ control, register, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const addQuestion = () => {
    append({
      question_text: "",
      question_type: "multiple_choice",
      points: 1,
      options: [{ option_text: "", score_value: 0 }],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Soal</h3>
        <button
          type="button"
          onClick={addQuestion}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition text-sm"
        >
          + Tambah Soal
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Soal {index + 1}</label>
                <textarea
                  placeholder="Masukkan teks soal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  {...register(`questions.${index}.question_text`)}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Tipe Soal</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register(`questions.${index}.question_type`)}
                  >
                    <option value="multiple_choice">Pilihan Ganda</option>
                    <option value="essay">Essay</option>
                    <option value="true_false">Benar/Salah</option>
                  </select>
                </div>
                <div className="w-32">
                  <label className="text-sm font-medium text-gray-700">Poin</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register(`questions.${index}.points`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>

              <OptionInput
                control={control}
                register={register}
                errors={errors}
                questionIndex={index}
              />
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="ml-3 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          Belum ada soal. Klik "Tambah Soal" untuk mulai.
        </p>
      )}
    </div>
  );
}