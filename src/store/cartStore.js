import { persistentAtom } from '@nanostores/persistent';

// Structure: { [productId_size]: { id, name, size, price, quantity, image } }
export const cartItems = persistentAtom('cartItems', {}, {
    encode: JSON.stringify,
    decode: JSON.parse
});

export function addCartItem(product, size, price, metadata = null) {
    const currentItems = cartItems.get();
    // For items with metadata, we create a unique ID to avoid merging different personalizations
    const baseId = `${product.name}-${size}`.replace(/\s+/g, '-').toLowerCase();
    const itemId = metadata ? `${baseId}-${Date.now()}` : baseId;
    
    const existingItem = currentItems[itemId];

    if (existingItem && !metadata) {
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
                metadata: metadata
            }
        });
    }
}

export function removeCartItem(itemId) {
    const currentItems = cartItems.get();
    const { [itemId]: _, ...rest } = currentItems;
    cartItems.set(rest);
}

export function decreaseCartItem(itemId) {
    const currentItems = cartItems.get();
    const existingItem = currentItems[itemId];

    if (existingItem) {
        if (existingItem.quantity > 1) {
            cartItems.set({
                ...currentItems,
                [itemId]: {
                    ...existingItem,
                    quantity: existingItem.quantity - 1,
                }
            });
        } else {
            removeCartItem(itemId);
        }
    }
}

export function clearCart() {
    cartItems.set({});
}
