import { useClientStore } from "@/wrapper/Stores.ts";
import { useEffect, useRef, useState } from "react";
import mime from "mime";

const Test = () => {
	const { client } = useClientStore();
	const channelId = "86427670916763674";
	const inputRef = useRef<HTMLInputElement | null>(null);
	const badRef = useRef<HTMLInputElement | null>(null);
	const [url, seturl] = useState<string | null>(null);
	const [fileId, setFileId] = useState<string | null>(null);

	const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (!file) {
			return;
		}

		const name = file.name;
		const size = file.size;

		const data = await client.api.post({
			url: `/channels/${channelId}/attachments`,
			data: {
				filename: name,
				size,
			},
		});

		const { presignedUrl, fileId } = data.body;

		seturl(presignedUrl);
		setFileId(fileId);

		console.log(inputRef.current!.files);
	};

	useEffect(() => {
		if (!inputRef.current) {
			return;
		}

		inputRef.current.addEventListener("change", onChange);

		return () => {
			inputRef.current!.removeEventListener("change", onChange);
		};
	}, []);

	return (
		<div className="flex flex-col">
			<input ref={inputRef} type="file" multiple />
			<input ref={badRef} type="file" />
			<button
				onClick={async () => {
					if (!url) {
						return;
					}

					try {
						const fetched = await fetch(url!, {
							method: "PUT",
							headers: {
								"Content-Type": mime.getType(inputRef.current!.files![0].name) || "application/octet-stream",
								"Content-Length": inputRef.current!.files![0].size.toString(),
							},
							body: inputRef.current!.files![0],
						}).catch((e) => {
							console.error("e", e);
						});

						if (!fetched) {
							return;
						}

						const data = await fetched.text();

						console.log(
							"data",
							data,
							fetched,
							mime.getType(inputRef.current!.files![0].name) || "application/octet-stream",
						);
					} catch (e) {
						console.error("e", e);
					}
				}}
			>
				Submit fake file
			</button>
			<button
				onClick={async () => {
					if (!fileId) {
						return;
					}

					const data = await client.api.del({
						url: `/channels/${channelId}/attachments`,
						data: {
							fileId,
						},
					});

					console.log("deleted data", data);
				}}
			>
				Delete File
			</button>
		</div>
	);
};

export default Test;
