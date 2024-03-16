import { ElementType } from "react";

interface SidebarData {
  name: string;
  options: {
    name: string;
    badges: {
      name: string;
      color: string;
    }[];
    id: number;
    icon: ElementType | null;
  }[];
}

const data: SidebarData[] = [
  {
    name: "Profile",
    options: [
      { name: "My Profile", badges: [], id: 0, icon: null },
      {
        name: "Invites",
        badges: [{ name: "Beta", color: "#4F2D7C" }],
        id: 9,
        icon: null,
      },
      { name: "Privacy & Safety", badges: [], id: 1, icon: null },
      {
        name: "Sessions",
        badges: [{ name: "Beta", color: "#4F2D7C" }],
        id: 2,
        icon: null,
      },
    ],
  },
  {
    name: "General Settings",
    options: [
      { name: "Appearance", badges: [], id: 3, icon: null },
      { name: "Accessibility", badges: [], id: 4, icon: null },
      { name: "Text & Language", badges: [], id: 5, icon: null },
    ],
  },
  {
    name: "Billing",
    options: [
      { name: "Subscriptions", badges: [], id: 6, icon: null },
      { name: "Shards", badges: [], id: 7, icon: null },
      { name: "Details & History", badges: [], id: 8, icon: null },
    ],
  },
];

export { type SidebarData, data };

export default data;
