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
    
    // Check if this line contains size-quantity pairs (either format)
    const hasItemPattern = /(?:\d+\s+(?:XS|S|M|L|XL|XXL|2XL|3XL|Small|Medium|Large|Extra\s*Small|Extra\s*Large|\d+X))|(?:(?:XS|S|M|L|XL|XXL|2XL|3XL|Small|Medium|Large|Extra\s*Small|Extra\s*Large|\d+X)\s*[-–]\s*\d+)/i;
    
    if (!hasItemPattern.test(trimmedLine)) {
      // This is likely a category name
      currentCategory = trimmedLine.charAt(0).toUpperCase() + trimmedLine.slice(1).toLowerCase();
      return;
    }
      // Parse individual items from the line
    // Handle both formats: "15 Small" or "Small-15"
    // Order matters: longer patterns first to avoid partial matches
    const itemPattern1 = /(\d+)\s+((?:Mens?|Womens?|Ladies?|Girls?|Boys?)\s+)?(\d+X-?Large|\d+X-?Small|Extra\s*Large|Extra\s*Small|XXL|2XL|3XL|4XL|5XL|\d+X|XL|XS|Small|Medium|Large|[SMLX]+)/gi;
    const itemPattern2 = /(?:(Mens?|Womens?|Ladies?|Girls?|Boys?)\s+)?(\d+X-?Large|\d+X-?Small|Extra\s*Large|Extra\s*Small|XXL|2XL|3XL|4XL|5XL|\d+X|XL|XS|Small|Medium|Large|[SMLX]+)\s*[-–]\s*(\d+)/gi;
    
    let match;
    let foundMatch = false;
    
    // Try pattern 1: "15 Small"
    while ((match = itemPattern1.exec(trimmedLine)) !== null) {
      const quantity = parseInt(match[1], 10);
      const gender = match[2] || ''; // Optional gender prefix
      const size = match[3];
        if (quantity > 0) {
        // Normalize size names - handle special cases first
        let normalizedSize = size.toUpperCase();
        
        // Handle numbered sizes like "3X-Large", "4X", etc.
        if (/\d+X-?Large/i.test(size)) {
          normalizedSize = size.toUpperCase().replace('-', '');
        } else if (/\d+X-?Small/i.test(size)) {
          normalizedSize = size.toUpperCase().replace('-', '');
        } else if (/^\d+X$/i.test(size)) {
          normalizedSize = size.toUpperCase();
        } else if (size.toLowerCase() === 'small') {
          normalizedSize = 'S';
        } else if (size.toLowerCase() === 'medium') {
          normalizedSize = 'M';
        } else if (size.toLowerCase() === 'large') {
          normalizedSize = 'L';
        } else if (size.toLowerCase().includes('extra small')) {
          normalizedSize = 'XS';
        } else if (size.toLowerCase().includes('extra large')) {
          normalizedSize = 'XL';
        }
        
        // Include gender in size if present
        const fullSize = gender ? `${gender.trim()} ${normalizedSize}` : normalizedSize;
        
        items.push({
          category: currentCategory,
          size: fullSize,
          quantity: quantity
        });
        foundMatch = true;
      }
    }
    
    // If no match with pattern 1, try pattern 2: "Small-15"
    if (!foundMatch) {
      while ((match = itemPattern2.exec(trimmedLine)) !== null) {
        const gender = match[1] || ''; // Optional gender prefix
        const size = match[2];
        const quantity = parseInt(match[3], 10);
          if (quantity > 0) {
          // Normalize size names - handle special cases first
          let normalizedSize = size.toUpperCase();
          
          // Handle numbered sizes like "3X-Large", "4X", etc.
          if (/\d+X-?Large/i.test(size)) {
            normalizedSize = size.toUpperCase().replace('-', '');
          } else if (/\d+X-?Small/i.test(size)) {
            normalizedSize = size.toUpperCase().replace('-', '');
          } else if (/^\d+X$/i.test(size)) {
            normalizedSize = size.toUpperCase();
          } else if (size.toLowerCase() === 'small') {
            normalizedSize = 'S';
          } else if (size.toLowerCase() === 'medium') {
            normalizedSize = 'M';
          } else if (size.toLowerCase() === 'large') {
            normalizedSize = 'L';
          } else if (size.toLowerCase().includes('extra small')) {
            normalizedSize = 'XS';
          } else if (size.toLowerCase().includes('extra large')) {
            normalizedSize = 'XL';
          }
          
          // Include gender in size if present
          const fullSize = gender ? `${gender.trim()} ${normalizedSize}` : normalizedSize;
          
          items.push({
            category: currentCategory,
            size: fullSize,
            quantity: quantity
          });
        }
      }
    }
  });

  return items;
};
