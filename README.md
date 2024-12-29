
# MonkeyMatch: Infinite Monkey Theorem Simulator

## Introduction

**MonkeyMatch** is a web application inspired by the Infinite Monkey Theorem. It simulates a group of "monkeys" randomly generating text to match a user-provided input. The app visually track each monkey's progress in real-time and shows the number of attempts.

## Features

- **Dynamic Text Matching**: Monkeys generate random text to match user input.
- **Multi-Monkey Support**: Simulate up to 10 monkeys working simultaneously.
- **Real-time Visualization**: Track each monkey's progress and attempts.


## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- Ensure Node.js and npm are installed by running `node -v` and `npm -v` in your terminal. If not, download and install Node.js from the [official website](https://nodejs.org/), which includes npm.

### Installation

---


1. **Clone the repository**:
   ```bash
   git clone https://github.com/raqeebanjum/monkeymatch.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd monkeymatch
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

---

### Usage

1. **Start the application**:
   ```bash
   npm start
   ```
   - This command starts both the backend and frontend servers.

2. **Access the application**:
   Open `http://localhost:5173` in your browser.

3. **Interacting with the app**:
   - Input a sentence or phrase in the **Input Text** box.
   - Choose the number of monkeys (1–10).
   - Click **Start** to begin the simulation.
   - Watch the monkeys work to match your input text.
   - Use the **Stop** button to halt the simulation at any time.

---

### Project Structure

```
MonkeyMatch/
├── backend/       # Contains server-side code
│   ├── server.js  # Node.js server with WebSocket integration
│   ├── monkeyWorker.js # Worker thread logic for monkeys
│   └── package.json
├── frontend/      # Contains client-side React app
│   ├── src/       # React components and application logic
│   ├── package.json
├── package.json   # Root configuration and scripts
```

---

### Design Features

- **Frontend**:
  - Built with React and styled using TailwindCSS with DaisyUI.
  - Visually tracks each monkey’s progress, showing:
    - Current attempt.
    - Number of attempts made.
  -	Dark mode design for a clean user interface.

- **Backend**:
  - Node.js server with WebSocket integration.
  - Parallel processing using Worker Threads to simulate monkey behavior.

---

### Known Problems
  - **Potential JavaScript Limitation**:
    - While the backend uses Worker Threads for parallel processing, it has been observed that the monkeys sometimes appear to take turns rather than working fully in parallel. It has been suspected that this behavior may be related to javaScript's single-threaded event loop. However the exact cause is unclear.
  - **High Power Usage**:
    - The app is computationally intensive, especially when multiple monkeys are running simultaneously. This may lead to high CPU usage and high temperatures.



### License

This project is licensed under a modified MIT License. It is free for personal and educational use. Commercial use is prohibited without explicit permission. See the [LICENSE](./LICENSE) file for details.