export default function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Panel */}
      <div className="w-1/2 bg-gray-800 p-6 border-r border-gray-700 flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-center">MonkeyMatch</h1>
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2 ml-1">Input Text:</label>
          <textarea
            className="textarea textarea-bordered w-full h-40 text-white"
            placeholder="Type your text here..."
          ></textarea>
        </div>
        <div className="space-y-4 mb-6">
          <button className="btn btn-primary w-full">Start</button>
          <button className="btn btn-error w-full">Stop</button>
        </div>
        <div className="flex-1 bg-gray-700 p-4 rounded overflow-y-auto">
          <h2 className="text-lg font-bold mb-2">Console</h2>
          {/* Console content will be dynamically added */}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 bg-gray-900 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Monkey Progress Tracker</h2>
        <div className="h-full bg-gray-800 border border-gray-700 rounded p-4">
          {/* Visualization content goes here */}
        </div>
      </div>
    </div>
  );
}