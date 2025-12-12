import { createContext, useContext } from "react";
import type useSettings from "../hooks/useSettings";
import type useGameLogic from "../hooks/useGameLogic";

export interface AppContextType {
	settings: ReturnType<typeof useSettings>["settings"];
	updateSettings: ReturnType<typeof useSettings>["update"];
	openSettings: () => void;
	gameLogic: ReturnType<typeof useGameLogic>;
	showResultsModal: boolean;
	setShowResultsModal: (_show: boolean) => void;
	didWin: boolean;
	setDidWin: (_win: boolean) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within AppProvider");
	}
	return context;
};
