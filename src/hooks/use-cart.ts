import { create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import { CartProduct } from "@/types";

export interface CartItem {
	item: CartProduct;
	quantity: number;
}

interface Store {
	cartItems: CartItem[];
	total: number;
	totalPrice: number;
	shippingFee: number;
	addItem: (item: CartItem) => void;
	removeItem: (idToRemove: string) => void;
	increaseQuantity: (idToIncrease: string) => void;
	decreaseQuantity: (idToDecrease: string) => void;
	clearCart: () => void;
	setShippingFee: (fee: number) => void;
}

const calculateTotalPrice = (
	cartItems: CartItem[],
	shippingFee: number
): number => {
	const itemsTotal = cartItems.reduce((total, { item, quantity }) => {
		const itemPrice = item.price !== null ? Number(item.price) * quantity : 0;

		return total + itemPrice;
	}, 0);

	return itemsTotal + shippingFee;
};

const calculateTotal = (cartItems: CartItem[]): number => {
	return cartItems.reduce((total, { item, quantity }) => {
		const itemPrice = item.price !== null ? Number(item.price) * quantity : 0;

		return total + itemPrice;
	}, 0);
};
const isBrowser = typeof window !== "undefined";

const storage = isBrowser ? createJSONStorage(() => localStorage) : null;

const useCartStore = create<Store>()(
	persist(
		(set, get) => ({
			cartItems: [],
			addons: [],
			selectedAddons: null,
			total: 0,
			totalPrice: 0,
			shippingFee: 0,
			addItem: (data: CartItem) => {
				const { item, quantity } = data;
				const currentItems = get().cartItems;
				const isExisting = currentItems.find(
					(cartItem) => cartItem.item.id === item.id
				);

				if (isExisting) {
					return { description: "Item already in cart" };
				}

				const newCartItems = [...currentItems, { item, quantity }];
				const newTotalPrice = calculateTotalPrice(
					newCartItems,
					get().shippingFee
				);
				const newTotal = calculateTotal(newCartItems);

				set({
					cartItems: newCartItems,
					total: newTotal,
					totalPrice: newTotalPrice,
					shippingFee: get().shippingFee,
				});
				return { description: "Item added to cart" };
			},
			removeItem: (idToRemove: string) => {
				const newCartItems = get().cartItems.filter(
					(cartItem) => cartItem.item.id !== idToRemove
				);
				const newTotalPrice = calculateTotalPrice(
					newCartItems,
					get().shippingFee
				);
				const newTotal = calculateTotal(newCartItems);

				set({
					cartItems: newCartItems,
					total: newTotal,
					totalPrice: newTotalPrice,
					shippingFee: get().shippingFee,
				});
				return { description: "Item removed from cart" };
			},
			increaseQuantity: (idToIncrease: string) => {
				const newCartItems = get().cartItems.map((cartItem) =>
					cartItem.item.id === idToIncrease
						? { ...cartItem, quantity: cartItem.quantity + 1 }
						: cartItem
				);
				const newTotalPrice = calculateTotalPrice(
					newCartItems,
					get().shippingFee
				);
				const newTotal = calculateTotal(newCartItems);

				set({
					cartItems: newCartItems,
					total: newTotal,
					totalPrice: newTotalPrice,
					shippingFee: get().shippingFee,
				});
				return { description: "Item quantity increased" };
			},
			decreaseQuantity: (idToDecrease: string) => {
				const newCartItems = get().cartItems.map((cartItem) =>
					cartItem.item.id === idToDecrease
						? { ...cartItem, quantity: cartItem.quantity - 1 }
						: cartItem
				);
				const newTotalPrice = calculateTotalPrice(
					newCartItems,
					get().shippingFee
				);
				const newTotal = calculateTotal(newCartItems);

				set({
					cartItems: newCartItems,
					total: newTotal,
					totalPrice: newTotalPrice,
					shippingFee: get().shippingFee,
				});
				return { description: "Item quantity decreased" };
			},
			clearCart: () =>
				set({
					cartItems: [],
					total: 0,
					totalPrice: 0,
					shippingFee: 0,
				}),

			setShippingFee: (fee: number) => {
				const newTotal = calculateTotal(get().cartItems);
				const newTotalPrice = calculateTotalPrice(get().cartItems, fee);
				set((state) => ({
					...state,
					shippingFee: fee,
					total: newTotal,
					totalPrice: newTotalPrice,
				}));
			},
		}),
		{
			name: "harmony-cart-storage",
			storage: storage,
		} as PersistOptions<Store>
	)
);

export default useCartStore;
