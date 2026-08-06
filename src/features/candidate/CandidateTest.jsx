import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CandidateLayout from "../../layout/CandidateLayout";
import api from "../../api/axiosConfig";

export default function CandidateTest() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [testPackage, setTestPackage] = useState(null);

  useEffect(() => {
    checkSessionStatus();
  }, [sessionId]);

  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.error("Waktu habis! Tes akan dikumpulkan otomatis.");
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  const checkSessionStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Silakan login terlebih dahulu");
        navigate("/login");
        return;
      }

      const statusRes = await api.get(`/tests/sessions/${sessionId}/status`);
      const statusData = statusRes.data.data;

      if (statusData.status === "completed" || statusData.status === "expired") {
        toast("Tes ini sudah selesai atau kadaluarsa.");
        navigate("/candidate-dashboard");
        return;
      }

      setRemainingSeconds(statusData.remaining_seconds || 0);
      
      await fetchQuestions();

    } catch (error) {
      console.error("Error checking status:", error);
      
      if (error.response?.status === 404) {
        toast.error(`Sesi ID ${sessionId} tidak ditemukan / sudah tidak aktif. Silakan mulai tes baru.`);
        setTimeout(() => navigate("/candidate-dashboard"), 2000);
      } else if (error.response?.status === 401) {
        toast.error("Sesi Anda habis, silakan login kembali.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Gagal memuat status sesi");
      }
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await api.get(`/tests/sessions/${sessionId}/questions`);
      console.log("Soal berhasil dimuat:", response.data);

      const data = response.data.data;

      if (data.session) {
        setSession(data.session);
        setQuestions(data.questions || []);
        
        const existingAnswers = {};
        if (data.questions) {
          data.questions.forEach(q => {
            if (q.selected_option_id) {
              existingAnswers[q.id] = q.selected_option_id;
            }
          });
        }
        setAnswers(existingAnswers);
      } else if (data.questions) {
        setQuestions(data.questions || []);
        const existingAnswers = {};
        data.questions.forEach(q => {
          if (q.selected_option_id) {
            existingAnswers[q.id] = q.selected_option_id;
          }
        });
        setAnswers(existingAnswers);
      } else {
        setQuestions(data || []);
      }

    } catch (error) {
      console.error("Error fetching questions:", error);
      
      if (error.response?.status === 404) {
        toast.error("Soal tidak ditemukan untuk sesi ini.");
      } else {
        toast.error(error.response?.data?.message || "Gagal memuat soal");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmit = async () => {
    try {
      await api.post(`/tests/sessions/${sessionId}/submit`);
      toast.success("Tes otomatis dikumpulkan. Kembali ke dashboard.");
      navigate("/candidate-dashboard");
    } catch (error) {
      console.error("Auto submit error:", error);
    }
  };

  const saveAnswerToBackend = async (questionId, optionId) => {
    try {
      await api.post(`/tests/sessions/${sessionId}/answers`, {
        answers: [
          {
            question_id: parseInt(questionId),
            option_id: parseInt(optionId),
          }
        ]
      });
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  const handleAnswerSelect = async (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));

    await saveAnswerToBackend(questionId, optionId);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;
    
    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `Anda baru menjawab ${answeredCount} dari ${totalQuestions} soal. Yakin ingin mengumpulkan?`
      );
      if (!confirmSubmit) return;
    } else {
      const confirmSubmit = window.confirm("Apakah Anda yakin ingin mengumpulkan jawaban?");
      if (!confirmSubmit) return;
    }

    try {
      setSubmitting(true);
      
      const response = await api.post(`/tests/sessions/${sessionId}/submit`);
      
      toast.success("Jawaban berhasil dikumpulkan!");
      navigate("/candidate-dashboard");
      
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error(error.response?.data?.message || "Gagal mengumpulkan jawaban");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <CandidateLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-blue-900 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-500">Memverifikasi status tes...</p>
          </div>
        </div>
      </CandidateLayout>
    );
  }

  if (remainingSeconds <= 0 && !loading) {
    return (
      <CandidateLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⏰</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Waktu Habis!</h3>
            <p className="text-gray-500">Maaf, waktu pengerjaan tes telah habis.</p>
            <button
              onClick={() => navigate("/candidate-dashboard")}
              className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </CandidateLayout>
    );
  }

  if (questions.length === 0 && !loading) {
    return (
      <CandidateLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-500">Tidak ada soal untuk tes ini.</p>
            <button
              onClick={() => navigate("/candidate-dashboard")}
              className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Kembali
            </button>
          </div>
        </div>
      </CandidateLayout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <CandidateLayout>
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {testPackage?.title || "Tes"}
              </h2>
              <p className="text-sm text-gray-500">
                Soal {currentQuestionIndex + 1} dari {totalQuestions} • 
                Terjawab: {answeredCount}/{totalQuestions}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${
                remainingSeconds < 60 ? "text-red-600" : "text-blue-900"
              }`}>
                {formatTime(remainingSeconds)}
              </p>
              <p className="text-xs text-gray-400">Sisa Waktu</p>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-900 rounded-full h-2 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase">
              Soal {currentQuestionIndex + 1}
            </span>
            <h3 className="text-lg font-medium text-slate-800 mt-1">
              {currentQuestion?.question_text}
            </h3>
            {currentQuestion?.question_type && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mt-2 inline-block">
                {currentQuestion.question_type}
              </span>
            )}
          </div>

          <div className="space-y-3 mt-4">
            {currentQuestion?.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  answers[currentQuestion.id] === option.id
                    ? "border-blue-900 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    answers[currentQuestion.id] === option.id
                      ? "border-blue-900 bg-blue-900"
                      : "border-gray-300"
                  }`}>
                    {answers[currentQuestion.id] === option.id && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-base text-slate-700">{option.option_text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Sebelumnya
          </button>
          
          <div className="flex gap-2 overflow-x-auto max-w-md">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <button
                key={i}
                onClick={() => goToQuestion(i)}
                className={`w-9 h-9 rounded-full text-sm font-semibold transition ${
                  i === currentQuestionIndex
                    ? "bg-blue-900 text-white"
                    : answers[questions[i]?.id]
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-70"
            >
              {submitting ? "Mengumpulkan..." : "Kumpulkan"}
            </button>
          ) : (
            <button
              onClick={goToNextQuestion}
              className="px-6 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition"
            >
              Selanjutnya →
            </button>
          )}
        </div>

      </div>
    </CandidateLayout>
  );
}