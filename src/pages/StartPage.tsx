import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import Button from "../components/ui/Button";
import ContainerLayout from "../layouts/ContainerLayout";
import { useAppContext } from "../context/AppContext";

const StartPage = () => {
	const navigate = useNavigate();
	const { openSettings, gameLogic } = useAppContext();

	const handleStartGame = () => {
		const userId = uuidv4();
		gameLogic.startNewGame();
		navigate(`/game/${userId}`);
	};

	return (
		<ContainerLayout>
			<h1 className="text-4xl font-bold mb-6">Lights Out</h1>
			<p className="text-lg mb-8 text-gray-600">
				Turn off all the lights with the minimum number of steps
			</p>
			<div className="flex gap-3">
				<Button onClick={handleStartGame}>Start Game</Button>
				<Button onClick={openSettings} variant="secondary">
					Settings
				</Button>
			</div>
		</ContainerLayout>
	);
};

export default StartPage;
