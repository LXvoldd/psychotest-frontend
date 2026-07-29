import CandidateLayout from "../../layout/CandidateLayout";

export default function CandidateDashboard() {
  return (
    <CandidateLayout>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-slate-800">Candidate Portal</h1>
        <p className="text-gray-500 mt-2">
          Selamat datang! Ini adalah halaman sementara untuk Candidate (Peserta Psikotes).
        </p>
        <div className="mt-4 bg-blue-50 p-4 rounded border border-blue-200 text-blue-800">
          <p>💡 Fitur Candidate (Mengerjakan Tes, Timer, dll) akan diintegrasikan setelah desain dari teman Anda diberikan.</p>
        </div>
      </div>
    </CandidateLayout>
  );
}