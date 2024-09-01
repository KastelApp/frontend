import { Avatar, Badge, Chip } from "@nextui-org/react";
import cn from "@/utils/cn.ts";

const Home = () => {
	const friends = [
		{
			username: "DarkerInk",
			status: "success",
			customStatus: null,
		},
		{
			username: "Koda!!",
			status: "danger",
			customStatus: "Developing :3",
		},
		{
			username: "Status Person",
			status: "warning",
			customStatus: "Heya!",
		},
		{
			username: "Offline Person",
			status: "default",
			customStatus: null,
		},
	];

	const changelogs = [
		{
			title: "Kastel Beta",
			releaseDate: "7/29/2024",
			shortDescription:
				"Kastel Beta is finally here! You can now test out the new features and report any bugs you find!",
		},
		{
			title: "New Channel Type",
			releaseDate: "3/9/2024",
			shortDescription: "We've added a announcement channel type! You can now make announcements in your guild!",
		},
	];

	const guildAnnouncements = [
		{
			guildName: "DarkerInk - Kastel Development",
			announcement: "@everyone The release of Kastel Beta is finally here! Please reload and check the changelogs :p",
		},
		{
			guildName: "Lightning - Lightnings Server",
			announcement: "@everyone hi friends",
		},
	];

	return (
		<div className="min-h-screen p-4 text-white">
			<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
				<div className="rounded-lg bg-gray-800 p-4 shadow">
					<h2 className="text-xl font-semibold">Changelogs</h2>
					<ul className="mt-2">
						{changelogs.map((changelog, index) => (
							<li key={index} className="mb-2 flex items-center justify-between">
								<div className="">
									<span>{changelog.title}</span>
									<p className="max-w-96 truncate text-xs text-gray-500">{changelog.shortDescription}</p>
								</div>
								<span>{changelog.releaseDate}</span>
							</li>
						))}
					</ul>
					<button className="mt-2 text-blue-400">Show More...</button>
				</div>
				<div className="rounded-lg bg-gray-800 p-4 shadow">
					<h2 className="text-xl font-semibold">Friends</h2>
					<ul className="mt-2">
						{friends.map((friend, index) => (
							<li key={index} className="mb-2 flex items-center justify-between">
								<div className="flex items-center">
									<Badge
										content=""
										placement="bottom-right"
										color={friend.status as "warning"}
										className={cn("mb-1 transition-all duration-300 ease-out")}
									>
										<Avatar src={"/icon-1.png"} size="sm" imgProps={{ className: "transition-none" }} />
									</Badge>
									<div className="ml-1 flex flex-col">
										<div className={cn("flex items-center")}>
											<div className={cn("ml-2 flex max-w-36 flex-col")}>
												<p className={cn("truncate text-sm text-white")}>{friend.username}</p>
											</div>
										</div>
										{friend.customStatus && <p className="ml-2 text-xs text-gray-500">{friend.customStatus}</p>}
									</div>
								</div>
							</li>
						))}
					</ul>
					<button className="mt-2 text-blue-400">Show More...</button>
				</div>
				<div className="rounded-lg bg-gray-800 p-4 shadow">
					<h2 className="text-xl font-semibold">Recent Servers</h2>
					<ul className="mt-2">
						<li className="mb-2 flex items-center justify-between">
							<div className="flex items-center">
								<Avatar src={"/icon-1.png"} size="sm" className="mr-2" imgProps={{ className: "transition-none" }} />
								<span>Kastel Development</span>
							</div>
							<div>
								<Chip variant="dot" color="success" className="border-0 p-0 text-white">
									2k Online
								</Chip>
								<Chip variant="dot" color="secondary" className="border-0 p-0 text-white">
									20k Members
								</Chip>
							</div>{" "}
						</li>
						<li className="mb-2 flex items-center justify-between">
							<div className="flex items-center">
								<Avatar src={"/icon-1.png"} size="sm" className="mr-2" imgProps={{ className: "transition-none" }} />
								<span>Lightnings Server</span>
							</div>
							<div>
								<Chip variant="dot" color="success" className="border-0 p-0 text-white">
									{20} Online
								</Chip>
								<Chip variant="dot" color="secondary" className="border-0 p-0 text-white">
									{40} Members
								</Chip>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div className="grid h-[32rem] grid-cols-1 gap-4 md:grid-cols-2">
				<div className="rounded-lg bg-gray-800 p-4 shadow">
					<h2 className="text-xl font-semibold">Guild Announcements</h2>
					<ul className="mt-2">
						{guildAnnouncements.map((announcement, index) => (
							<li key={index} className="mb-2 flex items-center justify-between">
								<div className="flex items-center">
									<Avatar src={"/icon-1.png"} size="sm" imgProps={{ className: "transition-none" }} />
									<div className="ml-2 flex flex-col">
										<p className="text-sm text-white">{announcement.guildName}</p>
										<p className="text-xs text-gray-500">{announcement.announcement}</p>
									</div>
								</div>
							</li>
						))}
					</ul>
					<button className="mt-2 text-blue-400">Show More...</button>
				</div>
				<div className="rounded-lg bg-gray-800 p-4 shadow">
					<h2 className="text-xl font-semibold">Active Channels</h2>
					<ul className="mt-2">
						<li className="mb-2 flex items-center justify-between">
							<div className="flex items-center">
								<img src="/icon-1.png" alt="Channel" className="mr-2 h-8 w-8 rounded-full" />
								<span>#general</span>
							</div>
							<span>500 messages since you've last checked</span>
						</li>
						<li className="mb-2 flex items-center justify-between">
							<div className="flex items-center">
								<img src="/icon-1.png" alt="Channel" className="mr-2 h-8 w-8 rounded-full" />
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
