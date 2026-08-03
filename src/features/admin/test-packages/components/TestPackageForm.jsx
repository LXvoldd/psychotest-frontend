import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import QuestionBuilder from "./QuestionBuilder";

const testPackageSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  duration_minutes: z.number().min(1, "Durasi minimal 1 menit"),
  passing_score: z.number().min(0, "Passing score minimal 0").max(100, "Passing score maksimal 100"),
  questions: z
    .array(
      z.object({
        question_text: z.string().min(1, "Teks soal wajib diisi"),
        question_type: z.string(),
        points: z.number().min(0, "Poin minimal 0"),
        options: z
          .array(
            z.object({
              option_text: z.string().min(1, "Teks opsi wajib diisi"),
              score_value: z.number().min(0, "Skor minimal 0"),
            })
          )
          .min(1, "Minimal 1 opsi"),
      })
    )
    .min(1, "Minimal 1 soal"),
});

export default function TestPackageForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(testPackageSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      duration_minutes: 30,
      passing_score: 70,
      questions: [],
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submit error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul Paket Tes *</label>
          <input
            type="text"
            placeholder="Contoh: DISC Personality Test"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            {...register("title")}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (Menit) *</label>
          <input
            type="number"
            min="1"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.duration_minutes ? "border-red-500" : "border-gray-300"
            }`}
            {...register("duration_minutes", { valueAsNumber: true })}
          />
          {errors.duration_minutes && (
            <p className="text-red-500 text-sm mt-1">{errors.duration_minutes.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
          <textarea
            placeholder="Jelaskan tentang paket tes ini..."
            rows="3"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%) *</label>
          <input
            type="number"
            min="0"
            max="100"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.passing_score ? "border-red-500" : "border-gray-300"
            }`}
            {...register("passing_score", { valueAsNumber: true })}
          />
          {errors.passing_score && (
            <p className="text-red-500 text-sm mt-1">{errors.passing_score.message}</p>
          )}
        </div>
      </div>

      <QuestionBuilder control={control} register={register} errors={errors} />
      {errors.questions && <p className="text-red-500 text-sm">{errors.questions.message}</p>}

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
        >
          {isLoading ? "Menyimpan..." : initialData ? "Perbarui" : "Simpan"}
        </button>
      </div>
    </form>
  );
}