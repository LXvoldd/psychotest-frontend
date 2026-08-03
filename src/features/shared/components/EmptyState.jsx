export default function EmptyState({
  title = "Tidak ada data",
  description = "Belum ada data yang tersedia",
  icon = "📭",
  actionText,
  onAction,
}) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}