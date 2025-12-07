import Button from "../components/ui/Button";
import ContainerLayout from "../layouts/ContainerLayout";

interface StartPageProps {
	onStart: () => void;
}

const StartPage = ({ onStart }: StartPageProps) => {
	return (
		<ContainerLayout>
			<h1 className="text-4xl font-bold mb-6">Lights Out</h1>
			<p className="text-lg mb-8 text-gray-600">
				Turn off all the lights with the minimum number of steps
			</p>
			<Button onClick={onStart}>Start Game</Button>
		</ContainerLayout>
	);
};

export default StartPage;
