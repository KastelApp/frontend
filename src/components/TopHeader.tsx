import React, { useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button } from "@nextui-org/react";

const TopHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems: {
        title: string;
        href: string;
        newTab: boolean;
    }[] = [
        {
            title: "Documentation",
            href: "/docs",
            newTab: false
        },
        {
            title: "Github",
            href: "https://github.com/KastelApp",
            newTab: true
        },
        {
            title: "Blog",
            href: "/blog",
            newTab: false
        },
        {
            title: "Support",
            href: "#",
            newTab: false
        }
    ];

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden text-white"
                />
                <NavbarBrand>
                    <Link className="font-bold text-inherit" href="/">Kastel</Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="/docs">
                        Documentation
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="https://github.com/KastelApp" color="foreground" target="_blank">
                        Github
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="/blog">
                        Blog
                    </Link>
                </NavbarItem>
                <NavbarItem >
                    <Link color="foreground" href="#">
                        Support
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Link href="/login">Login</Link>
                </NavbarItem>
                <NavbarItem className="hidden lg:flex">
                    <Button as={Link} color="primary" href="/register" variant="flat">
                        Sign Up
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
                        >
                            {item.title}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}

export default TopHeader;