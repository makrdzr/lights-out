import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import useGameLogic from "./hooks/useGameLogic";
import SettingsModal from "./components/ui/SettingsModal";
import ResultsModal from "./components/ui/ResultsModal";
import ThemeToggle from "./components/ui/ThemeToggle";
import { AppContext, type AppContextType } from "./context/AppContext";
import { useSettingsStore } from "./store/settings";
import { useResultsStore } from "./store/results";
import { useThemeStore } from "./store/theme";

const App = () => {
  const { pathname } = useLocation();
  const settings = useSettingsStore((state) => state.settings);
  const theme = useThemeStore((state) => state.theme);
  const isOpen = useSettingsStore((state) => state.isOpen);
  const closeSettings = useSettingsStore((state) => state.closeSettings);
  const showResultsModal = useResultsStore((state) => state.isOpen);
  const hideResults = useResultsStore((state) => state.hideResults);
  const showResults = useResultsStore((state) => state.showResults);
  const gameLogic = useGameLogic(settings.size, settings.timer);
  const isGamePage = pathname.startsWith("/game/");

  const lastRecordedStateRef = useRef<"won" | "lost" | "playing">("playing");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (!isGamePage) {
      hideResults();
    }
  }, [isGamePage, hideResults]);

  useEffect(() => {
    if (!gameLogic.isWon && !gameLogic.isLost) {
      lastRecordedStateRef.current = "playing";
    }
  }, [gameLogic.isWon, gameLogic.isLost]);

  useEffect(() => {
    if (gameLogic.isWon && lastRecordedStateRef.current !== "won") {
      lastRecordedStateRef.current = "won";
      showResults({ isWin: true, steps: gameLogic.steps, size: settings.size });
    }
  }, [gameLogic.isWon, gameLogic.steps, showResults, settings.size]);

  useEffect(() => {
    if (gameLogic.isLost && lastRecordedStateRef.current !== "lost") {
      lastRecordedStateRef.current = "lost";
      showResults({
        isWin: false,
        steps: gameLogic.steps,
        size: settings.size,
      });
    }
  }, [gameLogic.isLost, gameLogic.steps, showResults, settings.size]);

  const contextValue: AppContextType = {
    gameLogic,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen">
        <ThemeToggle />
        <Outlet />

        {isOpen && <SettingsModal onClose={closeSettings} />}

        {showResultsModal && isGamePage && (
          <ResultsModal
            onNextRound={() => gameLogic.startNewGame()}
            onRestartToInitial={() => gameLogic.restartToInitial()}
          />
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;
