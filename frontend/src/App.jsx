import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import LanguageSwitcher from "./components/LanguageSwitcher";
import WelcomeScreen from "./components/WelcomeScreen";
import StorySelection from "./components/StorySelection";
import StoryPlayer from "./components/StoryPlayer";
import './index.css';

function App() {
  return (
    <div className="app">
      <LanguageProvider>
        <BrowserRouter>
          <LanguageSwitcher />
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/stories" element={<StorySelection />} />
            <Route path="/story/:id" element={<StoryPlayer />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </div>
  );
}

export default App;