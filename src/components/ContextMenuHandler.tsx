import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuCheckboxItem,
} from "@/components/ui/context-menu.tsx";
import cn from "@/utils/cn.ts";
import { Divider } from "@nextui-org/react";

export interface ContextMenuProps {
	startContent?: React.ReactNode;
	endContent?: React.ReactNode;
	label: React.ReactNode;
	subValues?: Omit<ContextMenuProps, "subValues">[];
	divider?: boolean;
	onPress?: (e: Event) => void;
	checkBox?: boolean;
	checked?: boolean;
	preventCloseOnClick?: boolean;
	inverse?: boolean; // ? for right click
}

const ContextItemHandler = ({
	children,
	isCheckBox,
	isChecked,
	className,
	onPress,
}: {
	isCheckBox?: boolean;
	isChecked?: boolean;
	children: React.ReactNode;
	className?: string;
	onPress?: (e: Event) => void;
}) => {
	if (isCheckBox) {
		return (
			<ContextMenuCheckboxItem checked={isChecked} className={cn("text-white", className)} onSelect={onPress}>
				{children}
			</ContextMenuCheckboxItem>
		);
	}

	return (
		<ContextMenuItem className={className} onSelect={onPress}>
			{children}
		</ContextMenuItem>
	);
};

const ContextMenuHandler = ({
	children,
	items,
	className,
	identifier,
}: {
	children: React.ReactNode;
	items?: ContextMenuProps[];
	className?: string;
	identifier?: string;
}): React.ReactNode => {
	if (!items || items.length === 0) return children;

	return (
		<ContextMenu>
			<ContextMenuTrigger>{children}</ContextMenuTrigger>
			<ContextMenuContent className={className} data-identifier={identifier}>
				{items.map((item, index) => {
					if (!item.subValues || item.subValues.length === 0) {
						return (
							<>
								<ContextItemHandler
									isCheckBox={item.checkBox}
									isChecked={item.checked}
									key={index}
									onPress={(event) => {
										if (item.preventCloseOnClick) {
											event.preventDefault();
										}

										item.onPress?.(event);
									}}
									className="flex cursor-pointer"
								>
									{item.startContent}
									<span data-identifier={identifier} className="text-white">
										{item.label}
									</span>
									<div className="ml-auto">{item.endContent}</div>
								</ContextItemHandler>
								{item.divider && <Divider className="mb-1 mt-1" />}
							</>
						);
					}

					return (
						<>
							<ContextMenuSub key={index}>
								<ContextMenuSubTrigger className="text-white">{item.label}</ContextMenuSubTrigger>
								<ContextMenuSubContent data-identifier={identifier}>
									{item.subValues.map((subItem, subIndex) => (
										<>
											<ContextItemHandler
												isCheckBox={subItem.checkBox}
												isChecked={subItem.checked}
												key={subIndex}
												onPress={(event) => {
													if (subItem.preventCloseOnClick) {
														event.preventDefault();
													}

													subItem.onPress?.(event);
												}}
												className="flex cursor-pointer"
											>
												{subItem.startContent}
												<span data-identifier={identifier} className="text-white">
													{item.label}
												</span>
												<div className="ml-auto">{subItem.endContent}</div>
											</ContextItemHandler>
											{subItem.divider && <Divider className="mb-1 mt-1" />}
										</>
									))}
								</ContextMenuSubContent>
							</ContextMenuSub>
							{item.divider && <Divider className="mb-1 mt-1" />}
						</>
					);
				})}
			</ContextMenuContent>
		</ContextMenu>
	);
};

export default ContextMenuHandler;
