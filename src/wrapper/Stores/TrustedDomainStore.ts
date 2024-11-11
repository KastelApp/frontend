import Logger from "@/utils/Logger.ts";
import { useAPIStore } from "../Stores.tsx";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import safePromise from "@/utils/safePromise.ts";

export interface TrustedDomainsStore {
	trustedDomains: string[];
	hashedPhishingDomains: string[];
	fetchPhishingDomains: () => Promise<void>;
	setTrustedDomains: (trustedDomains: string[]) => void;
	isTrusted: (url: string) => boolean;
	addTrustedDomain: (url: string) => void;
	isPhishingDomain: (url: string) => boolean;
}

export const useTrustedDomainStore = create(
	persist<TrustedDomainsStore>(
		(set, get) => ({
			trustedDomains: [],
			hashedPhishingDomains: [],
			fetchPhishingDomains: async () => {
				const api = useAPIStore.getState().api;

				if (!api) {
					Logger.warn("API not ready", "Stores | TrustedDomainsStore.ts");

					return;
				}

				const [fetched, error] = await safePromise(api.get<unknown, string[]>("/phishing"));

				if (error || !fetched) {
					Logger.error("Failed to fetch phishing domains.. This may be bad", "Stores | TrustedDomainsStore.ts");

					return;
				}

				set({
					hashedPhishingDomains: fetched.body,
				});
			},
			isPhishingDomain: () => {
				// const domain = url.replace(/https?:\/\//, "").replace(/\/.*/, "");

				// todo: better way of doing this (its temp)
				return false;
				// return get().hashedPhishingDomains.includes(crypto.createHash("sha512").update(domain).digest("hex"));
			},
			setTrustedDomains: (trustedDomains: string[]) => set({ trustedDomains }),
			isTrusted: (url: string) => {
				// ? we accept https://domain.com, http://domain.com, domain.com
				const domain = url.replace(/https?:\/\//, "").replace(/\/.*/, "");

				if (domain === "localhost") return true;

				return get().trustedDomains.includes(domain);
			},
			addTrustedDomain: (url: string) => {
				const domain = url.replace(/https?:\/\//, "").replace(/\/.*/, "");

				set((state) => ({
					trustedDomains: [...state.trustedDomains, domain],
				}));
			},
		}),
		{
			name: "trusted-domains",
			partialize: (state) =>
				Object.fromEntries(
					Object.entries(state).filter(([key]) => key === "trustedDomains"),
				) as unknown as TrustedDomainsStore,
		},
	),
);
