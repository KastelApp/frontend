import {
	Dropdown,
	DropdownItem,
	DropdownItemProps,
	DropdownMenu,
	DropdownTrigger,
	useDisclosure,
} from "@nextui-org/react";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import cn from "@/utils/cn.ts";

interface ModalOptions {
	close: () => void;
}

type OverlayPlacement =
	| "top"
	| "bottom"
	| "right"
	| "left"
	| "top-start"
	| "top-end"
	| "bottom-start"
	| "bottom-end"
	| "left-start"
	| "left-end"
	| "right-start"
	| "right-end";

export interface BaseContextMenuProps {
	values: {
		startContent?: React.ReactElement;
		endContent?: React.ReactElement;
		label: string;
		props?: DropdownItemProps;
		subValues?: {
			// ? we only allow for one recursion for now (maybe later if needed?)
			label: string;
			startContent?: React.ReactElement;
			endContent?: React.ReactElement;
			onClick: (modal: ModalOptions) => void;
			props?: DropdownItemProps;
		}[];
		onClick?: (modal: ModalOptions) => void;
	}[];
	children?: React.ReactElement | React.ReactElement[];
	inverse?: boolean; // ? if it requires you to actually rightclick or to function as a normal dropdown
	placement?: OverlayPlacement;
}

/**
 * ContextMenu is used for a few things, this is just a helper to mimic the context menu
 * Main use is for hubs, messages and member context menu's
 */
const BaseContextMenu = ({
	values,
	children, // ? this is the trigger
	inverse,
	placement = "bottom-end",
}: BaseContextMenuProps) => {
	const { isOpen, onClose, onOpen } = useDisclosure();

	const [data, setData] = useState<{
		isOpen: boolean;
		key: number;
	}>({
		isOpen: false,
		key: -1,
	});

	return (
		<Dropdown
			isOpen={isOpen}
			onOpenChange={(v) => {
				if (!v) {
					onClose();

					setData({
						isOpen: false,
						key: -1,
					});
				} else if (inverse) {
					onOpen();
				}
			}}
			placement={placement}
			radius="md"
			closeOnSelect={false}
		>
			<DropdownTrigger>
				<div
					onContextMenu={(e) => {
						e.preventDefault();

						if (inverse) return;

						onOpen();
					}}
				>
					{children}
				</div>
			</DropdownTrigger>
			<DropdownMenu
				onAction={(key) => {
					const found = values[key as number];

					if (!found.onClick) return;

					found.onClick({
						close: () => {
							onClose();
						},
					});
				}}
			>
				{values.map((value, index) => {
					const PossiblyDropdown = ({ children }: { children: React.ReactElement | React.ReactElement[] }) => {
						if (!value.subValues) return children as React.ReactElement;

						return (
							<Dropdown
								isOpen={data.isOpen && data.key == index}
								onOpenChange={(v) => {
									if (!v) {
										setData({
											isOpen: false,
											key: -1,
										});
									}
								}}
								placement="right"
								offset={5}
								radius="md"
								closeOnSelect={false}
							>
								<DropdownTrigger className="rounded-md aria-expanded:scale-100 aria-expanded:opacity-100">
									<div>{children}</div>
								</DropdownTrigger>
								<DropdownMenu>
									{value.subValues.map((subValue, subIndex) => (
										<DropdownItem
											key={subIndex}
											onClick={() => {
												subValue.onClick({
													close: () => {
														setData({
															isOpen: false,
															key: -1,
														});
													},
												});
											}}
											{...subValue.props}
											className={cn("rounded-md", subValue.props?.className)}
										>
											<div className="flex flex-row items-center">
												{subValue.startContent && <div className="my-auto ml-2 mr-auto">{subValue.startContent}</div>}
												<span>{subValue.label}</span>
												<div className="ml-auto">{subValue.endContent}</div>
											</div>
										</DropdownItem>
									))}
								</DropdownMenu>
							</Dropdown>
						);
					};

					return (
						<DropdownItem
							key={index}
							onMouseEnter={() => {
								if (data.isOpen) return;

								setData({
									isOpen: true,
									key: index,
								});
							}}
							onMouseLeave={() => {
								setData({
									isOpen: false,
									key: -1,
								});
							}}
							{...value.props}
							className={cn("rounded-md", value.props?.className)}
						>
							<PossiblyDropdown>
								<div className="flex items-center">
									<span>{value.label}</span>
									{value.subValues && <ChevronRight size={20} className="ml-auto" />}
								</div>
							</PossiblyDropdown>
						</DropdownItem>
					);
				})}
			</DropdownMenu>
		</Dropdown>
	);
};

export default BaseContextMenu;
