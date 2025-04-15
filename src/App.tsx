import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { BingoGameContainer } from "./components/bingo-game-container";
import { IntroScreen } from "./components/intro-screen";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <IntroScreen
              onStartPlaying={() => {
                window.location.href = "/play";
              }}
            />
          }
        />
        <Route path="/play" element={<BingoGameContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
