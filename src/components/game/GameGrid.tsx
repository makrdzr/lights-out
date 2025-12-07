import Cell from "./Cell";

const GameGrid = () => {
	return (
		<div className="bg-white p-8 rounded-lg shadow-lg">
			<div className="grid grid-cols-5 gap-2">
				{Array.from({ length: 25 }).map((_, i) => (
					<Cell
						key={i}
						onClick={() => console.log("Click cell", i)}
						isOn={i % 2 === 0}
					/>
				))}
			</div>
		</div>
	);
};

export default GameGrid;
