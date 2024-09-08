import PopOverData from "@/components/Popovers/PopoverData.tsx";
import cn from "@/utils/cn.ts";
import hexOpacity from "@/utils/hexOpacity.ts";
import { useMemberStore } from "@/wrapper/Stores/Members.ts";
import { useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { useRouter } from "next/router";
import { defaultRules } from "simple-markdown";

const UserMention = ({ userId }: { userId: string }) => {
	const foundUser = useUserStore((state) => state.getUser(userId));
	const router = useRouter();
	const [guildId] = router?.query?.slug as string[];
	const foundMember = useMemberStore((state) => (guildId ? state.getMember(guildId, userId) : null));
	const name = foundUser
		? `@${foundMember?.nickname ?? foundUser.globalNickname ?? foundUser.username}`
		: `<@${userId}>`;
	const roles = useRoleStore((state) => (guildId ? state.getRoles(guildId) : null)) ?? [];
	const topRole = foundMember?.roles
		.map((roleId) => roles.find((role) => role.id === roleId))
		.filter((role) => role !== undefined && role.color !== 0)
		.sort((a, b) => a!.position - b!.position)
		.reverse()[0];

	return (
		<PopOverData
			user={foundUser!}
			onlyChildren={!foundUser}
			member={
				foundMember
					? {
							...foundMember,
							roles: foundMember.roles.map((roleId) => roles.find((role) => role.id === roleId)!),
						}
					: null
			}
		>
			<span
				className={cn(
					"cursor-pointer rounded-lg p-1 font-medium hover:underline",
					!topRole && "bg-branding-300/25 text-branding-100",
				)}
				style={{
					backgroundColor: topRole ? `${hexOpacity(topRole.color.toString(16), 0.25)}` : undefined,
					color: topRole ? `#${topRole.color.toString(16)}` : undefined,
				}}
			>
				{name}
			</span>
		</PopOverData>
	);
};

export const userMention = {
	order: defaultRules.paragraph.order,
	match: (source: string) => /^<@(\d+)>/.exec(source),
	parse: ([, id]: [unknown, string]) => ({ id }),
	react: ({ id }: { id: string }, _: unknown, state: { key: string }) => <UserMention userId={id} key={state.key} />,
};

export default UserMention;
