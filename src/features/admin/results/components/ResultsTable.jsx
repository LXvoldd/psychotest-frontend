import LoadingSkeleton from "../../../shared/components/LoadingSkeleton";
import EmptyState from "../../../shared/components/EmptyState";

export default function ResultsTable({ results, loading, onExportPDF }) {
  if (loading) {
    return <LoadingSkeleton type="table" count={5} />;
  }

  if (results.length === 0) {
    return (
      <EmptyState
        title="Belum Ada Hasil"
        description="Belum ada kandidat yang menyelesaikan tes."
        icon=""
      />
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-green-100 text-green-700",
      in_progress: "bg-yellow-100 text-yellow-700",
      expired: "bg-red-100 text-red-700",
    };
    const labels = {
      completed: "Selesai",
      in_progress: "Sedang Berjalan",
      expired: "Kadaluarsa",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kandidat
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Paket Tes
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Skor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tanggal
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {results.map((result) => (
              <tr key={result.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">
                      {result.user?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400">{result.user?.email || "-"}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-slate-700">
                    {result.test_package?.title || "Unknown"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-sm font-semibold ${
                      result.total_score >= (result.test_package?.passing_score || 70)
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {result.total_score || 0}%
                  </span>
                </td>
                <td className="px-4 py-3">{getStatusBadge(result.status)}</td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-500">
                    {result.submitted_at
                      ? new Date(result.submitted_at).toLocaleDateString("id-ID")
                      : "-"}
                  </p>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onExportPDF(result.id)}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                  >
                     PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}