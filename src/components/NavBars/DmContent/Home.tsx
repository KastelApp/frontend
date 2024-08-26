import { Avatar, Badge, Chip } from "@nextui-org/react";
import { twMerge } from "tailwind-merge";

const Home = () => {
	const friends = [{
		username: "DarkerInk",
		status: "success",
		customStatus: null
	}, {
		username: "Koda!!",
		status: "danger",
		customStatus: "Developing :3"
	}, {
		username: "Status Person",
		status: "warning",
		customStatus: "Heya!"
	}, {
		username: "Offline Person",
		status: "default",
		customStatus: null
	}];

	const changelogs = [{
		title: "Kastel Beta",
		releaseDate: "7/29/2024",
		shortDescription: "Kastel Beta is finally here! You can now test out the new features and report any bugs you find!",
	}, {
		title: "New Channel Type",
		releaseDate: "3/9/2024",
		shortDescription: "We've added a announcement channel type! You can now make announcements in your guild!",
	}];

	const guildAnnouncements = [{
		guildName: "DarkerInk - Kastel Development",
		announcement: "@everyone The release of Kastel Beta is finally here! Please reload and check the changelogs :p"
	}, {
		guildName: "Lightning - Lightnings Server",
		announcement: "@everyone hi friends"
	}];

	return (
		<div className="min-h-screen text-white p-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="bg-gray-800 p-4 rounded-lg shadow">
					<h2 className="text-xl font-semibold">Changelogs</h2>
					<ul className="mt-2">
						{changelogs.map((changelog, index) => (
							<li key={index} className="flex items-center justify-between mb-2">
								<div className="">
									<span>{changelog.title}</span>
									<p className="text-xs text-gray-500 truncate max-w-96">{changelog.shortDescription}</p>
								</div>
								<span>{changelog.releaseDate}</span>
							</li>
						))}
					</ul>
					<button className="mt-2 text-blue-400">Show More...</button>
				</div>
				<div className="bg-gray-800 p-4 rounded-lg shadow">
					<h2 className="text-xl font-semibold">Friends</h2>
					<ul className="mt-2">
						{friends.map((friend, index) => (
							<li key={index} className="flex items-center justify-between mb-2">
								<div className="flex items-center">
									<Badge content="" placement="bottom-right" color={friend.status as "warning"} className={twMerge("mb-1 transition-all duration-300 ease-out")}>
										<Avatar src={"/icon-1.png"} size="sm" imgProps={{ className: "transition-none" }} />
									</Badge>
									<div className="flex flex-col ml-1">
										<div className={twMerge("flex items-center")}>
											<div className={twMerge("flex flex-col ml-2 max-w-36")}>
												<p className={twMerge("truncate text-sm text-white")}>{friend.username}</p>
											</div>
										</div>
										{friend.customStatus && <p className="text-xs text-gray-500 ml-2">{friend.customStatus}</p>}
									</div>
								</div>
							</li>
						))}
					</ul>
					<button className="mt-2 text-blue-400">Show More...</button>
				</div>
				<div className="bg-gray-800 p-4 rounded-lg shadow">
					<h2 className="text-xl font-semibold">Recent Servers</h2>
					<ul className="mt-2">
						<li className="flex items-center justify-between mb-2">
							<div className="flex items-center">
								<Avatar src={"/icon-1.png"} size="sm" className="mr-2" imgProps={{ className: "transition-none" }} />
								<span>Kastel Development</span>
							</div>
							<div>
								<Chip variant="dot" color="success" className="border-0 p-0 text-white">2k Online</Chip>
								<Chip variant="dot" color="secondary" className="border-0 p-0 text-white">20k Members</Chip>
							</div>						</li>
						<li className="flex items-center justify-between mb-2">
							<div className="flex items-center">
								<Avatar src={"/icon-1.png"} size="sm" className="mr-2" imgProps={{ className: "transition-none" }} />
								<span>Lightnings Server</span>
							</div>
							<div>
								<Chip variant="dot" color="success" className="border-0 p-0 text-white">{20} Online</Chip>
								<Chip variant="dot" color="secondary" className="border-0 p-0 text-white">{40} Members</Chip>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[32rem]">
				<div className="bg-gray-800 p-4 rounded-lg shadow">
					<h2 className="text-xl font-semibold">Guild Announcements</h2>
					<ul className="mt-2">
						{guildAnnouncements.map((announcement, index) => (
							<li key={index} className="flex items-center justify-between mb-2">
								<div className="flex items-center">
									<Avatar src={"/icon-1.png"} size="sm" imgProps={{ className: "transition-none" }} />
									<div className="flex flex-col ml-2">
										<p className="text-sm text-white">{announcement.guildName}</p>
										<p className="text-xs text-gray-500">{announcement.announcement}</p>
									</div>
								</div>
							</li>
						))}
					</ul>
					<button className="mt-2 text-blue-400">Show More...</button>
				</div>
				<div className="bg-gray-800 p-4 rounded-lg shadow">
					<h2 className="text-xl font-semibold">Active Channels</h2>
					<ul className="mt-2">
						<li className="flex items-center justify-between mb-2">
							<div className="flex items-center">
								<img src="/icon-1.png" alt="Channel" className="rounded-full w-8 h-8 mr-2" />
								<span>#general</span>
							</div>
							<span>500 messages since you've last checked</span>
						</li>
						<li className="flex items-center justify-between mb-2">
							<div className="flex items-center">
								<img src="/icon-1.png" alt="Channel" className="rounded-full w-8 h-8 mr-2" />
								<span>#announcements</span>
							</div>
							<span>10 new announcements</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Home;
