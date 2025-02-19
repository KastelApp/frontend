import { useRouter } from "@/hooks/useRouter.ts";
import arrayify from "@/utils/arrayify.ts";
import cn from "@/utils/cn.ts";
import hexOpacity from "@/utils/hexOpacity.ts";
import { useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import SimpleMarkdown from "@kastelapp/simple-markdown";

const RoleMention = ({ roleId }: { roleId: string }) => {
	const router = useRouter();
	const [hubId] = arrayify(router.params?.slug);

	const foundRole = useRoleStore((state) => {
		const role = state.getRole(["@everyone", "@here"].includes(roleId) ? hubId : roleId);

		if (!role || role.hubId !== hubId) return null;

		return role;
	});

	const name = roleId === "@here" ? "@here" : foundRole?.name ? `@${foundRole.name}` : `<@&${roleId}>`;
	const color = foundRole?.color ? (foundRole.color === 0 ? "CFDBFF" : foundRole.color.toString(16)) : "CFDBFF";

	return (
		<span
			className={cn("rounded-lg font-medium hover:underline")}
			style={{
				backgroundColor: color ? `${hexOpacity(`#${color}`, 0.25)}` : undefined,
				color: color ? `#${color}` : undefined,
			}}
		>
			{name}
		</span>
	);
};

export const roleMention = {
	order: SimpleMarkdown.defaultRules.paragraph.order,
	match: (source: string) => /^<@&(\d+)>|^@(everyone|here)/.exec(source),
	parse: ([enh, id]: [unknown, string]) => ({ id: id ?? enh }),
	react: ({ id }: { id: string }, _: unknown, state: { key: string }) => <RoleMention roleId={id} key={state.key} />,
};

export default RoleMention;
