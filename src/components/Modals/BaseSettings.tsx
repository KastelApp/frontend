import { type Section } from "@/types/settings.ts";
import { Modal, ModalContent } from "@nextui-org/react";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import cn from "@/utils/cn.ts";

const Section = ({
	title,
	children,
	setSection,
}: {
	title: string | null;
	children: Section["children"];
	setSection: (section: string) => void;
}) => {
	return (
		<div className="flex w-full min-w-60 select-none flex-col gap-1 p-2 xl:min-w-64">
			{title && <h2 className="text-md mb-2 ml-2 select-none font-semibold text-white">{title}</h2>}
			{children.map((child) => (
				<div
					key={child.title}
					className={cn(
						"group mb-0.5 flex h-14 w-full cursor-pointer items-center justify-between rounded-lg",
						child.disabled
							? "cursor-not-allowed bg-charcoal-900"
							: "transform bg-charcoal-700 transition-all duration-300 ease-in-out hover:bg-charcoal-600 active:scale-[.97]",
						child.danger ? "bg-danger/20 text-danger hover:bg-danger/15 focus:bg-danger/20" : "text-white",
					)}
					onClick={() => {
						if (child.onPress) {
							child.onPress();
						}

						if (!child.disabled && child.section) {
							setSection(child.id);
						}
					}}
				>
					<div className="flex items-center">
						{child.startContent}
						<p className="text-md ml-2 truncate">{child.title}</p>
					</div>
					{child.endContent}
				</div>
			))}
		</div>
	);
};

/**
 * This is a helper made to make creating setting modals easier, only two spots using this right now are user and hub settings
 */
const BaseSettings = ({
	isOpen,
	onOpenChange,
	sections,
	initialSection,
	title,
	metadata,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
	sections: Section[];
	initialSection: string;
	title: string;
	metadata?: React.ReactNode;
}) => {
	const [selectedSection, setSelectedSection] = useState(initialSection);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setOpen(false);
	}, [selectedSection]);

	return (
		<>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				size="full"
				className="h-screen w-screen"
				isDismissable={false}
				isKeyboardDismissDisabled={true}
				classNames={{
					closeButton: "z-20",
				}}
			>
				<ModalContent>
					<div className="m-0 flex h-full w-full overflow-x-hidden">
						<div className="flex h-full w-full">
							<div
								className={cn(
									"!z-[100] h-screen min-w-64 justify-end overflow-y-auto bg-lightAccent dark:bg-darkAccent sm:flex xl:min-w-96",
									!open ? "hidden" : "absolute z-20 w-[100vw]",
								)}
							>
								<div className="mr-2 justify-end">
									<Menu color="#acaebf" size={24} onClick={() => setOpen(!open)} className="cursor-pointer sm:hidden" />
									<p className="text-md max-w-64 select-none truncate p-4 font-semibold text-white">{title}</p>
									{sections.map((section) => (
										<Section
											title={section.title}
											key={section.title}
											// eslint-disable-next-line react/no-children-prop
											children={section.children}
											setSection={setSelectedSection}
										/>
									))}
									{metadata}
								</div>
							</div>

							<div className={cn("cursor-pointer justify-center overflow-auto sm:hidden", open ? "hidden" : "")}>
								<Menu color="#acaebf" size={24} onClick={() => setOpen(!open)} />
							</div>

							<div className="flex h-full w-full flex-col overflow-auto p-5 pt-4">
								{
									sections
										.find((s) => s.children.find((c) => c.id === selectedSection))
										?.children.find((c) => c.id === selectedSection)?.section
								}
							</div>
						</div>
					</div>
				</ModalContent>
			</Modal>
		</>
	);
};

export default BaseSettings;
