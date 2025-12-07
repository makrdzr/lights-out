interface ButtonProps {
	onClick: () => void;
	children: string;
	variant?: "primary" | "secondary";
}

const Button = ({ onClick, children, variant = "primary" }: ButtonProps) => {
	const baseStyles =
		"px-8 py-3 rounded-lg font-semibold transition-colors duration-200";
	const variants = {
		primary: "bg-blue-600 text-white hover:bg-blue-700",
		secondary: "bg-gray-400 text-white hover:bg-gray-500",
	};

	return (
		<button
			onClick={onClick}
			className={`${baseStyles} ${variants[variant]}`}
		>
			{children}
		</button>
	);
};

export default Button;
