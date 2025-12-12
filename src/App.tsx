import { Outlet } from "react-router";
import useGameLogic from "./hooks/useGameLogic";
import useSettings from "./hooks/useSettings";
import SettingsModal from "./components/ui/SettingsModal";
import ResultsModal from "./components/ui/ResultsModal";
import { useState } from "react";
import { AppContext, type AppContextType } from "./context/AppContext";

const App = () => {
	const { settings, update: updateSettings } = useSettings();
	const [showSettings, setShowSettings] = useState(false);
	const [showResultsModal, setShowResultsModal] = useState(false);
	const [didWin, setDidWin] = useState(false);

	const gameLogic = useGameLogic(settings.size, settings.timer);

	const contextValue: AppContextType = {
		settings,
		updateSettings,
		openSettings: () => setShowSettings(true),
		gameLogic,
		showResultsModal,
		setShowResultsModal,
		didWin,
		setDidWin,
	};

	return (
		<AppContext.Provider value={contextValue}>
			<Outlet />

			{showSettings && (
				<SettingsModal
					defaultSettings={settings}
					onClose={() => setShowSettings(false)}
					onSave={(s) => updateSettings(s)}
				/>
			)}

			{showResultsModal && (
				<ResultsModal
					isWin={didWin}
					steps={gameLogic.steps}
					onClose={() => setShowResultsModal(false)}
					onNextRound={() => gameLogic.startNewGame()}
					onRestartToInitial={() => gameLogic.restartToInitial()}
					onGoToStart={() => {
						setShowResultsModal(false);
					}}
				/>
			)}
		</AppContext.Provider>
	);
};

export default App;
