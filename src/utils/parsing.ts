export interface OrderItem {
  category: string;
  size: string;
  quantity: number;
}

export const parseOrderData = (text: string): OrderItem[] => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const items: OrderItem[] = [];
  
  if (lines.length === 0) return items;

  let currentCategory = 'Product';
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;
    
    // Check if this line is a category header (contains no size-quantity pairs)
    const hasItemPattern = /(?:(?:Mens?|Womens?|Ladies?|Girls?|Boys?)\s+)?(?:XS|S|M|L|XL|XXL|2XL|3XL|Small|Medium|Large|Extra\s*Small|Extra\s*Large|\d+X)\s*[-–]\s*\d+/i;
    
    if (!hasItemPattern.test(trimmedLine)) {
      // This is likely a category name
      currentCategory = trimmedLine.charAt(0).toUpperCase() + trimmedLine.slice(1).toLowerCase();
      return;
    }
    
    // Parse individual items from the line
    // Handle formats like: "Small-10", "Mens 3X-2", "Womens Medium-5", "Medium-15"
    const itemPattern = /(?:(Mens?|Womens?|Ladies?|Girls?|Boys?)\s+)?(XS|S|M|L|XL|XXL|2XL|3XL|Small|Medium|Large|Extra\s*Small|Extra\s*Large|\d+X)\s*[-–]\s*(\d+)/gi;
    
    let match;
    while ((match = itemPattern.exec(trimmedLine)) !== null) {
      const gender = match[1] || ''; // Optional gender prefix
      const size = match[2];
      const quantity = parseInt(match[3], 10);
      
      if (quantity > 0) {
        // Normalize size names
        let normalizedSize = size.toUpperCase();
        if (size.toLowerCase() === 'small') normalizedSize = 'S';
        else if (size.toLowerCase() === 'medium') normalizedSize = 'M';
        else if (size.toLowerCase() === 'large') normalizedSize = 'L';
        else if (size.toLowerCase().includes('extra small')) normalizedSize = 'XS';
        else if (size.toLowerCase().includes('extra large')) normalizedSize = 'XL';
        
        // Include gender in size if present
        const fullSize = gender ? `${gender.trim()} ${normalizedSize}` : normalizedSize;
        
        items.push({
          category: currentCategory,
          size: fullSize,
          quantity: quantity
        });
      }
    }
  });

  return items;
};
