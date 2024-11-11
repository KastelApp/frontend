import { useAPIStore, useClientStore, useIsReady, useStoredSettingsStore, useTokenStore } from "@/wrapper/Stores.tsx";
import { useEffect } from "react";
import Loading from "./Loading.tsx";
import { useRelationshipsStore, Relationship as RelationshipState } from "@/wrapper/Stores/RelationshipsStore.ts";
import Logger from "@/utils/Logger.ts";
import { Relationship } from "@/types/http/user/relationships.ts";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { Button } from "@nextui-org/react";
import ModalQueue from "@/components/Modals/ModalQueue.tsx";
import { WebSocketErrorCodes } from "@/data/constants.ts";
import Client from "@/wrapper/Client.ts";
import { Routes } from "@/utils/Routes.ts";
import { useRouter } from "@/hooks/useRouter.ts";

const Init = ({
	children,
}: {
	children?: React.ReactNode;
	shouldHaveLayout?: boolean;
}) => {
	const { token, setToken } = useTokenStore();
	const { client, setClient } = useClientStore();
	const { api } = useAPIStore();
	const router = useRouter();
	const { setIsReady, isReady } = useIsReady();
	const { addRelationship } = useRelationshipsStore();
	const { channels } = usePerChannelStore();
	const { mobilePopupIgnored, setMobilePopupIgnored, isMobile } = useStoredSettingsStore();
	const currentUser = useUserStore((s) => s.getCurrentUser());

	useEffect(() => {
		// eslint-disable-next-line react-compiler/react-compiler -- This is fine only because its a class.
		api.token = token;

		setIsReady(false);
	}, [token]);

	const whitelistedPaths: (string | RegExp)[] = [/^\/app(\/.*)?/];
	const blacklistedTokenPaths: (string | RegExp)[] = ["/login", "/register"];

	useEffect(() => {
		// @ts-expect-error -- For now exposing the forceReady to global so I can mess with stuff
		globalThis.forceReady = () => setIsReady(true);
	}, []);

	useEffect(() => {
		const int = setInterval(() => {
			// ? we go thru all channels if they have a typing user, we check if the time is greater than 7 seconds, if so we remove them
			for (const [channelId, channel] of Object.entries(channels)) {
				if (
					!channel.typingUsers ||
					channel.typingUsers.length === 0 ||
					!channel.typingUsers.some((user) => Date.now() - user.started > 7000)
				)
					continue;

				channel.typingUsers = channel.typingUsers.filter((user) => Date.now() - user.started < 7000);

				usePerChannelStore.getState().updateChannel(channelId, {
					typingUsers: channel.typingUsers,
				});
			}
		}, 1000);

		return () => clearInterval(int);
	}, [channels]);

	useEffect(() => {
		console.log(router.pathname);
		if (blacklistedTokenPaths.some((path) => router.pathname.match(path) || path === router.pathname) && token) {
			router.push(Routes.app());

			setIsReady(false);

			return;
		}

		if (!whitelistedPaths.some((path) => router.pathname.match(path) || path === router.pathname)) {
			setIsReady(true);

			return;
		}

		if (!token) {
			router.push(Routes.login());

			return;
		}

		if (client.isConnected) {
			if (!isReady) setIsReady(true);

			return; // ? This is to prevent an infinite loop
		}

		setIsReady(false);

		client.connect(token);

		client.on("ready", async () => {
			// @ts-expect-error -- For now exposing the api to global so I can mess with stuff
			globalThis.api = api;

			const relationships = await api.get<unknown, Relationship[]>({
				url: "/users/@me/relationships?includeUser=true",
			});

			// ? continues in the background (since its a HUGE payload)
			// useTrustedDomainStore.getState().fetchPhishingDomains();

			// ? If it fails we just set is ready to true and log out the failure
			if (!relationships || relationships.status !== 200) {
				Logger.error("Failed to fetch relationships", "Init | ready event");

				setIsReady(true);

				return;
			}

			if (!Array.isArray(relationships.body)) {
				setIsReady(true);

				return;
			}

			for (const relationship of relationships.body || []) {
				if (relationship.user) {
					useUserStore.getState().addUser(relationship.user);

					relationship.userId = relationship.user.id;

					delete relationship.user;
				}

				addRelationship(relationship as RelationshipState);
			}

			setIsReady(true);
		});

		client.on("close", (code) => {
			setIsReady(false);

			client.isConnected = false;

			if (code === WebSocketErrorCodes.InvalidToken) {
				setToken(null);

				client.websocket?.stopReconnect();
				
				setClient(new Client());

				router.push(Routes.login());
			}
		});

	}, [router.pathname]);

	if (router.pathname.startsWith("/app") && !currentUser) {
		return <Loading />;
	}

	return (
		<>
			{isMobile && !mobilePopupIgnored && (
				<div className="fixed bottom-0 left-0 right-0 z-[5000] flex flex-col items-center justify-between bg-black bg-opacity-50 p-2">
					<p className="text-white">
						You're on a mobile device, this site is not optimized for mobile yet. Please use a desktop device or
						download our mobile app.
					</p>
					<Button size="sm" variant="bordered" color="primary" onPress={() => setMobilePopupIgnored(true)}>
						I understand
					</Button>
				</div>
			)}
			{!isReady ? <Loading /> : children}
			<ModalQueue />
		</>
	);
};

export default Init;
