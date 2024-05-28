import { Tabs, Tab, Chip } from "@nextui-org/react";
import AllFriends from "./Friends/AllFriends.tsx";
import PendingFriends from "./Friends/PendingFriends.tsx";
import BlockedFriends from "./Friends/BlockedFriends.tsx";
import AddFriend from "./Friends/AddFriend.tsx";

const Friends = () => {
	return (
		<>
			<div className="flex w-full flex-col">
				<Tabs
					aria-label="Options"
					color="primary"
					variant="light"
					className="w-full border-b-2 border-slate-800 text-slate-800"
				>
					<Tab
						key="friends"
						title={
							<div className="flex items-center space-x-2">
								<span>Friends</span>
								<Chip size="sm" variant="faded">
									9
								</Chip>
							</div>
						}
					>
						<AllFriends />
					</Tab>
					<Tab
						key="pending-friends"
						title={
							<div className="flex items-center space-x-2">
								<span>Pending</span>
								<Chip size="sm" variant="faded">
									1
								</Chip>
							</div>
						}
					>
						<PendingFriends />
					</Tab>
					<Tab
						key="blocked"
						title={
							<div className="flex items-center space-x-2">
								<span>Blocked</span>
								<Chip size="sm" variant="faded">
									1
								</Chip>
							</div>
						}
					>
						<BlockedFriends />
					</Tab>
					<Tab key="add-new-friend" title={<span>Add a Friend</span>}>
						<AddFriend />
					</Tab>
				</Tabs>
			</div>
		</>
	);
};

export default Friends;
