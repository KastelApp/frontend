import cn from "@/utils/cn.ts";
import { Skeleton } from "@nextui-org/react";
import { memo, useEffect, useState } from "react";

const MessageToSkelton = memo(({ msg, getLength }: { msg: string; getLength(word: string): number }) => {
	const words = msg.split(" ");

	return (
		<div className="flex flex-wrap gap-1">
			{words.map((word, index) => {
				const messageWidth = getLength(word);

				return (
					<Skeleton
						key={index}
						className="mt-1 max-h-5 min-h-5 rounded-lg"
						style={{
							minWidth: messageWidth,
							maxWidth: messageWidth,
						}}
						disableAnimation
					/>
				);
			})}
		</div>
	);
});

const randomData = {
	names: [
		"DarkerInk",
		"TeaCup",
		"Otters",
		"Cats",
		"Waffles",
		"Developer",
		"John",
		"Rock",
		"Wick",
		"vegetable",
		"funky",
		"stitch",
	],
	content: [
		"Hello World! How are you",
		"This is a message",
		"A Cats the actual contents",
		"Sot know >>>:33333",
		"Very cool msg",
	],
};

const SkellyMessage = memo(() => {
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d")!;

	context.font = "20px Roboto";

	const getLength = (word: string) => {
		// ? temp
		return 60;

		const length = context.measureText(word).width;
		return length < 20 ? length + length : length;
	};

	const [name, setName] = useState("");
	const [content, setContent] = useState("");

	useEffect(() => {
		const randomName = randomData.names[Math.floor(Math.random() * randomData.names.length)];
		const randomContent = randomData.content[Math.floor(Math.random() * randomData.content.length)];

		setName(randomName);
		setContent(randomContent);
	}, []);

	return (
		<div className={cn("group relative mb-4 w-full hover:bg-msg-hover")}>
			<div className="flex">
				<Skeleton
					className="ml-2 mt-1 h-8 min-h-8 w-8 min-w-8 transform cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:scale-95"
					disableAnimation
				/>
				<div className="relative">
					<div className="ml-2 flex flex-col">
						<div className="flex min-w-96">
							<Skeleton
								className="max-h-4 min-h-4 cursor-pointer rounded-lg"
								style={{
									minWidth: getLength(name),
									maxWidth: getLength(name),
								}}
								disableAnimation
							/>
						</div>
						<MessageToSkelton msg={content} getLength={getLength} />
					</div>
				</div>
			</div>
		</div>
	);
});

export default SkellyMessage;
