import { Key, useCallback, useEffect, useMemo, useState } from "react";
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
	Chip,
} from "@nextui-org/react";
import { ChevronDown, EllipsisVertical } from "lucide-react";
import { User as UserType, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { useRelationshipsStore } from "@/wrapper/Stores/RelationshipsStore.ts";

const initialColumns = ["username", "pendingSince", "actions", "type"];

const columns = [
	{ name: "ID", uid: "id", sortable: true },
	{ name: "USERNAME", uid: "username", sortable: false },
	{ name: "TYPE", uid: "type", sortable: true },
	{ name: "ACTIONS", uid: "actions", sortable: false },
];

interface Friend {
	id: string;
	user: UserType;
	status: string;
	pending: boolean;
}

const PendingFriends = () => {
	const { getPendingRelationships } = useRelationshipsStore();
	const [friends, setFriends] = useState<Friend[]>([]);
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
	const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(initialColumns));
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "id",
		direction: "ascending",
	});
	const { getUser, getDefaultAvatar } = useUserStore();

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
	}, [visibleColumns]);

	const sortedItems = useMemo(() => {
		return [...friends].sort((a: Friend, b: Friend) => {
			if (sortDescriptor.column === "type") {
				const cmp = a.pending ? -1 : b.pending ? 1 : 0;

				return sortDescriptor.direction === "descending" ? -cmp : cmp;
			}

			const first = BigInt(a.id);
			const second = BigInt(b.id);
			const cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, friends]);

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
			case "type": {
				return (
					<Chip color={user.pending ? "warning" : "success"} variant="flat">
						{user.pending ? "Incoming" : "Outgoing"}
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
							{/* For some stupid reason we have to do type as any */}
							{(user.pending && (
								<DropdownItem key="accept" color="success" variant="flat">Accept</DropdownItem>
							)) as never}
							{(user.pending && (
								<DropdownItem key="deny" color="danger" variant="flat">
									Deny
								</DropdownItem>
							)) as never}
							{(user.pending && (
								<DropdownItem key="ignore" color="warning" variant="flat">
									Ignore
								</DropdownItem>
							)) as never}
							{(!user.pending && (
								<DropdownItem key="cancel" color="danger" variant="flat">Cancel</DropdownItem>
							)) as never}
							<DropdownItem key="block" color="danger" variant="flat">
								Block
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				);
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
	}, [visibleColumns, friends]);

	useEffect(() => {
		const subscribed = useRelationshipsStore.subscribe((state) => {
			setFriends(state.getPendingRelationships().map((x) => {

				const foundUser = getUser(x.userId);

				if (!foundUser) return null;

				return {
					id: x.relationshipId,
					pending: x.pending,
					status: "online",
					user: {
						...foundUser,
						avatar: getDefaultAvatar(foundUser.id),
					}
				};
			}).filter((x) => x !== null));
		});

		const userSubscribed = useUserStore.subscribe((state) => {
			// ? if user exists in friends and the user is different, update the user so we don't show cached data
			const updatedFriends = friends.map((friend) => {
				const user = state.getUser(friend.user.id);

				if (!user) return friend;

				return {
					...friend,
					user: {
						...user,
						avatar: state.getDefaultAvatar(user.id),
					}
				};
			});

			setFriends(updatedFriends);
		});

		setFriends(getPendingRelationships().map((x) => {
			const foundUser = getUser(x.userId);

			if (!foundUser) return null;

			return {
				id: x.relationshipId,
				pending: x.pending,
				status: "online",
				user: {
					...foundUser,
					avatar: getDefaultAvatar(foundUser.id),
				}
			};
		}).filter((x) => x !== null));

		return () => {
			subscribed();
			userSubscribed();
		};
	}, []);

	return (
		<Table
			aria-label="All your pending friend requests In going and outgoing"
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
			<TableBody emptyContent={"You have no pending friend requests."} items={sortedItems}>
				{(item) => (
					<TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey) as string}</TableCell>}</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

export default PendingFriends;
