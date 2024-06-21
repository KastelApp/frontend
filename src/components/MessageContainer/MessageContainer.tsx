import { X, Pen, CirclePlus, SendHorizontal, SmilePlus } from "lucide-react";
import SlateEditor from "./SlateEditor.tsx";
import { Divider, Image, Tooltip } from "@nextui-org/react";
import TypingDots from "./TypingDats.tsx";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const FileComponent = ({ fileName, imageUrl }: { fileName?: string; imageUrl?: string; }) => {
	return (
		<div className="w-44 h-44 bg-accent mt-2 rounded-md flex flex-col justify-center relative">
			<div className="relative w-[90%] ml-2.5 max-h-[75%] flex flex-col justify-center items-center bg-gray-500 mb-4">
				<div className="w-full h-full flex justify-center items-center relative overflow-hidden cursor-pointer">
					<Image src={imageUrl} alt={fileName} className="object-cover w-full h-full rounded-md" />
				</div>
			</div>
			<div className="absolute top-0 right-0 bg-gray-800 p-1 z-10 rounded-md">
				<div className="flex gap-2">
					<Tooltip content="Edit File Details">
						<Pen size={18} color="#acaebf" className="cursor-pointer" />
					</Tooltip>
					<Tooltip content="Remove File">
						<X size={18} className="text-danger cursor-pointer" />
					</Tooltip>
				</div>
			</div>
			<div className="absolute bottom-0 left-0 w-full mb-1">
				<span className="text-sm text-white ml-2">{fileName}</span>
			</div>
		</div>
	);
};

const MessageContainer = ({ placeholder, children, isReadOnly, sendMessage }: { placeholder: string; children?: React.ReactNode; isReadOnly?: boolean; sendMessage: (content: string) => void; }) => {
	const [files, setFiles] = useState<{ name: string; url: string; }[]>([]);
	const [replying, setReplying] = useState<boolean>(true);

	return (
		<>
			<div className="flex flex-col h-screen overflow-x-hidden">
				{/* <div className="flex-grow pr-2 overflow-y-auto">{children}</div> */}
				<div className="overflow-y-auto flex-grow">
					{children}
				</div>
				<div className="mb-12 w-[98%] ml-2">
					<div className="ml-1 w-full bg-accent rounded-md rounded-b-none flex">
						<div className="p-2">
							Replying to <span className="text-orange-600 font-semibold">Testing</span>
						</div>
						<div className="flex items-center gap-2 ml-auto mr-2">
							<Tooltip content="Close Reply">
								<X size={22} color="#acaebf" className="cursor-pointer" onClick={() => setReplying(false)} />
							</Tooltip>
						</div>
					</div>
					<div
						className={twMerge(
							"w-full ml-1 py-1 px-4 bg-gray-800 rounded-lg max-h-96 overflow-y-auto overflow-x-hidden",
							replying ? "rounded-t-none" : "",
						)}
					>
						<div className="mb-3 mt-2">
							{files.length > 0 && (
								<div className="flex flex-wrap justify-start mb-4 mt-4 gap-2">
									{files.map((file, index) => (
										<FileComponent key={index} fileName={file.name} imageUrl={file.url} />
									))}
									<Divider className="mt-2" />
								</div>
							)}
							<div className={twMerge("flex", isReadOnly ? "opacity-45 cursor-not-allowed" : "")}>
								<div className="mr-4">
									{/*// todo: File select */}
									<CirclePlus
										size={22}
										color="#acaebf"
										className={twMerge(isReadOnly ? "" : "cursor-pointer")}
										onClick={() => {
											if (isReadOnly) return;

											setFiles((old) => [
												...old,
												{
													name: "test.png",
													url: "https://development.kastelapp.com/icon-1.png",
												},
											]);
										}}
									/>
								</div>
								<SlateEditor sendMessage={sendMessage} placeholder={placeholder} isReadOnly={isReadOnly} readOnlyMessage="You do not have permission to send messages in this channel" />
								<div className="flex ml-4 gap-2">
									<SmilePlus size={22} color="#acaebf" className={twMerge(isReadOnly ? "" : "cursor-pointer")} />
									<SendHorizontal size={22} color="#acaebf" className={twMerge(isReadOnly ? "" : "cursor-pointer")} />
								</div>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-1 mt-1 ml-2">
						<TypingDots />
						<span className="text-xs font-semibold text-gray-300">Testing is typing</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default MessageContainer;
