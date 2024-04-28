import React, { Key, useCallback, useMemo, useState } from "react";
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
    SortDescriptor
} from "@nextui-org/react";
import { ChevronDown, EllipsisVertical, Search } from "lucide-react";

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

const users = [
    {
        id: "536277067310956565",
        username: "Waffles",
        tag: "1750",
        avatar: "https://development.kastelapp.com/icon-2.png",
        friendSince: "2024-04-25T04:25:58.704Z",
        status: "online"
    },
    {
        id: "779930036635172874",
        username: "Pancakes",
        tag: "8888",
        avatar: "https://development.kastelapp.com/icon-3.png",
        friendSince: "2024-04-25T04:25:58.704Z",
        status: "offline"
    },
    {
        id: "81384788765712384",
        username: "Dogo",
        tag: "1234",
        avatar: "https://development.kastelapp.com/icon-4.png",
        friendSince: "2021-04-25T04:25:58.704Z",
        status: "dnd"
    },
    {
        id: "169256939211980800",
        username: "Cats",
        tag: "5678",
        avatar: "https://development.kastelapp.com/icon.png",
        friendSince: "2022-04-25T04:25:58.704Z",
        status: "idle"
    },
    {
        id: "379781622704111626",
        username: "DarkerInk",
        tag: "0001",
        avatar: "https://development.kastelapp.com/icon.png",
        friendSince: "2023-04-25T04:25:58.704Z",
        status: "online"
    },
];

interface User {
    id: string;
    username: string;
    tag: string;
    avatar: string;
    friendSince: string;
    status: string;
}

const AllFriends = () => {
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
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.username.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredUsers = filteredUsers.filter((user) =>
                Array.from(statusFilter).includes(user.status),
            );
        }

        return filteredUsers;
    }, [users, filterValue, statusFilter]);
    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a: User, b: User) => {

            if (sortDescriptor.column === "friendSince") {
                const first = new Date(a[sortDescriptor.column as keyof User]);
                const second = new Date(b[sortDescriptor.column as keyof User]);
                const cmp = first < second ? -1 : first > second ? 1 : 0;

                return sortDescriptor.direction === "descending" ? -cmp : cmp;
            }

            const first = a[sortDescriptor.column as keyof User];
            const second = b[sortDescriptor.column as keyof User];
            const cmp = first.length < second.length ? -1 : first.length > second.length ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);

    const onlineFriends = useMemo(() => {
        return users.filter((user) => user.status === "online").length;
    }, [users]);

    const renderCell = useCallback((user: User, columnKey: Key) => {
        const cellValue = user[columnKey as keyof User];

        switch (columnKey) {
            case "username": {
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user.avatar, imgProps: { className: "transition-none" } }}
                        description={`${user.username}#${user.tag}`}
                        name={cellValue}
                    >
                        {user.username}
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
                        {cellValue}
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
                            <DropdownItem key="remove" color="danger" variant="flat">Remove Friend</DropdownItem>
                            <DropdownItem key="block" color="danger" variant="flat">Block</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            }
            case "friendSince": {
                return new Date(cellValue).toLocaleString();
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

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by username or id..."
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
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {users.length} friends - {onlineFriends}/{users.length} online</span>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        users.length,
        hasSearchFilter,
    ]);

    return (
        <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px]",
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
            <TableBody emptyContent={"No users found"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};


export default AllFriends;