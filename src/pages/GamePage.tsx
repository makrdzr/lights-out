import { useEffect } from "react";
import { useParams } from "react-router";
import Button from "../components/ui/Button";
import ContainerLayout from "../layouts/ContainerLayout";
import GameGrid from "../components/game/GameGrid";
import StepCounter from "../components/game/StepCounter";
import Timer from "../components/game/Timer";
import { useAppContext } from "../context/AppContext";

const GamePage = () => {
	const { userId } = useParams<{ userId: string }>();
	const { gameLogic, settings, setShowResultsModal, setDidWin } =
		useAppContext();

	useEffect(() => {
		if (gameLogic.isWon) {
			setDidWin(true);
			setShowResultsModal(true);
		}
	}, [gameLogic.isWon, setDidWin, setShowResultsModal]);

	useEffect(() => {
		if (gameLogic.isLost) {
			setDidWin(false);
			setShowResultsModal(true);
		}
	}, [gameLogic.isLost, setDidWin, setShowResultsModal]);

	const handleGiveUp = () => {
		setDidWin(false);
		setShowResultsModal(true);
	};

	return (
		<ContainerLayout className="bg-gray-100">
			<span className="text-sm text-gray-500 mb-2">
				Player: {userId?.slice(0, 8)}...
			</span>

			<h1 className="text-3xl font-bold mb-4">Game</h1>

			<div className="flex gap-6 mb-3 items-center justify-center">
				<StepCounter steps={gameLogic.steps} />
				{settings.timer > 0 && <Timer timeLeft={gameLogic.timeLeft} />}
			</div>

			<GameGrid
				grid={gameLogic.grid}
				onCellClick={gameLogic.handleCellClick}
			/>
			<div className="mt-6 flex gap-4">
				<Button onClick={gameLogic.startNewGame}>New Game</Button>
				<Button onClick={handleGiveUp} variant="secondary">
					Give Up
				</Button>
			</div>
		</ContainerLayout>
	);
};

export default GamePage;
