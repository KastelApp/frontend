import { useState } from "react";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
	Link,
	Button,
} from "@nextui-org/react";
import { useTranslationStore } from "@/wrapper/Stores.ts";
import NextLink from "next/link";

const TopHeader = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { t } = useTranslationStore();

	const menuItems: {
		title: string;
		href: string;
		newTab: boolean;
	}[] = [
			{
				title: t("home.navbar.docs"),
				href: "/docs",
				newTab: false,
			},
			{
				title: "Github",
				href: "https://github.com/KastelApp",
				newTab: true,
			},
			{
				title: t("home.navbar.blog"),
				href: "/blog",
				newTab: false,
			},
			{
				title: t("home.navbar.support"),
				href: "#",
				newTab: false,
			},
		];

	return (
		<Navbar onMenuOpenChange={setIsMenuOpen}>
			<NavbarContent>
				<NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden text-white" />
				<NavbarBrand>
					<Link className="font-bold text-inherit" href="/" as={NextLink}>
						Kastel
					</Link>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				<NavbarItem>
					<Link color="foreground" href="/docs" as={NextLink}>
						{t("home.navbar.docs")}
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link href="https://github.com/KastelApp" color="foreground" target="_blank" as={NextLink}>
						Github
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color="foreground" href="/blog" as={NextLink}>
						{t("home.navbar.blog")}
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color="foreground" href="#" as={NextLink}>
						{t("home.navbar.support")}
					</Link>
				</NavbarItem>
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem>
					<Link href="/login" as={NextLink}>{t("home.navbar.login")}</Link>
				</NavbarItem>
				<NavbarItem className="hidden lg:flex">
					<Button as={NextLink} color="primary" href="/register" variant="flat">
						{t("home.navbar.signup")}
					</Button>
				</NavbarItem>
			</NavbarContent>
			<NavbarMenu>
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item}-${index}`}>
						<Link
							color={"foreground"}
							className="w-full"
							href={item.href}
							size="lg"
							target={item.newTab ? "_blank" : "_self"}
							as={NextLink}
						>
							{item.title}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
};

export default TopHeader;
