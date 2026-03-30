import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import useGameLogic from "./hooks/useGameLogic";
import SettingsModal from "./components/ui/SettingsModal";
import ResultsModal from "./components/ui/ResultsModal";
import ThemeToggle from "./components/ui/ThemeToggle";
import { AppContext, type AppContextType } from "./context/AppContext";
import { useSettingsStore } from "./store/settings";
import { useResultsStore } from "./store/results";

const App = () => {
  const { pathname } = useLocation();
  const settings = useSettingsStore((state) => state.settings);
  const isOpen = useSettingsStore((state) => state.isOpen);
  const closeSettings = useSettingsStore((state) => state.closeSettings);
  const showResultsModal = useResultsStore((state) => state.isOpen);
  const gameLogic = useGameLogic(settings.size, settings.timer);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.theme]);

  const contextValue: AppContextType = {
    gameLogic,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen">
        <ThemeToggle />
        <Outlet />

        {isOpen && <SettingsModal onClose={closeSettings} />}

        {showResultsModal && (
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
