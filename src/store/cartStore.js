import { persistentAtom } from '@nanostores/persistent';

// Structure: { [productId_size]: { id, name, size, price, quantity, image } }
export const cartItems = persistentAtom('cartItems', {}, {
    encode: JSON.stringify,
    decode: JSON.parse
});

export function addCartItem(product, size, price) {
    const currentItems = cartItems.get();
    const itemId = `${product.name}-${size}`.replace(/\s+/g, '-').toLowerCase();
    const existingItem = currentItems[itemId];

    if (existingItem) {
        cartItems.set({
            ...currentItems,
            [itemId]: {
                ...existingItem,
                quantity: existingItem.quantity + 1,
            }
        });
    } else {
        cartItems.set({
            ...currentItems,
            [itemId]: {
                id: itemId,
                name: product.name,
                size: size,
                price: price,
                quantity: 1,
                image: product.image ? product.image[0] : null,
            }
        });
    }
}

export function removeCartItem(itemId) {
    const currentItems = cartItems.get();
    const { [itemId]: _, ...rest } = currentItems;
    cartItems.set(rest);
}

export function clearCart() {
    cartItems.set({});
}
