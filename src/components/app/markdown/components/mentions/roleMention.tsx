import Mention from "./mention.tsx";
import { Text } from "@chakra-ui/react";
import { useRoleStore } from "$/utils/Stores.ts";

const hexToHsl = (hex: string, color = 0.3) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = (max + min) / 2;
    let s = (max + min) / 2;
    const l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;

        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    return `hsl(${h * 360}, ${s * 100}%, ${l * 100}%, ${color})`;
}

const RoleMention = ({
    roleId,
    onClick
}: {
    roleId: string;
    onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
}) => {
    const { getCurrentRoles } = useRoleStore();
    const roles = getCurrentRoles();

    const role = roles.find((role) => roleId === "@everyone" ? role.id === role.guildId : role.id === roleId);

    return (
        <Mention onClick={onClick} mentionBg={role ? hexToHsl(role.hexColor) : ""} hoverBg={role ? hexToHsl(role.hexColor, 0.5) : ""} noUnderline>
            <Text as="span" color={role ? role.hexColor : ""}>
                {["@everyone", "@here"].includes(roleId) ? roleId : `@${role ? role.name : roleId}`}
            </Text>
        </Mention>
    );
};

export const roleMention = {
    order: 1,
    match: (source: string) => /^<&(\d+)>|^@(everyone|here)/.exec(source),
    parse: ([main, id]: [string, string]) => ({ id: id ?? main }),
    react: ({ id }: { id: string }, _: unknown, state: { key: string }) => (
        <RoleMention roleId={id} key={state.key} />
    ),
}

export default RoleMention;