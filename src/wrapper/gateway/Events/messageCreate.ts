import { MessageCreatePayload } from "@/types/payloads/events/messageCreate.ts";
import getInviteCodes from "@/utils/getInviteCodes.ts";
import Logger from "@/utils/Logger.ts";
import playSound from "@/utils/soundPlayer.ts";
import Websocket from "@/wrapper/gateway/Websocket.ts";
import { useChannelStore, usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useInviteStore } from "@/wrapper/Stores/InviteStore.ts";
import { useMemberStore } from "@/wrapper/Stores/Members.ts";
import { MessageContext, MessageStates, useMessageStore } from "@/wrapper/Stores/MessageStore.ts";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";

const isMessageCreate = (payload: unknown): payload is MessageCreatePayload => {
	if (payload === null || typeof payload !== "object") return false;

	if (!("channelId" in payload)) return false;
	if (!("content" in payload)) return false;

	return true;
};

const messageCreate = async (ws: Websocket, payload: unknown) => {
	if (!isMessageCreate(payload)) {
		Logger.warn("Invalid Message Create Payload", "Wrapper | WebSocket");

		return;
	}

	const invites = getInviteCodes(payload.content);
	const discordInvites = getInviteCodes(payload.content, true);

	await useUserStore.getState().fetchUser(payload.author.id);

	if (payload.replyingTo && "author" in payload.replyingTo) {
		await useUserStore.getState().fetchUser(payload.replyingTo.author.id);
	}

	const currentMemberId = useUserStore.getState().getCurrentUser()?.id;
	const perChannel = usePerChannelStore.getState().getChannel(payload.channelId);
	const hubId = useChannelStore.getState().getHubId(payload.channelId);
	const member = hubId ? useMemberStore.getState().getMember(hubId, payload.author.id) : null;

	if (payload.mentions.users.includes(currentMemberId ?? "")) {
		playSound("mention", 0.5);
	} else if (payload.mentions.roles.length > 0 && member?.roles.some((role) => payload.mentions.roles.includes(role))) {
		playSound("mention", 0.5);
	}

	if (perChannel) {
		const typingUsers = perChannel.typingUsers.filter((user) => user.id !== payload.author.id);

		usePerChannelStore.getState().updateChannel(payload.channelId, {
			typingUsers,
			lastTypingSent: 0,
			typingStarted: 0,
			lastTyped: 0,
		});
	}

	useChannelStore.getState().editChannel(payload.channelId, {
		lastMessageId: payload.id,
	});

	for (const invite of invites) {
		useInviteStore.getState().fetchInvite(invite);
	}

	useMessageStore.getState().addMessage(
		{
			id: payload.id,
			authorId: payload.author.id,
			embeds: payload.embeds,
			content: payload.content,
			creationDate: new Date(payload.creationDate),
			editedDate: payload.editedDate ? new Date(payload.editedDate) : null,
			nonce: payload.nonce,
			replyingTo: payload.replyingTo
				? "messageId" in payload.replyingTo
					? payload.replyingTo.messageId
					: "id" in payload.replyingTo
						? payload.replyingTo.id
						: null
				: null,
			attachments: payload.attachments,
			flags: payload.flags,
			allowedMentions: payload.allowedMentions,
			mentions: payload.mentions,
			channelId: payload.channelId,
			deletable: payload.deletable,
			invites,
			discordInvites,
			pinned: payload.pinned,
			state: MessageStates.Sent,
			context: MessageContext.Gateway,
		},
		true,
	);
};

export default messageCreate;
