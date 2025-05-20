import fs from 'fs';
import path from 'path';
import type { Manual } from '../../routes/+page.server';
import { verifyServerContext } from './index.js';

// This function will only run on the server
// The verifyServerContext function ensures this code is properly isolated
export function getManuals(): Manual[] {
  // Verify we're in a server context
  try {
    verifyServerContext('Manuals');
  } catch (error) {
    console.error('getManuals() was called in a browser context');
    return [];
  }
  try {
    const manualsDir = path.join(process.cwd(), 'static', 'manuals');
    
    // Check if the directory exists
    if (!fs.existsSync(manualsDir)) {
      console.warn(`Manuals directory not found: ${manualsDir}`);
      return [];
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
    
    return manuals;
  } catch (error) {
    console.error('Error loading manuals:', error);
    return [];
  }
}