import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import MainLayout from "../../../layout/MainLayout";
import api from "../../../api/axiosConfig";
import toast from "react-hot-toast";

export default function QuestionManager() {
  const [testPackages, setTestPackages] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [loadingPkg, setLoadingPkg] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const bottomRef = useRef(null);

  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: {
      questions: []
    }
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "questions"
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoadingPkg(true);
        const response = await api.get("/admin/test-packages");
        const data = response.data.data || [];
        setTestPackages(data);
      } catch (error) {
        console.error("Gagal mengambil test packages:", error);
        toast.error("Gagal memuat daftar paket tes");
      } finally {
        setLoadingPkg(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    if (fields.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [fields.length]);

  const addQuestion = () => {
    append({
      question_text: "",
      question_type: "multiple_choice",
      points: 1,
      options: [{ option_text: "", score_value: 0, is_correct: false }]
    });
  };

  const addOption = (index) => {
    const currentOptions = fields[index].options || [];
    const newOptions = [...currentOptions, { option_text: "", score_value: 0, is_correct: false }];
    update(index, { ...fields[index], options: newOptions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const currentOptions = fields[questionIndex].options || [];
    if (currentOptions.length <= 1) return;
    const newOptions = currentOptions.filter((_, idx) => idx !== optionIndex);
    update(questionIndex, { ...fields[questionIndex], options: newOptions });
  };

  const onSubmit = async (data) => {
    if (isSaving) return;

    if (!selectedPackageId) {
      toast.error("Silakan pilih Kategori Psikotes terlebih dahulu!");
      return;
    }

    let isValid = true;
    data.questions.forEach((q, idx) => {
      if (q.question_type === "multiple_choice" && (!q.options || q.options.length < 2)) {
        isValid = false;
        toast.error(`Soal nomor ${idx + 1} harus memiliki minimal 2 opsi jawaban.`);
      }
    });
    if (!isValid) return;

    setIsSaving(true);

    try {
      for (const q of data.questions) {
        const safeQuestionType = q.question_type || "multiple_choice";

        const payload = {
          test_package_id: parseInt(selectedPackageId),
          question_text: q.question_text,
          question_type: safeQuestionType,
          points: parseInt(q.points)
        };
        const questionRes = await api.post("/admin/questions", payload);
        const createdQuestionId = questionRes.data.data?.id || questionRes.data.id;

        if (createdQuestionId && q.options && q.options.length > 0) {
          for (const opt of q.options) {
            if (opt.option_text && opt.option_text.trim() !== "") {
              await api.post(`/admin/questions/${createdQuestionId}/options`, {
                option_text: opt.option_text,
                score_value: opt.is_correct ? 10 : 0
              });
            }
          }
        }
      }
      toast.success("Pertanyaan dan opsi berhasil disimpan!");
      reset();
      setSelectedPackageId("");
    } catch (error) {
      console.error("Error saving questions:", error);
      
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        toast.error(errorMessages.join("\n"));
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Gagal menyimpan soal. Periksa kembali input Anda.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset();
    setSelectedPackageId("");
  };

  return (
    <MainLayout>
      <div className="bg-[#f8fafc] min-h-screen p-6">
        
        <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-800 text-xl">
              ←
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Buat Pertanyaan Baru</h1>
              <p className="text-sm text-gray-400">Tambahkan instrumen evaluasi psikologis ke dalam bank data.</p>
            </div>
          </div>
          <div className="flex gap-3 mt-3 sm:mt-0">
            <button
              onClick={handleCancel}
              className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition shadow-sm"
            >
              Batalkan
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
              className={`px-5 py-2 text-white font-medium rounded-lg transition shadow-md ${
                isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-[#0a2142] hover:bg-[#0a2142]/90"
              }`}
            >
              {isSaving ? "Menyimpan..." : "Simpan Pertanyaan"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            {fields.length === 0 && (
              <div className="bg-white p-12 rounded-xl border-2 border-dashed border-gray-300 text-center shadow-sm">
                <p className="text-gray-400 mb-4 text-lg">Belum ada pertanyaan.</p>
                <button
                  onClick={addQuestion}
                  className="px-6 py-2 bg-[#0a2142] text-white rounded-lg hover:bg-[#0a2142]/90 transition"
                >
                  + Buat Pertanyaan Baru
                </button>
              </div>
            )}

            {fields.map((field, index) => (
              <div key={field.id} className="space-y-6">
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-slate-700">Pertanyaan #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="bg-blue-50/60 p-4 rounded-lg border border-blue-100">
                    <textarea
                      placeholder="Masukkan narasi atau soal di sini..."
                      className="w-full bg-transparent border-none focus:ring-0 resize-none text-slate-700 placeholder-slate-400 min-h-[100px]"
                      rows="4"
                      {...register(`questions.${index}.question_text`)}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">Pilihan Jawaban</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Tipe:</span>
                      <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700 font-medium">
                        Pilihan Ganda
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {field.options?.map((opt, optIndex) => (
                      <div 
                        key={`${field.id}-option-${optIndex}`} 
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                          opt.is_correct 
                            ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600" 
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <span className="text-sm font-bold text-gray-500 w-6">
                          {String.fromCharCode(65 + optIndex)}
                        </span>

                        <input
                          type="radio"
                          name={`questions.${index}.correct_option`}
                          checked={opt.is_correct}
                          onChange={() => {
                            const newOptions = field.options.map((o, idx) => ({
                              ...o,
                              is_correct: idx === optIndex
                            }));
                            update(index, { ...field, options: newOptions });
                          }}
                          className="w-5 h-5 text-blue-800 border-gray-300 focus:ring-blue-800 cursor-pointer"
                        />

                        <input
                          type="text"
                          placeholder="Masukkan pilihan jawaban..."
                          className="flex-1 border-none bg-transparent focus:ring-0 text-slate-700"
                          {...register(`questions.${index}.options.${optIndex}.option_text`)}
                        />

                        {opt.is_correct && (
                          <span className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Jawaban Benar
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => removeOption(index, optIndex)}
                          className="text-gray-300 hover:text-red-500 transition"
                          disabled={field.options.length <= 1}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => addOption(index)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 px-4 py-2 bg-blue-50 rounded-lg inline-flex items-center gap-2 transition"
                    >
                      + Tambah Pilihan
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* =========================================== */}
            {/* TOMBOL TAMBAH SOAL DITEMPATKAN DI PALING BAWAH */}
            {/* =========================================== */}
            {fields.length > 0 && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={addQuestion}
                  className="px-6 py-3 bg-white border-2 border-dashed border-blue-300 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition w-full flex items-center justify-center gap-2"
                >
                  <span className="text-xl">+</span> Tambah Soal Lagi
                </button>
              </div>
            )}
            
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h4 className="font-bold text-slate-800 border-b border-gray-200 pb-3 mb-4">
                ATRIBUT PERTANYAAN
              </h4>
              
              <div className="space-y-4">
                
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Kategori Psikotes
                  </label>
                  <select
                    value={selectedPackageId}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-[#0a2142] focus:border-transparent"
                    disabled={loadingPkg}
                  >
                    <option value="">Pilih Kategori...</option>
                    {testPackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Estimasi Waktu (Detik)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        defaultValue={60}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-[#0a2142] focus:border-transparent"
                        {...register(`questions.${fields.length > 0 ? 0 : 0}.time_seconds`, { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Bobot Poin
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        defaultValue={1}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-[#0a2142] focus:border-transparent"
                        {...register(`questions.${fields.length > 0 ? 0 : 0}.points`, { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div ref={bottomRef} />
      </div>
    </MainLayout>
  );
}