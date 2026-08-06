import { useState } from "react";
import LoadingSkeleton from "../../../shared/components/LoadingSkeleton";
import EmptyState from "../../../shared/components/EmptyState";

export default function TestPackageList({ packages, loading, onEdit, onDelete, onCreate }) {
  const [expandedId, setExpandedId] = useState(null);

  if (loading) {
    return <LoadingSkeleton type="table" count={5} />;
  }

  if (packages.length === 0) {
    return (
      <EmptyState
        title="Belum Ada Paket Tes"
        description="Mulai buat paket tes pertama untuk kandidat."
        icon=""
        actionText="Buat Paket Tes"
        onAction={onCreate}
      />
    );
  }

  return (
    <div className="space-y-4">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800">{pkg.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{pkg.description}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                <span className="text-gray-400">⏱ {pkg.duration_minutes} Menit</span>
                <span className="text-gray-400"> Passing: {pkg.passing_score}%</span>
                <span className="text-gray-400"> {pkg.questions?.length || 0} Soal</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setExpandedId(expandedId === pkg.id ? null : pkg.id)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {expandedId === pkg.id ? "Sembunyikan" : "Lihat Soal"}
              </button>
              <button onClick={() => onEdit(pkg)} className="text-sm text-blue-600 hover:text-blue-800">
                Edit
              </button>
              <button
                onClick={() => onDelete(pkg.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Hapus
              </button>
            </div>
          </div>

          {expandedId === pkg.id && pkg.questions && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              {pkg.questions.map((q, idx) => (
                <div key={q.id} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-sm">
                    {idx + 1}. {q.question_text}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Tipe: {q.question_type} • Poin: {q.points}
                  </p>
                  {q.options && (
                    <div className="ml-4 mt-2 space-y-1">
                      {q.options.map((opt, oi) => (
                        <p key={opt.id} className="text-sm text-gray-600">
                          {String.fromCharCode(65 + oi)}. {opt.option_text}
                          {opt.score_value > 0 && (
                            <span className="ml-2 text-xs text-blue-600">(Skor: {opt.score_value})</span>
                          )}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}