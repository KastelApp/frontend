import { Input, Button } from "@nextui-org/react";
import { Search } from "lucide-react";
import { useState } from "react";

const AddFriend = () => {
	const [userNameAndTag, setUserNameAndTag] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const submit = () => {
		// ? If there's no tag and its not a number thats longer then 16 digits then return an error
		if (
			(!userNameAndTag.includes("#") || isNaN(parseInt(userNameAndTag.split("#")[1]))) &&
			!(userNameAndTag.length > 16 && !isNaN(Number(userNameAndTag)))
		) {
			setErrorMessage("Invalid username and tag");

			setTimeout(() => {
				setErrorMessage("");
			}, 3000);

			return;
		}

		console.log("Add friend", userNameAndTag);

		setErrorMessage("This isn't complete yet!");
	};

	return (
		<div className="flex flex-col items-center justify-center gap-2">
			<h1 className="text-xl">Add a Friend</h1>
			<p className="text-gray-400">Enter your friend's username and tag below.</p>
			<Input
				placeholder="kiki#1750"
				value={userNameAndTag}
				onChange={(e) => setUserNameAndTag(e.target.value)}
				className="md:w-[50vw]"
				startContent={<Search />}
				endContent={
					<Button color="success" variant="flat" className="h-8 rounded-md" radius="none" onPress={submit}>
						Add
					</Button>
				}
				isRequired
				errorMessage={errorMessage}
				isInvalid={errorMessage !== ""}
				description="Enter your friend's username and tag (e.g. kiki#1750)."
			/>
		</div>
	);
};

export default AddFriend;
