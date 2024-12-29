import { useState, useEffect } from "react";
import { socket } from "./socket";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [monkeyCount, setMonkeyCount] = useState(1);
  const [consoleMessages, setConsoleMessages] = useState([]);
  const [monkeys, setMonkeys] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addConsoleMessage = (message) => {
    setConsoleMessages((prev) => [...prev, message]);
  };

  const clearConsole = () => {
    setConsoleMessages([]);
  };

  const handleStart = () => {
    if (!inputText.trim()) {
      addConsoleMessage("Please enter some text to start.");
      return;
    }

    clearConsole();
    setIsRunning(true);
    addConsoleMessage("Generating Monkeys...");
    setTimeout(() => addConsoleMessage("Monkeys Generated..."), 500);
    setMonkeys(
      Array.from({ length: monkeyCount }, (_, index) => ({
        id: index + 1,
        currentAttempt: "",
        attemptCount: 0,
      }))
    );
    socket.emit("start", { text: inputText, monkeyCount });
  };

  const handleStop = () => {
    setIsRunning(false);
    addConsoleMessage("Stopping monkeys...");
    socket.emit("stop");
  };

  useEffect(() => {
    socket.on("progress", (data) => {
      setMonkeys((prev) =>
        prev.map((monkey) =>
          monkey.id === data.monkey
            ? {
                ...monkey,
                currentAttempt: data.generated,
                attemptCount: data.attempts,
              }
            : monkey
        )
      );
    });
  
    socket.on("match", (data) => {
      addConsoleMessage(
        `🎉 🐵 #${data.monkey} found a match! "${data.match}" in ${data.attempts} attempts.`
      );
    });
  
    socket.on("stopped", (data) => {
      addConsoleMessage(data.message);
      setIsRunning(false);
    });
  
    socket.on("crash", (data) => {
      addConsoleMessage(`🚨 Monkey #${data.monkey} crashed: ${data.message}`);
    });
  
    return () => {
      socket.off("progress");
      socket.off("match");
      socket.off("stopped");
      socket.off("crash");
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-1/2 bg-gray-800 p-6 border-r border-gray-700 flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-center">MonkeyMatch</h1>
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2 text-left ml-1">
            Input Text:
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-40 text-white"
            placeholder="Type your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isRunning}
          ></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2 text-left ml-1">
            Number of Monkeys:
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={monkeyCount}
            onChange={(e) =>
              setMonkeyCount(Math.min(10, Math.max(1, Number(e.target.value))))
            }
            min={1}
            max={10}
            disabled={isRunning}
          />
        </div>
        <div className="space-y-4 mb-6">
          <button
            className="btn btn-primary w-full"
            onClick={handleStart}
            disabled={isRunning}
          >
            Start
          </button>
          <button
            className="btn btn-error w-full"
            onClick={handleStop}
            disabled={!isRunning}
          >
            Stop
          </button>
        </div>
        <div className="flex-1 bg-gray-700 p-4 rounded overflow-y-auto">
          <h2 className="text-lg font-bold mb-2">Console</h2>
          <ul className="text-sm space-y-2">
            {consoleMessages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-1/2 bg-gray-900 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Monkey Progress Tracker</h2>
        <div
          className="bg-gray-800 border border-gray-700 rounded p-4 flex flex-col gap-4"
          style={{ minHeight: "100vh" }}
        >
          {monkeys.map((monkey) => (
            <div
              key={monkey.id}
              className="p-4 flex items-center bg-gray-900 rounded shadow-md border border-gray-700"
            >
              <p className="text-6xl mr-4">🐵</p>
              <div>
                <p className="text-lg font-bold">#{monkey.id}</p>
                <p className="text-sm text-gray-400">
                  <span className="font-semibold">Current Attempt:</span>{" "}
                  {monkey.currentAttempt || "Idle"}
                </p>
                <p className="text-sm text-gray-400">
                  <span className="font-semibold">Number of Attempts:</span>{" "}
                  {monkey.attemptCount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}