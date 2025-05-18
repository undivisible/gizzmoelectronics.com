import type { PageServerLoad } from './$types';
import fs from 'fs';
import path from 'path';

export interface Manual {
  id: string;
  title: string;
  category: string;
  files: {
    quickstart?: string;
    instructions?: string;
  };
}

export const load: PageServerLoad = async () => {
  try {
    const manualsDir = path.join(process.cwd(), 'static', 'manuals');
    
    // Check if the directory exists
    if (!fs.existsSync(manualsDir)) {
      console.warn(`Manuals directory not found: ${manualsDir}`);
      return { manuals: [] };
    }
    
    // Get all category directories (top level)
    const categories = fs.readdirSync(manualsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    const manuals: Manual[] = [];
    
    // Process each category
    for (const category of categories) {
      const categoryPath = path.join(manualsDir, category);
      
      // Get all product directories within this category
      const products = fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      // Process each product
      for (const product of products) {
        const productPath = path.join(categoryPath, product);
        const files = fs.readdirSync(productPath);
        
        // Format the product name (replace underscores with spaces and capitalize)
        const title = product
          .replace(/_/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase());
        
        // Format the category name (replace underscores with spaces and capitalize)
        const categoryFormatted = category
          .replace(/_/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase());
        
        // Check for PDF files
        const hasQuickstart = files.includes('quickstart.pdf');
        const hasInstructions = files.includes('instructions.pdf');
        
        // Only add if at least one PDF exists
        if (hasQuickstart || hasInstructions) {
          manuals.push({
            id: `${category}-${product}`,
            title: title,
            category: categoryFormatted,
            files: {
              quickstart: hasQuickstart ? `/manuals/${category}/${product}/quickstart.pdf` : undefined,
              instructions: hasInstructions ? `/manuals/${category}/${product}/instructions.pdf` : undefined
            }
          });
        }
      }
    }
    
    // Sort manuals alphabetically by title
    manuals.sort((a, b) => a.title.localeCompare(b.title));
    
    return {
      manuals
    };
  } catch (error) {
    console.error('Error loading manuals:', error);
    return { manuals: [] };
  }
};