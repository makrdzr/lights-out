import Button from "../components/ui/Button";
import ContainerLayout from "../layouts/ContainerLayout";
import GameGrid from "../components/game/GameGrid";
import StepCounter from "../components/game/StepCounter";

interface GamePageProps {
	onFinish: () => void;
}

const GamePage = ({ onFinish }: GamePageProps) => {
	return (
		<ContainerLayout className="bg-gray-100">
			<h1 className="text-3xl font-bold mb-4">Game</h1>
			<StepCounter />
			<GameGrid />
			<div className="mt-6">
				<Button onClick={onFinish}>Finish Game</Button>
			</div>
		</ContainerLayout>
	);
};

export default GamePage;
