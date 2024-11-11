import Logger from "@/utils/Logger.ts";
import { create } from "zustand";

export type IDType = string | number;

export interface GlobalModal {
	/**
	 * The title of the modal
	 */
	title?: React.ReactNode | null;
	/**
	 * Runs when the modal closes
	 */
	onClose?: () => void;
	/**
	 * Runs when the modal opens
	 */
	onOpen?: () => void;
	/**
	 * The body of the modal
	 */
	body?: React.ReactNode | null;
	/**
	 * The footer of the modal
	 */
	footer?: React.ReactNode | null;
	/**
	 * The priority, defaults to -1, 1 would equal somewhat important but do not care and 10 would be like "PLEASE SHOW ME IN FRONT OF EVERYTHING!!!!"
	 */
	priority?: number;
	/**
	 * Just identifies itself, do stuff like "hubChannelDescription" etc but we accept anything
	 */
	id: IDType;
	/**
	 * If its possible to close the modal (If not )
	 */
	closable?: boolean;

	/**
	 * Even if closable is false, you can still close the modal by clicking the close button
	 */
	allowCloseByButton?: boolean;

	/**
	 * Lets you hide the close button
	 */
	hideCloseButton?: boolean;

	props?: {
		modalSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
		radius?: "sm" | "md" | "lg" | "none";
		classNames?: {
			modal?: string;
			header?: string;
			body?: string;
			footer?: string;
			content?: string;
		};
	};
}

export interface GlobalModalStore {
	modalQueue: GlobalModal[];
	currentModalIndex: number;
	createModal: (options: GlobalModal) => void;
	closeModal: (id?: IDType) => void;
	setCurrentModalIndex: (index: number) => void;
}

export const modalStore = create<GlobalModalStore>((set, get) => ({
	modalQueue: [],
	closeModal: (id) => {
		const foundModal = get().modalQueue.find((modal, index) =>
			id ? modal.id === id : index === get().currentModalIndex,
		);

		if (foundModal) {
			foundModal.onClose?.();
		}

		set({
			modalQueue: get().modalQueue.filter((modal, index) => {
				if (id) {
					return modal.id !== id;
				}

				return index !== get().currentModalIndex;
			}),
		});
	},
	createModal: (options) => {
		const foundModal = get().modalQueue.find((modal) => modal.id === options.id);

		if (foundModal) {
			Logger.warn("Duplicate modal found :/", "Stores | GlobalModalStore.ts");
		}

		set({
			modalQueue: [...get().modalQueue, options],
		});
	},
	currentModalIndex: 0,
	setCurrentModalIndex: (index) => {
		set({
			currentModalIndex: index,
		});
	},
}));
