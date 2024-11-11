import { useRouter } from "@/hooks/useRouter.ts";
import { Link as ReactLink, LinkProps as ReactLinkProps } from "react-router-dom"
import { Link as NextUiLink, LinkProps as NextUiLinkProps } from "@nextui-org/react";

const NavigationLink = ({
    href,
    ...other
}: Omit<ReactLinkProps, "to"> & { href: string }) => {
    const router = useRouter();

    return (
        <ReactLink
            to={href}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (href) router.push(href);
            }}
            {...other}
        />
    )
}

const Link = (props: NextUiLinkProps) => {
    return <NextUiLink {...props} as={NavigationLink} />
}

export default Link;

export {
    NavigationLink,
    Link
}