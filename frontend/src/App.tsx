function App() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4">
        🎓 AI Student Risk Prediction Dashboard
      </h1>

      <p className="text-gray-400 mb-6">
        ML & NLP powered student performance analysis system
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 p-4 rounded">Prediction</div>
        <div className="bg-gray-900 p-4 rounded">Analytics</div>
        <div className="bg-gray-900 p-4 rounded">CSV Upload</div>
      </div>
    </div>
  );
}

export default App;
