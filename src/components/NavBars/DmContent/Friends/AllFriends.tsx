import { Key, useCallback, useEffect, useMemo, useState } from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Input,
	Button,
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Chip,
	User,
	Selection,
	ChipProps,
	SortDescriptor,
} from "@nextui-org/react";
import { ChevronDown, EllipsisVertical, Search } from "lucide-react";
import { useRelationshipsStore } from "@/wrapper/Stores/RelationshipsStore.ts";
import { User as UserType, useUserStore } from "@/wrapper/Stores/UserStore.ts";

const statusColorMap: Record<string, ChipProps["color"]> = {
	online: "success",
	offline: "default",
	dnd: "danger",
	idle: "warning",
};

const initialColumns = ["username", "status", "friendSince", "actions"];

const columns = [
	{ name: "ID", uid: "id", sortable: true },
	{ name: "USERNAME", uid: "username", sortable: false },
	{ name: "STATUS", uid: "status", sortable: true },
	{ name: "FRIEND SINCE", uid: "friendSince", sortable: true },
	{ name: "ACTIONS", uid: "actions", sortable: false },
];

const statusOptions = [
	{ name: "Online", uid: "online" },
	{ name: "Offline", uid: "offline" },
	{ name: "Do Not Disturb", uid: "dnd" },
	{ name: "Idle", uid: "idle" },
];


interface Friend {
	id: string;
	friendSince: string;
	user: UserType;
	status: string;
}

const AllFriends = () => {
	const { getFriendRelationships } = useRelationshipsStore();
	const [friends, setFriends] = useState<Friend[]>([]);
	const [filterValue, setFilterValue] = useState("");
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
	const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(initialColumns));
	const [statusFilter, setStatusFilter] = useState<Selection>("all");
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "id",
		direction: "ascending",
	});

	const hasSearchFilter = Boolean(filterValue);

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
	}, [visibleColumns]);

	const filteredItems = useMemo(() => {
		let filteredUsers = [...friends];

		if (hasSearchFilter) {
			filteredUsers = filteredUsers.filter((user) => user.user.username.toLowerCase().includes(filterValue.toLowerCase()));
		}
		if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
			filteredUsers = filteredUsers.filter((user) => Array.from(statusFilter).includes(user.status));
		}

		return filteredUsers;
	}, [friends, filterValue, statusFilter]);
	const sortedItems = useMemo(() => {
		return [...filteredItems].sort((a: Friend, b: Friend) => {
			if (sortDescriptor.column === "friendSince") {
				const first = new Date(a.friendSince);
				const second = new Date(b.friendSince);
				const cmp = first < second ? -1 : first > second ? 1 : 0;

				return sortDescriptor.direction === "descending" ? -cmp : cmp;
			}

			const first = BigInt(a.id)
			const second = BigInt(b.id)
			const cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, filteredItems]);

	const renderCell = useCallback((user: Friend, columnKey: Key) => {
		const cellValue = user[columnKey as keyof Friend];

		switch (columnKey) {
			case "username": {
				return (
					<User
						avatarProps={{
							radius: "lg",
							src: user.user.avatar!,
							imgProps: { className: "transition-none" },
						}}
						description={`${user.user.username}#${user.user.tag}`}
						name={user.user.username}
					>
						{user.user.username}
					</User>
				);
			}
			case "status": {
				return (
					<Chip
						className="capitalize border-none gap-1 text-default-600"
						color={statusColorMap[user.status]}
						size="sm"
						variant="dot"
					>
						{cellValue as string}
					</Chip>
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
							<DropdownItem key="call">Call</DropdownItem>
							<DropdownItem key="remove" color="danger" variant="flat">
								Remove Friend
							</DropdownItem>
							<DropdownItem key="block" color="danger" variant="flat">
								Block
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				);
			}
			case "friendSince": {
				return new Date(cellValue as string).toLocaleString();
			}
			default:
				return cellValue;
		}
	}, []);

	const onSearchChange = useCallback((value?: string) => {
		if (value) {
			setFilterValue(value);
		} else {
			setFilterValue("");
		}
	}, []);

	const onClear = useCallback(() => {
		setFilterValue("");
	}, []);

	useEffect(() => {
		const subscribed = useRelationshipsStore.subscribe((state) => {
			setFriends(state.getFriendRelationships().map((x) => {
				
				const foundUser = useUserStore.getState().getUser(x.userId);

				if (!foundUser) return null;

				return {
					friendSince: x.createdAt,
					id: x.relationshipId,
					status: "online",
					user: {
						...foundUser,
						avatar: useUserStore.getState().getDefaultAvatar(foundUser.id),
					}
				}
			}).filter((x) => x !== null))
		});

		const userSubscribed = useUserStore.subscribe((state) => {
			// if user exists in friends and the user is different, update the user
			const updatedFriends = friends.map((friend) => {
				const user = state.getUser(friend.user.id);

				if (!user) return friend;

				return {
					...friend,
					user: {
						...user,
						avatar: state.getDefaultAvatar(user.id),
					}
				}
			});

			setFriends(updatedFriends);
		})

		setFriends(getFriendRelationships().map((x) => {
			const foundUser = useUserStore.getState().getUser(x.userId);

			if (!foundUser) return null;

			return {
				friendSince: x.createdAt,
				id: x.relationshipId,
				status: "online",
				user: {
					...foundUser,
					avatar: useUserStore.getState().getDefaultAvatar(foundUser.id),
				}
			}
		}).filter((x) => x !== null))

		return () => {
			subscribed();
			userSubscribed();
		}
	}, [])

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex justify-between gap-3 items-end">
					<Input
						isClearable
						className="w-full sm:max-w-[44%]"
						placeholder="Search by username or ID..."
						startContent={<Search />}
						value={filterValue}
						onClear={() => onClear()}
						onValueChange={onSearchChange}
					/>
					<div className="flex gap-3">
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button endContent={<ChevronDown className="text-small" />} variant="flat">
									Status
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								aria-label="Table Columns"
								closeOnSelect={false}
								selectedKeys={statusFilter}
								selectionMode="multiple"
								onSelectionChange={setStatusFilter}
							>
								{statusOptions.map((status) => (
									<DropdownItem key={status.uid} className="capitalize">
										{status.name}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
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
	}, [filterValue, statusFilter, visibleColumns, onSearchChange, hasSearchFilter]);

	return (
		<Table
			aria-label="Example table with custom cells, pagination and sorting"
			isHeaderSticky
			bottomContentPlacement="outside"
			classNames={{
				wrapper: "max-h-[382px] bg-lightAccent dark:bg-darkAccent",
				th: "bg-lightBackground dark:bg-darkBackground"
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
			<TableBody emptyContent={"Seems lonely here, why not add someone?"} items={sortedItems}>
				{(item) => (
					<TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey) as string}</TableCell>}</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

export default AllFriends;
