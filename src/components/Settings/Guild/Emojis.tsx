import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from "@nextui-org/react";

const staticEmojis = [
	{
		id: 1,
		name: "bun",
		image: "https://cdn.discordapp.com/emojis/1172019764625944606.webp?size=96&quality=lossless",
		createdBy: "Tea Cup",
	},
];

const animatedEmojis = [
	{
		id: 1,
		name: "spinning_cat",
		image: "https://cdn.discordapp.com/emojis/1255309536563036192.gif?size=240&quality=lossless",
		createdBy: "Tea Cup",
	},
];

/**
 * To do:
 * - If you hover on the name it should allow you to update the name
 * - If you hover on the row then you should be shown a delete button
 * - API Functionality...
 */

const Emojis = () => {
	return (
		<>
			<div className="mr-2 rounded-lg bg-lightAccent p-4 dark:bg-darkAccent">
				<h1 className="mb-4 text-2xl font-semibold">Emojis</h1>
				<div className="h-screen">
					<div className="mt-5 flex flex-col">
						<h1>Upload Requirements:</h1>
						<p className="text-sm text-gray-400">- something...</p>

						<div className={"mt-5 flex"}>
							<Button variant="flat" color="success">
								Upload Emoji
							</Button>
						</div>
					</div>

					<div className="mt-10">
						{/*
						- two types of emojis: animated and static
						*/}

						<h1 className={"mb-2"}>Emoji - 99 Available</h1>
						<Table className={"mb-10"} removeWrapper>
							<TableHeader className={"bg-transparent"}>
								<TableColumn>Image</TableColumn>
								<TableColumn>Name</TableColumn>
								<TableColumn style={{ textAlign: "right" }}>Created By</TableColumn>
							</TableHeader>
							<TableBody>
								{staticEmojis.map((emoji) => (
									<TableRow key={emoji.id}>
										<TableCell>
											<img
												draggable={false}
												src={emoji.image}
												alt={emoji.name}
												style={{ width: "25px", height: "25px" }}
											/>
										</TableCell>
										<TableCell style={{ gap: "10px" }}>:{emoji.name}:</TableCell>
										<TableCell style={{ textAlign: "right" }}>
											<User avatarProps={{ src: "/icon-1.png" }} name={emoji.createdBy} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						<h1 className={"mb-2"}>Animated Emoji - 99 Available</h1>
						<Table removeWrapper>
							<TableHeader>
								<TableColumn>Image</TableColumn>
								<TableColumn>Name</TableColumn>
								<TableColumn style={{ textAlign: "right" }}>Created By</TableColumn>
							</TableHeader>
							<TableBody>
								{animatedEmojis.map((emoji) => (
									<TableRow key={emoji.id}>
										<TableCell>
											<img
												draggable={false}
												src={emoji.image}
												alt={emoji.name}
												style={{ width: "25px", height: "25px" }}
											/>
										</TableCell>
										<TableCell style={{ gap: "10px" }}>:{emoji.name}:</TableCell>
										<TableCell style={{ textAlign: "right" }}>
											<User avatarProps={{ src: "/icon-1.png" }} name={emoji.createdBy} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</>
	);
};

export default Emojis;
