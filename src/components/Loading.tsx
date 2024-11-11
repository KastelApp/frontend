import { confettiDark } from "@/assets/confetti.tsx";
import Logo from "@/badges/Logo.tsx";
import { useEffect, useState } from "react";

interface Quote {
	quote: string;
	type: "FACT" | "JOKE" | "QUOTE" | "NOTE";
}

enum Mappings {
	FACT = "Did you know?",
	JOKE = "Wanna hear a joke?",
	QUOTE = "Quote of the day",
	NOTE = "Note:",
}

const quotes: Quote[] = [
	{
		quote: "Insert random quote here - Dev",
		type: "NOTE",
	},
	{
		quote: "One of the devs loves otters",
		type: "FACT",
	},
	{
		quote: "I can't code without a fresh glass of Tea",
		type: "QUOTE",
	},
	{
		quote: "That the name of our platform actually came from Supernatural and a tiny bit of mispelling",
		type: "FACT",
	},
	{
		quote: "Meow Meow Meow :33 mrp~~",
		type: "NOTE",
	},
	{
		quote: "Someone on the staff team is obsessed with Dr. Pepper",
		type: "FACT",
	},
	{
		quote: "You look so handsome/pretty today!! :3",
		type: "FACT",
	},
	{
		quote: '"Don\'t let yesterday take up too much of today" — Will Rogers',
		type: "QUOTE",
	},
	{
		quote: "Don't forget to take care of yourself!!",
		type: "NOTE",
	},
];

const Loading = () => {
	const [quote, setQuote] = useState<Quote>({ quote: "", type: "QUOTE" });
	const [prevQuote, setPrevQuote] = useState<Quote>({ quote: "", type: "QUOTE" });

	useEffect(() => {
		const interval = setInterval(() => {
			setPrevQuote(quote);

			let newQuote = quotes[Math.floor(Math.random() * quotes.length)];

			while (newQuote.quote === prevQuote.quote) {
				newQuote = quotes[Math.floor(Math.random() * quotes.length)];
			}

			setQuote(newQuote);
		}, 2500);

		setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

		return () => clearInterval(interval);
	}, []);

	return (
		<div
			style={{
				backgroundImage: confettiDark,
			}}
			className="flex min-h-[100vh] items-start justify-center py-64"
		>
			<div className="mx-auto max-w-lg">
				<div className="flex justify-center">
					<Logo size={128} bgColor="transparent" />
				</div>
				<div className="mt-4 text-center">
					<p className="text-2xl font-bold">{Mappings[quote.type]}</p>
					<p className="mt-2 max-h-40 overflow-auto text-lg">{quote.quote}</p>
				</div>
			</div>
		</div>
	);
};

export default Loading;
