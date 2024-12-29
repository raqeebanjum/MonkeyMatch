const { parentPort, workerData } = require("worker_threads");

const { target, monkeyId } = workerData;

const generateText = (length) => {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ";
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};

let attempts = 0;

const simulateMonkey = () => {
  const generated = generateText(target.length);
  attempts++;

  parentPort.postMessage({
    type: "progress",
    payload: { monkey: monkeyId, generated, attempts },
  });

  if (generated === target) {
    parentPort.postMessage({
      type: "match",
      payload: { monkey: monkeyId, match: generated, attempts },
    });
  } else {
    setImmediate(simulateMonkey); // Ensure non-blocking recursion
  }
};

// Start simulation
simulateMonkey();