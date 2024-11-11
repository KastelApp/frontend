import { Avatar, Button, Chip } from "@nextui-org/react";
import cn from "@/utils/cn.ts";
import { Skeleton } from "@nextui-org/react";
import { useEditorStore, useTranslationStore } from "@/wrapper/Stores.tsx";
import { Invite } from "@/wrapper/Stores/InviteStore.ts";
import { Hub } from "@/wrapper/Stores/HubStore.ts";
import { useCallback } from "react";
import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";

const InviteEmbed = ({
	invite,
	skeleton,
	userId,
}: {
	invite:
		| (Invite & {
				hub: Hub | null;
		  })
		| null;
	skeleton?: boolean;
	userId?: string;
}) => {
	const { t } = useTranslationStore();
	const { editor } = useEditorStore();

	const addAsk = useCallback(() => {
		if (!editor) return;

		Transforms.insertText(editor, `Hey <@${userId}>, may I get a new invite?`);

		const endPoint = Editor.end(editor, []);

		Transforms.select(editor, endPoint);
		ReactEditor.focus(editor);
	}, [editor, userId]);

	const buttonOnClick = useCallback(async () => {
		if (skeleton) return;

		if (!invite?.hub) {
			addAsk();

			return;
		}
	}, [invite, addAsk, skeleton]);

	if (skeleton) {
		return (
			<div className="max-w-[calc(100%-1rem)] rounded-lg bg-darkAccent p-3 shadow-md mm-h-40 md:max-w-sm md:mm-h-28">
				<h2 className="mb-3 text-medium font-semibold">
					<Skeleton className="h-6 w-64 rounded-md" />
				</h2>

				<div className="grid grid-cols-[auto,1fr] items-center gap-2 md:grid-cols-[auto,1fr,auto]">
					<div className="row-span-2">
						<Skeleton className="mb-2 rounded-xl mm-hw-10" />
					</div>

					<div className="flex flex-col justify-center">
						<span className="ml-1 text-sm">
							<Skeleton className="h-5 w-32 rounded-md" />
						</span>
						<div className="flex">
							<Skeleton className="ml-1 mt-1 h-4 w-10 rounded-md" />
							<Skeleton className="ml-1 mt-1 h-4 w-10 rounded-md" />
						</div>
					</div>

					<div className="ml-auto mt-2 hidden md:block">
						<Skeleton className="rounded-md">
							<Button size="sm">{t("hubs.invites.join")}</Button>
						</Skeleton>
					</div>
				</div>

				<div className="mt-3 md:hidden">
					<Skeleton className="rounded-md">
						<Button size="sm" className="w-full" isLoading>
							{t("hubs.invites.join")}
						</Button>
					</Skeleton>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-[calc(100%-1rem)] rounded-lg bg-darkAccent p-3 shadow-md mm-h-40 md:max-w-sm md:mm-h-28">
			<h2 className={cn("mb-3 text-medium font-semibold", !invite?.valid && "text-danger")}>
				{invite?.valid ? t("hubs.invites.validInvite") : t("hubs.invites.invalidInvite")}
			</h2>

			<div className="grid grid-cols-[auto,1fr] items-center gap-2 md:grid-cols-[auto,1fr,auto]">
				<div className="row-span-2">
					<Avatar
						src="/icon-1.png"
						alt="Avatar"
						className="mb-2 rounded-xl mm-hw-10"
						imgProps={{ className: "transition-none" }}
					/>
				</div>

				<div className="flex flex-col justify-center">
					{invite?.hub ? (
						<>
							<p className="ml-1 text-sm">{invite.hub.name}</p>
							<div className="flex">
								<Chip variant="dot" color="success" size="sm" className="border-0 p-0 text-white">
									30 {t("hubs.online")}
								</Chip>
								<Chip variant="dot" color="secondary" size="sm" className="border-0 p-0 text-white">
									{invite.hub.memberCount} {t("hubs.members")}
								</Chip>
							</div>
						</>
					) : (
						<p className="ml-1 mt-2 text-sm text-danger">Invalid Invite</p>
					)}
				</div>

				<div className="ml-auto mt-2 hidden md:block">
					<Button color={invite?.hub ? "success" : "danger"} size="sm" variant="flat" onPress={buttonOnClick}>
						{invite?.hub ? t("hubs.invites.join") : t("hubs.invites.invalid")}
					</Button>
				</div>
			</div>

			<div className="mt-3 md:hidden">
				<Button
					color={invite?.hub ? "success" : "danger"}
					size="sm"
					variant="flat"
					className="w-full"
					onPress={buttonOnClick}
				>
					{invite?.hub ? t("hubs.invites.join") : t("hubs.invites.invalid")}
				</Button>
			</div>
		</div>
	);
};

export default InviteEmbed;
