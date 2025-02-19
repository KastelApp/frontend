import safeParse from "@/utils/safeParse.ts";
import Websocket from "./Websocket.ts";
import { EventPayload } from "@/types/payloads/event.ts";
import Logger from "@/utils/Logger.ts";
import Constants, { opCodes } from "@/data/constants.ts";
import { HelloPayload } from "@/types/payloads/hello.ts";
import event from "./Events/Event.ts";
import { EmojiPack, NavBarLocation, ReadyPayload, Theme } from "@/types/payloads/ready.ts";
import { useUserStore } from "../Stores/UserStore.ts";
import { useHubStore } from "../Stores/HubStore.ts";
import { useChannelStore } from "../Stores/ChannelStore.ts";
import { useMemberStore } from "../Stores/Members.ts";
import { useRoleStore } from "../Stores/RoleStore.ts";
import { useSettingsStore } from "@/wrapper/Stores.tsx";
import FlagFields from "@/utils/FlagFields.ts";

const handleMessage = async (ws: Websocket, data: unknown) => {
	const decompressed = safeParse<EventPayload>(await ws.decompress(data));

	if (!decompressed) {
		Logger.warn("Failed to decompress message", "Gateway | HandleMessage");

		console.log(data);

		return;
	}

	if (import.meta.env.MODE === "development") {
		Logger.info("Received Payload", "Gateway | HandleMessage");

		console.log(typeof decompressed === "string" ? JSON.parse(decompressed) : decompressed);
	}

	if (decompressed.seq && decompressed.seq > ws.sequence) ws.sequence = decompressed.seq;

	switch (decompressed.op) {
		case opCodes.hello: {
			const data = decompressed.data as HelloPayload;

			ws.heartbeatInterval = data.heartbeatInterval;
			ws.sessionId = data.sessionId;

			// ? This will be at some point for statistics, though for now its pretty pointless
			const os = navigator.userAgent.includes("Windows")
				? "Windows"
				: navigator.userAgent.includes("Mac")
					? "Mac"
					: navigator.userAgent.includes("Linux")
						? "Linux"
						: navigator.userAgent.includes("Android") || navigator.userAgent.includes("iPhone")
							? "Mobile"
							: "Unknown";

			ws.send({
				op: opCodes.identify,
				data: {
					token: ws.token,
					meta: {
						client: "wrapper",
						os,
						// ? This will always be browser until we start releasing the desktop app / mobile app.
						device: "browser",
					},
				},
			});

			break;
		}

		case opCodes.ready: {
			Logger.info("Received Ready Payload", "Gateway | HandleMessage");

			const data = decompressed.data as ReadyPayload;

			ws.sessionWorker.postMessage({
				op: 1,
				data: {
					interval: ws.heartbeatInterval - ws.heartbeatInterval * 0.1,
					session: ws.sessionId,
				},
			});

			useUserStore.getState().addUser({
				...data.user,
				isClient: true,
			});

			useUserStore.getState().addUser({
				username: "Kiki",
				defaultAvatar: "/icon.png",
				isSystem: true,
				tag: "0000",
				publicFlags: String(Constants.publicFlags.StaffBadge),
				flags: String(Constants.privateFlags.System),
				id: Constants.fakeUserIds.kiki,
				bio: "Thanks for using Kastel! I'm Kiki, the tiny assistant that does stuff in the background for you!",
			});

			useUserStore.getState().addUser({
				username: "Ghost",
				defaultAvatar: "/icon.png",
				isSystem: false,
				tag: "0000",
				publicFlags: String(Constants.publicFlags.GhostBadge),
				flags: String(Constants.privateFlags.Ghost),
				id: Constants.fakeUserIds.ghost,
				bio: "Boo! 👻 did I scare you?",
				isGhost: true,
			});

			for (const hub of data.hubs) {
				useHubStore.getState().addHub({
					name: hub.name,
					unavailable: hub.unavailable,
					ownerId: hub.owner.id,
					maxMembers: hub.maxMembers,
					id: hub.id,
					icon: hub.icon,
					flags: hub.flags,
					features: hub.features,
					description: hub.description,
					coOwners: hub.coOwners.map((coOwner) => coOwner.id),
					channelProperties: hub.channelProperties,
					memberCount: hub.memberCount,
				});

				for (const channel of hub.channels) {
					useChannelStore.getState().addChannel({
						...channel,
						hubId: hub.id,
					});
				}

				for (const member of hub.members) {
					useMemberStore.getState().addMember({
						...member,
						hubId: hub.id,
						joinedAt: new Date(member.joinedAt),
						userId: member.user.id,
						nickname: member.nickname || null,
						status: "online",
					});

					const flagFields = new FlagFields(member.user.flags, "0");

					useUserStore.getState().addUser({
						username: member.user.username,
						id: member.user.id,
						flags: member.user.flags,
						publicFlags: member.user.publicFlags,
						avatar: member.user.avatar,
						tag: member.user.tag,
						isBot: flagFields.has("Bot"),
						isSystem: flagFields.has("System"),
						isGhost: flagFields.has("Ghost"),
					});
				}

				for (const role of hub.roles) {
					useRoleStore.getState().addRole({
						...role,
						hubId: hub.id,
						hoisted: role.hoist,
					});
				}
			}

			// useSettingsStore.setState((state) => {
			useSettingsStore.getState().setEmojiPack(data.settings.emojiPack as EmojiPack);
			useSettingsStore.getState().setLanguage(data.settings.language);
			useSettingsStore.getState().setHubOrder(data.settings.hubOrder);
			useSettingsStore.getState().setPrivacy(data.settings.privacy);
			useSettingsStore.getState().setTheme(data.settings.theme as Theme);
			useSettingsStore.getState().setNavBarLocation(data.settings.navBarLocation as NavBarLocation);

			// return state;
			// })

			setTimeout(() => ws.emit("ready"), 500);

			break;
		}

		case opCodes.heartbeatAck: {
			ws.lastHeartbeatAck = Date.now();

			Logger.info(`Heartbeat Acknowledged, current ping: ${ws.ping}ms`, "Gateway | HandleMessage");

			break;
		}

		case opCodes.event: {
			event(ws, decompressed);

			break;
		}
	}
};

export default handleMessage;
