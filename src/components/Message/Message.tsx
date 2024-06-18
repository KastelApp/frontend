import { Avatar, Chip, Popover, PopoverContent, PopoverTrigger, Tooltip, useDisclosure } from "@nextui-org/react";
import UserPopover from "../Popovers/UserPopover.tsx";
import { memo, useState } from "react";
import { Pen, Reply, Trash2, Ellipsis } from "lucide-react";
import { twMerge } from "tailwind-merge";
import UserModal from "../Modals/UserModal.tsx";
import RichEmbed, { Embed } from "./Embeds/RichEmbed.tsx";
import IFrameEmbed from "./Embeds/IFrameEmbed.tsx";
import InviteEmbed from "./Embeds/InviteEmbed.tsx";

const Message = memo(({
	content,
	replying,
	mention,
	className,
	disableButtons,
	tag,
	embeds,
	invites
}: {
	content: string;
	replying: boolean;
	mention: boolean;
	className?: string;
	disableButtons?: boolean;
	tag?: "System" | "Bot";
	embeds?: Embed[];
	invites?: {
		code: string;
		guild: {
			name: string;
			icon: string | null;
			members: {
				online: number;
				total: number;
			};
		};
	}[];
}) => {
	const PopOverData = ({ children }: { children: React.ReactElement | React.ReactElement[]; }) => {
		const [isOpen, setIsOpen] = useState(false);

		const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();

		if (disableButtons) return children as React.ReactElement;

		return (
			<>
				<UserModal isOpen={isModalOpen} onClose={onClose} user={{
					avatar: null,
					id: "",
					username: "",
				}} />
				<Popover
					placement="right"
					isOpen={isOpen}
					onOpenChange={setIsOpen}
					shouldCloseOnInteractOutside={() => {
						setIsOpen(false);
						return false;
					}}
				>
					<PopoverTrigger>{children}</PopoverTrigger>
					<PopoverContent>
						<UserPopover
							member={{
								avatar: "https://development.kastelapp.com/icon-1.png",
								customStatus: "Hey",
								discriminator: "0001",
								id: "1",
								isOwner: false,
								roles: ["admin"],
								status: "online",
								tag: null,
								username: "DarkerInk",
							}}
							onClick={() => {
								onOpen();
								setIsOpen(false);
							}}
						/>
					</PopoverContent>
				</Popover>
			</>
		);
	};

	return (
		<div
			className={twMerge(
				"group w-full hover:bg-msg-hover mb-2 relative",
				className,
				mention ? "bg-mention hover:bg-mention-hover" : "",
			)}
			tabIndex={0}
		>
			{replying && (
				<div className="flex items-center ml-4 mb-1">
					<Reply
						size={22}
						color="#acaebf"
						className="cursor-pointer"
						style={{
							transform: "rotate(180deg) scale(1, -1)",
						}}
					/>
					<PopOverData>
						<div className="flex items-center cursor-pointer">
							<Avatar
								src="https://development.kastelapp.com/icon-1.png"
								className="ml-2 cursor-pointer w-4 h-4"
								imgProps={{ className: "transition-none" }}
							/>
							<p className="text-orange-500 text-xs ml-1">{mention ? "@" : ""}DarkerInk</p>
						</div>
					</PopOverData>
					<p className="text-gray-300 text-2xs ml-2">{Number(content.slice(0, 2)) + 1}</p>
				</div>
			)}
			<div className="flex">
				<PopOverData>
					<Avatar
						src="https://development.kastelapp.com/icon-1.png"
						className=" mt-1 ml-2 cursor-pointer min-w-8 min-h-8 w-8 h-8 hover:scale-95 transition-all duration-300 ease-in-out transform"
						imgProps={{ className: "transition-none" }}
					/>
				</PopOverData>
				<div className="relative">
					<div className="flex flex-col ml-2">
						<span>
							<PopOverData>
								<span className="inline cursor-pointer text-orange-500">DarkerInk</span>
							</PopOverData>
							{tag && (
								<Chip color="success" variant="flat" className="ml-1 w-1 p-0 h-4 text-[10px] rounded-sm" radius="none">
									{tag}
								</Chip>
							)}
							<Tooltip content="Saturday, May 11. 2024 12:00 PM" placement="top">
								<span className="text-gray-400 text-2xs mt-1 ml-1">Today at 12:00 PM</span>
							</Tooltip>
						</span>
						<div className="text-white whitespace-pre-line overflow-hidden break-all">
							<p>{content}</p>
						</div>
						{invites && invites.map((invite, index) => (
							<div key={index} className="mt-2 inline-block max-w-full overflow-hidden">
								<InviteEmbed invite={invite} />
							</div>
						))}
						{embeds && embeds.map((embed, index) => (
							<div key={index} className="mt-2 inline-block max-w-full overflow-hidden">
								{embed.type === "Rich" ?
									<RichEmbed embed={embed} /> : embed.type === "Iframe" ? <IFrameEmbed embed={embed} /> : null}
							</div>
						))}
					</div>
				</div>
			</div>
			{!disableButtons && (
				<div className="z-10 items-center gap-2 bg-gray-800 absolute top-[-1rem] right-0 hidden group-hover:flex hover:flex p-1 rounded-md mr-2">
					<Tooltip content="Reply">
						<Reply size={18} color="#acaebf" className="cursor-pointer" />
					</Tooltip>
					<Tooltip content="Edit">
						<Pen size={18} color="#acaebf" className="cursor-pointer" />
					</Tooltip>
					<Tooltip content="Delete">
						<Trash2 size={18} className="text-danger cursor-pointer" />
					</Tooltip>
					<Tooltip content="More">
						<Ellipsis size={18} color="#acaebf" className="cursor-pointer" />
					</Tooltip>
				</div>
			)}
		</div>
	);
});

export default Message;
