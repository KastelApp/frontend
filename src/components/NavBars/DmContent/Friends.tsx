import { Tabs, Tab, Chip } from "@nextui-org/react";
import AllFriends from "./Friends/AllFriends.tsx";
import PendingFriends from "./Friends/PendingFriends.tsx";
import BlockedFriends from "./Friends/BlockedFriends.tsx";
import AddFriend from "./Friends/AddFriend.tsx";
import { useRelationshipsStore } from "@/wrapper/Stores/RelationshipsStore.ts";
import { useEffect, useState } from "react";

const Friends = () => {
	const { getBlockedRelationships, getFriendRelationships, getPendingRelationships } = useRelationshipsStore();

	const [pendingFriends, setPendingFriends] = useState(0);
	const [blockedFriends, setBlockedFriends] = useState(0);
	const [friendCount, setFriendCount] = useState(0);

	useEffect(() => {
		const pending = getPendingRelationships();
		const blocked = getBlockedRelationships();
		const friends = getFriendRelationships();

		setPendingFriends(pending.length);
		setBlockedFriends(blocked.length);
		setFriendCount(friends.length);

		const subscription = useRelationshipsStore.subscribe((state) => {
			const pending = state.getPendingRelationships();
			const blocked = state.getBlockedRelationships();
			const friends = state.getFriendRelationships();

			setPendingFriends(pending.length);
			setBlockedFriends(blocked.length);
			setFriendCount(friends.length);
		});

		return () => subscription();
	}, []);

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
								<span className="font-medium transition-colors duration-100 group-data-[selected=true]:text-foreground-50">
									Friends
								</span>
								{friendCount > 0 && (
									<Chip size="sm" variant="faded" color="success">
										{friendCount}
									</Chip>
								)}
							</div>
						}
					>
						<AllFriends />
					</Tab>
					<Tab
						key="pending-friends"
						title={
							<div className="flex items-center space-x-2">
								<span className="font-medium transition-colors duration-100 group-data-[selected=true]:text-foreground-50">
									Pending
								</span>
								{pendingFriends > 0 && (
									<Chip size="sm" variant="faded" color="warning">
										{pendingFriends}
									</Chip>
								)}
							</div>
						}
					>
						<PendingFriends />
					</Tab>
					<Tab
						key="blocked"
						title={
							<div className="flex items-center space-x-2">
								<span className="font-medium transition-colors duration-100 group-data-[selected=true]:text-foreground-50">
									Blocked
								</span>
								{blockedFriends > 0 && (
									<Chip size="sm" variant="faded" color="danger">
										{blockedFriends}
									</Chip>
								)}
							</div>
						}
					>
						<BlockedFriends />
					</Tab>
					<Tab
						key="add-new-friend"
						title={
							<span className="font-medium transition-colors duration-100 group-data-[selected=true]:text-foreground-50">
								Add a Friend
							</span>
						}
					>
						<AddFriend />
					</Tab>
				</Tabs>
			</div>
		</>
	);
};

export default Friends;
