import { useState } from "react";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
	Button,
} from "@nextui-org/react";
import { useIsReady, useTokenStore, useTranslationStore } from "@/wrapper/Stores.tsx";
import { Routes } from "@/utils/Routes.ts";
import Link from "@/components/Link.tsx";

const TopHeader = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { t } = useTranslationStore();
	const { token } = useTokenStore();
	const { setIsReady } = useIsReady();

	const menuItems: {
		title: string;
		href: string;
		newTab: boolean;
	}[] = [
		{
			title: t("home.navbar.docs"),
			href: "https://kastel.dev",
			newTab: true,
		},
		{
			title: "GitHub",
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
				<NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="text-white sm:hidden" />
				<NavbarBrand>
					<Link className="font-bold text-inherit" href="/">
						Kastel
					</Link>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden gap-4 sm:flex" justify="center">
				<NavbarItem>
					<Link href="https://kastel.dev" color="foreground" target="_blank">
						{t("home.navbar.docs")}
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link href="https://github.com/KastelApp" color="foreground" target="_blank">
						GitHub
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color="foreground" href="/blog" isDisabled>
						{t("home.navbar.blog")}
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color="foreground" href="#" isDisabled>
						{t("home.navbar.support")}
					</Link>
				</NavbarItem>
			</NavbarContent>
			<NavbarContent justify="end">
				{!token ? (
					<>
						<NavbarItem>
							<Link href={Routes.login()}>{t("home.navbar.login")}</Link>
						</NavbarItem>
						<NavbarItem className="hidden lg:flex">
							<Button color="primary" href={Routes.register()} variant="flat" as={Link}>
								{t("home.navbar.signup")}
							</Button>
						</NavbarItem>
					</>
				) : (
					<NavbarItem>
						<Button
							color="primary"
							href={Routes.app()}
							as={Link}
							variant="flat"
							onClick={() => {
								setIsReady(false);
							}}
						>
							{t("home.navbar.app")}
						</Button>
					</NavbarItem>
				)}
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
