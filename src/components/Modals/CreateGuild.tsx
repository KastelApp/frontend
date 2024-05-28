import { Avatar, Badge, Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const JoinGuild = ({ setSection }: { setSection: (section: "join" | "create" | "home") => void }) => {
	return (
		<>
			<ModalHeader className="flex flex-col gap-1 text-center">
				<h1>Join a Guild</h1>
				<p className="text-sm text-gray-500">Enter an invite link to join a guild</p>
			</ModalHeader>
			<ModalBody>
				<Input autoFocus label="Invite Link" placeholder="https://kstl.app/f5HgvkRbVP" variant="bordered" />
				<p className="text-sm mt-2">Invites should look like this:</p>
				<ul className="list-disc ml-6">
					<li className="text-sm">f5HgvkRbVP</li>
					<li className="text-sm">https://kstl.app/f5HgvkRbVP</li>
					<li className="text-sm">https://kstl.app/secret-place</li>
				</ul>
				<div className="mt-2 flex justify-between">
					<Button
						color="danger"
						variant="flat"
						onClick={() => {
							setSection("home");
						}}
					>
						Back
					</Button>
					<Button color="success" variant="flat">
						Join
					</Button>
				</div>
			</ModalBody>
		</>
	);
};

const HomeGuild = ({ setSection }: { setSection: (section: "join" | "create" | "home") => void }) => {
	return (
		<>
			<ModalHeader className="flex flex-col gap-1 text-center">
				<h1>Join or Create a Guild</h1>
				<p className="text-sm text-gray-500">A guild is where you can chat with friends and play games together</p>
			</ModalHeader>
			<ModalBody>
				<div className="grid grid-cols-1 gap-2 justify-start mb-4">
					<Button
						size="lg"
						color="primary"
						variant="flat"
						onClick={() => {
							setSection("create");
						}}
						className="flex justify-between items-center mb-4"
					>
						<span className="text-lg">Create Guild</span>
						<ArrowRight />
					</Button>
					<Button
						size="lg"
						color="primary"
						variant="flat"
						onClick={() => {
							setSection("join");
						}}
						className="flex justify-between items-center"
					>
						<span className="text-lg">Join Guild</span>
						<ArrowRight />
					</Button>
				</div>
			</ModalBody>
		</>
	);
};

const CreateGuild = ({ setSection }: { setSection: (section: "join" | "create" | "home") => void }) => {
	return (
		<>
			<ModalHeader className="flex flex-col gap-1 text-center">
				<h1>Create a Guild</h1>
				<p className="text-sm text-gray-500">Create a guild to chat with friends and play games together</p>
			</ModalHeader>
			<ModalBody>
				<div className="flex justify-center mb-2">
					<div className="flex flex-col items-center">
						<div className="cursor-pointer hover:scale-95 transition-all duration-300 ease-in-out transform hover:opacity-50">
							<Badge content="+" color="primary" size="lg">
								<Avatar src="https://development.kastelapp.com/icon-1.png" size="lg" />
							</Badge>
						</div>
						<p className="text-sm text-gray-500 mt-2">Upload a guild icon</p>
					</div>
				</div>
				<Input autoFocus label="Guild Name" placeholder="My Awesome Guild" variant="bordered" />
				<Input label="Guild Description" placeholder="A place to chat and play games" variant="bordered" />
				<div className="mt-2 flex justify-between">
					<Button
						color="danger"
						variant="flat"
						onClick={() => {
							setSection("home");
						}}
					>
						Back
					</Button>
					<Button color="success" variant="flat">
						Create
					</Button>
				</div>
			</ModalBody>
		</>
	);
};
const GuildModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: () => void; onClose: () => void }) => {
	const [section, setSection] = useState<"join" | "create" | "home">("home");

	const [animationDirection, setAnimationDirection] = useState<"left" | "right">("left");

	useEffect(() => {
		if (section === "home") {
			setAnimationDirection("left");
		} else {
			setAnimationDirection("right");
		}
	}, [section]);

	const initialVariants = {
		hidden: { opacity: 0, x: animationDirection === "left" ? 100 : -100 },
		enter: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: animationDirection === "left" ? -100 : 100 },
	};

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={() => {
				onOpenChange();
				setSection("home");
			}}
			placement="top-center"
			size="xl"
			className="w-96"
		>
			<ModalContent className="overflow-hidden">
				<motion.div
					key={section}
					initial="hidden"
					animate="enter"
					variants={initialVariants}
					transition={{ duration: 0.4 }}
				>
					{section === "home" ? (
						<HomeGuild setSection={setSection} />
					) : section === "join" ? (
						<JoinGuild setSection={setSection} />
					) : (
						<CreateGuild setSection={setSection} />
					)}
				</motion.div>
			</ModalContent>
		</Modal>
	);
};

export default GuildModal;
