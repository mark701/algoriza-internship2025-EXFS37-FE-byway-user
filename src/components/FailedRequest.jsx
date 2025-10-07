
const FailedRequest  = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 flex-center bg-black/40 z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center animate-fadeIn">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Failed</h2>
        <p className="text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 w-28 BorderPadding bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FailedRequest;
