import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GuestUserInterface {
	email: string;
	phoneNumber: string;
	whatsappNumber: string;
	firstName: string;
	lastName: string;
	state: string;
	lga: string;
	city: string;
	streetAddress: string;
}

interface Store {
	guestUserInfo: GuestUserInterface;
	setGuestUserInfo: (guestUserInfo: Partial<GuestUserInterface>) => void;
	clearGuestUserStore: () => void;
}

export const useGuestUserInfoStore = create<Store>()(
	persist(
		(set, get) => ({
			guestUserInfo: {
				email: "",
				phoneNumber: "",
				whatsappNumber: "",
				firstName: "",
				lastName: "",
				state: "",
				city: "",
				lga: "",
				streetAddress: "",
			},
			setGuestUserInfo: (guestUserInfo) =>
				set((state) => ({
					guestUserInfo: {
						...state.guestUserInfo,
						...guestUserInfo,
					},
				})),

			clearGuestUserStore: () =>
				set(() => ({
					guestUserInfo: {
						email: "",
						phoneNumber: "",
						whatsappNumber: "",
						firstName: "",
						lastName: "",
						state: "",
						city: "",
						lga: "",
						streetAddress: "",
					},
				})),
		}),
		{
			name: "guestUser-info-storage",
			version: 1,
			migrate: (persistedState: any, version) => {
				// Handle migrations here if needed
				return persistedState;
			},
		}
	)
);
