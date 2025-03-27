import { CartProduct } from "@/src/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
	AddressType,
	PriceVariantType,
	ProductWithExtra,
	VariantType,
} from "../db/schema";

// Helper function to convert ProductWithExtra to CartProduct
const convertToCartProduct = (product: ProductWithExtra): CartProduct => {
	return {
		...product,
		media: product.medias, // Assuming the media field needs to be renamed
		variants: product.variants.map((variant) => ({
			...variant,
			variantPrices: variant.variantPrices, // Map as required
		})),
	};
};
export interface CartItem {
	item: CartProduct;
	variant: VariantType;
	size: PriceVariantType;
	quantity: number;
}

interface Store {
	cartItems: CartItem[];
	totalQuantity: number;
	totalPrice: number;
	total: number;
	paymentType: string;
	shippingFee: number | 0;
	selectedAddress: AddressType | null;
	getItems: () => CartItem[];
	addItem: (
		item: ProductWithExtra,
		variant: VariantType,
		size: PriceVariantType,
		quantity?: number
	) => void;
	removeItem: (idToRemove: string, variantId: string, sizeId: string) => void;
	updateQuantity: (
		id: string,
		variantId: string,
		sizeId: string,
		newQuantity: number
	) => void;
	clearCart: () => void;
	setShippingFee: (fee: number) => void;
	setPaymentType: (type: string) => void;
	setSelectedAddress: (selectedAddress: AddressType | null) => void;
}

const calculateTotal = (cartItems: CartItem[], shippingFee: number) => {
	const itemsTotal = cartItems.reduce((total, { size, quantity }) => {
		const price = size.discountPrice
			? Number(size.discountPrice)
			: Number(size.price);
		return total + price * quantity;
	}, 0);
	return {
		total: itemsTotal,
		totalPrice: itemsTotal + shippingFee,
		totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
	};
};

const useCartStore = create<Store>()(
	persist(
		(set, get) => ({
			cartItems: [],
			totalQuantity: 0,
			totalPrice: 0,
			total: 0,
			shippingFee: 0,
			paymentType: "",
			selectedAddress: null,
			getItems: () => get().cartItems,
			addItem: (item, variant, size, quantity = 1) => {
				const currentItems = get().cartItems;
				const cartProduct = convertToCartProduct(item);

				const existingItemIndex = currentItems.findIndex(
					(cartItem) =>
						cartItem.item.id === item.id &&
						cartItem.variant.id === variant.id &&
						cartItem.size.id === size.id
				);

				let newCartItems;
				if (existingItemIndex >= 0) {
					// Update existing item's quantity
					newCartItems = currentItems.map((cartItem, index) =>
						index === existingItemIndex
							? { ...cartItem, quantity: quantity }
							: cartItem
					);
				} else {
					// Add new item with its own variant/size
					newCartItems = [
						...currentItems,
						{ item: cartProduct, variant, size, quantity },
					];
				}

				const { totalPrice, total, totalQuantity } = calculateTotal(
					newCartItems,
					get().shippingFee
				);
				set({ cartItems: newCartItems, total, totalPrice, totalQuantity });
			},
			removeItem: (idToRemove, variantId, sizeId) => {
				const newCartItems = get().cartItems.filter(
					(cartItem) =>
						!(
							cartItem.item.id === idToRemove &&
							cartItem.variant.id === variantId &&
							cartItem.size.id === sizeId
						)
				);
				const { total, totalPrice, totalQuantity } = calculateTotal(
					newCartItems,
					get().shippingFee
				);
				set({ cartItems: newCartItems, total, totalPrice, totalQuantity });
			},
			updateQuantity: (id, variantId, sizeId, newQuantity) => {
				if (newQuantity < 1) return;

				const newCartItems = get().cartItems.map((cartItem) =>
					cartItem.item.id === id &&
					cartItem.variant.id === variantId &&
					cartItem.size.id === sizeId
						? { ...cartItem, quantity: newQuantity }
						: cartItem
				);

				const { total, totalPrice, totalQuantity } = calculateTotal(
					newCartItems,
					get().shippingFee
				);
				set({ cartItems: newCartItems, total, totalPrice, totalQuantity });
			},
			clearCart: () =>
				set({
					cartItems: [],
					total: 0,
					totalPrice: 0,
					totalQuantity: 0,
					shippingFee: 0,
				}),
			setSelectedAddress: (address: AddressType | null) =>
				set((state) => ({ ...state, selectedAddress: address })),
			setPaymentType: (type) =>
				set((state) => ({ ...state, paymentType: type })),
			setShippingFee: (fee) => {
				const { total, totalPrice, totalQuantity } = calculateTotal(
					get().cartItems,
					fee
				);
				set({ shippingFee: fee, total, totalPrice, totalQuantity });
			},
		}),
		{
			name: "goodshirts-cart-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

export default useCartStore;
