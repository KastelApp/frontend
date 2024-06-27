import { Key, useCallback, useMemo, useState } from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Button,
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	User,
	Selection,
	SortDescriptor,
} from "@nextui-org/react";
import { ChevronDown, EllipsisVertical } from "lucide-react";

const columns = [
	{ name: "ID", uid: "id", sortable: true },
	{ name: "USERNAME", uid: "username", sortable: false },
	{ name: "Blocked Since", uid: "blockedSince", sortable: true },
	{ name: "ACTIONS", uid: "actions", sortable: false },
];

interface User {
	id: string;
	username: string;
	tag: string;
	avatar: string;
	blockedSince: string;
}

const initialColumns = ["username", "blockedSince", "actions"];

const users: User[] = [
	{
		id: "536277067310956565",
		username: "Waffles",
		tag: "1750",
		avatar: "https://development.kastelapp.com/icon-2.png",
		blockedSince: "2024-04-25T04:25:58.704Z",
	},
	{
		id: "779930036635172874",
		username: "Pancakes",
		tag: "8888",
		avatar: "https://development.kastelapp.com/icon-3.png",
		blockedSince: "2021-04-25T04:25:58.704Z",
	},
	// {
	//     id: "81384788765712384",
	//     username: "Dogo",
	//     tag: "1234",
	//     avatar: "https://development.kastelapp.com/icon-4.png",
	//     pendingSince: "2021-04-25T04:25:58.704Z",
	// },
	// {
	//     id: "169256939211980800",
	//     username: "Cats",
	//     tag: "5678",
	//     avatar: "https://development.kastelapp.com/icon.png",
	//     pendingSince: "2022-04-25T04:25:58.704Z",
	// },
	// {
	//     id: "379781622704111626",
	//     username: "DarkerInk",
	//     tag: "0001",
	//     avatar: "https://development.kastelapp.com/icon.png",
	//     pendingSince: "2023-04-25T04:25:58.704Z",
	// },
];

const BlockedFriends = () => {
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
	const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(initialColumns));
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "id",
		direction: "ascending",
	});

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
	}, [visibleColumns]);

	const sortedItems = useMemo(() => {
		return [...users].sort((a: User, b: User) => {
			const first = new Date(a[sortDescriptor.column as keyof User]);
			const second = new Date(b[sortDescriptor.column as keyof User]);
			const cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, users]);

	const renderCell = useCallback((user: User, columnKey: Key) => {
		const cellValue = user[columnKey as keyof User];

		switch (columnKey) {
			case "username": {
				return (
					<User
						avatarProps={{
							radius: "lg",
							src: user.avatar,
							imgProps: { className: "transition-none" },
						}}
						description={`${user.username}#${user.tag}`}
						name={cellValue}
					>
						{user.username}
					</User>
				);
			}
			case "actions": {
				return (
					<Dropdown>
						<DropdownTrigger>
							<Button isIconOnly size="sm" variant="light">
								<EllipsisVertical className="text-default-300" />
							</Button>
						</DropdownTrigger>
						<DropdownMenu disabledKeys={["call"]}>
							<DropdownItem key="view-dm">View DMs</DropdownItem>
							<DropdownItem key="block" color="danger" variant="flat">
								UnBlock
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				);
			}
			case "blockedSince": {
				return new Date(cellValue).toLocaleString();
			}
			default:
				return cellValue;
		}
	}, []);

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex justify-between gap-3 items-end">
					<div className="flex gap-3 ml-auto">
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button endContent={<ChevronDown className="text-small" />} variant="flat">
									Columns
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								aria-label="Table Columns"
								closeOnSelect={false}
								selectedKeys={visibleColumns}
								selectionMode="multiple"
								onSelectionChange={setVisibleColumns}
							>
								{columns.map((column) => (
									<DropdownItem key={column.uid} className="capitalize">
										{column.name}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
			</div>
		);
	}, [visibleColumns, users]);

	return (
		<Table
			aria-label="All your pending friend requests In going and outgoing"
			isHeaderSticky
			bottomContentPlacement="outside"
			classNames={{
				wrapper: "max-h-[382px] bg-accent",
				th: "bg-background"
			}}
			selectedKeys={selectedKeys}
			selectionMode="none"
			sortDescriptor={sortDescriptor}
			topContent={topContent}
			topContentPlacement="outside"
			onSelectionChange={setSelectedKeys}
			onSortChange={setSortDescriptor}
		>
			<TableHeader columns={headerColumns}>
				{(column) => (
					<TableColumn
						key={column.uid}
						align={column.uid === "actions" ? "center" : "start"}
						allowsSorting={column.sortable}
					>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody emptyContent={"You have no pending friend requests"} items={sortedItems}>
				{(item) => (
					<TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

export default BlockedFriends;
