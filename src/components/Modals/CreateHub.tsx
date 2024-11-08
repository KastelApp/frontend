import { Avatar, Badge, Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const JoinHub = ({ setSection }: { setSection: (section: "join" | "create" | "home") => void }) => {
	return (
		<>
			<ModalHeader className="flex flex-col gap-1 text-center">
				<h1>Join a Hub</h1>
				<p className="text-sm text-gray-500">Enter an invite link to join a hub</p>
			</ModalHeader>
			<ModalBody>
				<Input autoFocus label="Invite Link" placeholder="https://kastelapp.com/invite/f5HgvkRbVP" variant="bordered" />
				<p className="mt-2 text-sm">Invites should look like this:</p>
				<ul className="ml-6 list-disc">
					<li className="text-sm">f5HgvkRbVP</li>
					<li className="text-sm">https://kastelapp.com/invite/f5HgvkRbVP</li>
					<li className="text-sm">https://kastelapp.com/invite/secret-place</li>
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

const HomeHub = ({ setSection }: { setSection: (section: "join" | "create" | "home") => void }) => {
	return (
		<>
			<ModalHeader className="flex flex-col gap-1 text-center">
				<h1>Join or Create a Hub</h1>
				<p className="text-sm text-gray-500">A hub is where you can chat with friends and play games together</p>
			</ModalHeader>
			<ModalBody>
				<div className="mb-4 grid grid-cols-1 justify-start gap-2">
					<Button
						size="lg"
						color="primary"
						variant="flat"
						onClick={() => {
							setSection("create");
						}}
						className="mb-4 flex items-center justify-between"
					>
						<span className="text-lg">Create Hub</span>
						<ArrowRight />
					</Button>
					<Button
						size="lg"
						color="primary"
						variant="flat"
						onClick={() => {
							setSection("join");
						}}
						className="flex items-center justify-between"
					>
						<span className="text-lg">Join Hub</span>
						<ArrowRight />
					</Button>
				</div>
			</ModalBody>
		</>
	);
};

const CreateHub = ({ setSection }: { setSection: (section: "join" | "create" | "home") => void }) => {
	return (
		<>
			<ModalHeader className="flex flex-col gap-1 text-center">
				<h1>Create a Hub</h1>
				<p className="text-sm text-gray-500">Create a hub to chat with friends and play games together</p>
			</ModalHeader>
			<ModalBody>
				<div className="mb-2 flex justify-center">
					<div className="flex flex-col items-center">
						<div className="transform cursor-pointer transition-all duration-300 ease-in-out hover:scale-95 hover:opacity-50">
							<Badge content="+" color="primary" size="lg">
								<Avatar src="/icon-1.png" size="lg" />
							</Badge>
						</div>
						<p className="mt-2 text-sm text-gray-500">Upload a hub icon</p>
					</div>
				</div>
				<Input autoFocus label="Hub Name" placeholder="My Awesome Hub" variant="bordered" />
				<Input label="Hub Description" placeholder="A place to chat and play games" variant="bordered" />
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
const HubModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: () => void; onClose: () => void }) => {
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
						<HomeHub setSection={setSection} />
					) : section === "join" ? (
						<JoinHub setSection={setSection} />
					) : (
						<CreateHub setSection={setSection} />
					)}
				</motion.div>
			</ModalContent>
		</Modal>
	);
};

export default HubModal;
