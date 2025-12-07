import { useState } from "react";
import StartPage from "./pages/StartPage";
import GamePage from "./pages/GamePage";
import ResultsPage from "./pages/ResultsPage";

type Page = "start" | "game" | "results";

const App = () => {
	const [currentPage, setCurrentPage] = useState<Page>("start");

	const handleStart = () => setCurrentPage("game");
	const handleFinish = () => setCurrentPage("results");
	const handleRestart = () => setCurrentPage("start");

	return (
		<>
			{currentPage === "start" && <StartPage onStart={handleStart} />}
			{currentPage === "game" && <GamePage onFinish={handleFinish} />}
			{currentPage === "results" && (
				<ResultsPage onRestart={handleRestart} />
			)}
		</>
	);
};

export default App;
