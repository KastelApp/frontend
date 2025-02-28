import PopOverData from "@/components/Popovers/PopoverData.tsx";
import { useRouter } from "@/hooks/useRouter.ts";
import arrayify from "@/utils/arrayify.ts";
import cn from "@/utils/cn.ts";
import hexOpacity from "@/utils/hexOpacity.ts";
import { useMemberStore } from "@/wrapper/Stores/Members.ts";
import { useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import SimpleMarkdown from "@kastelapp/simple-markdown";

const UserMention = ({ userId }: { userId: string }) => {
	const foundUser = useUserStore((state) => state.getUser(userId));
	const router = useRouter();
	const [hubId] = arrayify(router.params?.slug);
	const foundMember = useMemberStore((state) => (hubId ? state.getMember(hubId, userId) : null));
	const name = foundUser
		? `@${foundMember?.nickname ?? foundUser.globalNickname ?? foundUser.username}`
		: `<@${userId}>`;
	const roles = useRoleStore((state) => (hubId ? state.getRoles(hubId) : null)) ?? [];
	const topRole = foundMember?.roles
		.map((roleId) => roles.find((role) => role.id === roleId))
		.filter((role) => role !== undefined && role.color !== 0)
		.sort((a, b) => a!.position - b!.position)
		.reverse()[0];

	const color = topRole?.color ? (topRole.color === 0 ? "CFDBFF" : topRole.color.toString(16)) : "CFDBFF";

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
				className={cn("cursor-pointer rounded-lg font-medium hover:underline")}
				style={{
					backgroundColor: color ? `${hexOpacity(`#${color}`, 0.25)}` : undefined,
					color: color ? `#${color}` : undefined,
				}}
			>
				{name}
			</span>
		</PopOverData>
	);
};

export const userMention = {
	order: SimpleMarkdown.defaultRules.paragraph.order,
	match: (source: string) => /^<@!?(\d+)>/.exec(source),
	parse: ([, id]: [unknown, string]) => ({ id }),
	react: ({ id }: { id: string }, _: unknown, state: { key: string }) => <UserMention userId={id} key={state.key} />,
};

export default UserMention;
