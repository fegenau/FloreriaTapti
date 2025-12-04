const fs = require('fs');
const path = require('path');

const rawData = fs.readFileSync(path.join(__dirname, '../data/raw_catalog.txt'), 'utf-8');
const lines = rawData.split('\n').filter(line => line.trim() !== '');

const products = [];

// Skip headers (first 2 lines)
for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    // Split by tab or multiple spaces
    const parts = line.split(/\t+/).map(p => p.trim());

    if (parts.length < 2) continue;

    const name = parts[0];
    const basePrice = parseInt(parts[1].replace(/\./g, '')) || 0;

    // Extract variants (S, M, L, XL)
    // The columns seem to be: Name, Cost, S_Count, S_Price, M_Count, M_Price, L_Count, L_Price...
    // Let's try to extract non-zero pairs

    const variants = [];
    let colIndex = 2;
    const sizes = ['S', 'M', 'L', 'XL'];

    // This is a heuristic based on the visual structure. 
    // We'll look for pairs of numbers.

    while (colIndex < parts.length - 1) {
        const count = parseInt(parts[colIndex]);
        const price = parseInt(parts[colIndex + 1].replace(/\./g, ''));

        if (count > 0 && price > 0) {
            // Determine size based on index? It's hard because of the sparse matrix.
            // But usually it goes S, M, L.
            // Let's just add them as variants for now.
            let sizeLabel = 'Estándar';
            if (variants.length === 0) sizeLabel = 'S';
            else if (variants.length === 1) sizeLabel = 'M';
            else if (variants.length === 2) sizeLabel = 'L';
            else if (variants.length === 3) sizeLabel = 'XL';

            variants.push({
                size: sizeLabel,
                count: count,
                price: price
            });
        }
        colIndex += 2;
    }

    if (variants.length > 0) {
        products.push({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            basePrice: basePrice,
            variants: variants,
            category: 'Flores' // Default category
        });
    }
}

const outputPath = path.join(__dirname, '../data/catalog.json');
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
console.log(`Parsed ${products.length} products to ${outputPath}`);
