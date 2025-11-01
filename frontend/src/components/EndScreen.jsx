export default function EndScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-pink-50">
      <h1 className="text-4xl text-sky-700 font-bold mb-4">
        🎉 Great job! See you soon!
      </h1>
      <button
        onClick={() => (window.location.href = "/stories")}
        className="bg-sky-500 text-white px-6 py-3 rounded-xl"
      >
        Back to Stories
      </button>
    </div>
  );
}
