import cn from "@/utils/cn.ts";
import hexOpacity from "@/utils/hexOpacity.ts";
import { useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import { useRouter } from "next/router";
import { defaultRules } from "simple-markdown";

const RoleMention = ({ roleId }: { roleId: string }) => {
    const router = useRouter();
	const [guildId] = router?.query?.slug as string[];

    const foundRole = useRoleStore((state) => {
        const role = state.getRole(["@everyone", "@here"].includes(roleId) ? guildId : roleId);

        if (!role || role.guildId !== guildId) return null;

        return role;
    });

    const name = foundRole?.name ? `@${foundRole.name}` : `<@&${roleId}>`;
    const color = foundRole?.color ? foundRole.color === 0 ? "CFDBFF" : foundRole.color.toString(16) : "CFDBFF"

    return (
        <span
				className={cn(
					"rounded-lg p-1 font-medium hover:underline",
				)}
				style={{
					backgroundColor: color ? `${hexOpacity(`#${color}`, 0.25)}` : undefined,
					color: color ? `#${color}` : undefined,
				}}
			>
				{name}
			</span>
    )
};

export const roleMention = {
	order: defaultRules.paragraph.order,
    match: (source: string) => /^<@&(\d+)>|^@(everyone|here)$/.exec(source),
	parse: ([enh, id]: [unknown, string]) => ({ id: id ?? enh }),
	react: ({ id }: { id: string }, _: unknown, state: { key: string }) => (
		<RoleMention roleId={id} key={state.key} />
	),
};

export default RoleMention;
