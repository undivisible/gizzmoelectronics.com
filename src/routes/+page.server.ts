import type { PageServerLoad } from './$types';
import fs from 'fs';
import path from 'path';
import { dev } from '$app/environment';

export interface Manual {
  id: string;
  title: string;
  category: string;
  files: {
    quickstart?: string;
    instructions?: string;
  };
}

// Hardcoded manuals data for production environment
const hardcodedManuals: Manual[] = [
  // Boost Controllers
  {
    id: 'boost_controllers-v4_1.00',
    title: 'V4 1.00',
    category: 'Boost Controllers',
    files: {
      quickstart: '/manuals/boost_controllers/v4_1.00/quickstart.pdf',
      instructions: '/manuals/boost_controllers/v4_1.00/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-v4_1.10',
    title: 'V4 1.10',
    category: 'Boost Controllers',
    files: {
      quickstart: '/manuals/boost_controllers/v4_1.10/quickstart.pdf',
      instructions: '/manuals/boost_controllers/v4_1.10/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-v4_1.11',
    title: 'V4 1.11',
    category: 'Boost Controllers',
    files: {
      quickstart: '/manuals/boost_controllers/v4_1.11/quickstart.pdf',
      instructions: '/manuals/boost_controllers/v4_1.11/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-v4_1.12',
    title: 'V4 1.12',
    category: 'Boost Controllers',
    files: {
      quickstart: '/manuals/boost_controllers/v4_1.12/quickstart.pdf',
      instructions: '/manuals/boost_controllers/v4_1.12/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-v4_IBC_1.10',
    title: 'V4 IBC 1.10',
    category: 'Boost Controllers',
    files: {
      quickstart: '/manuals/boost_controllers/v4_IBC_1.10/quickstart.pdf',
      instructions: '/manuals/boost_controllers/v4_IBC_1.10/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-v4_IBC_1.12',
    title: 'V4 IBC 1.12',
    category: 'Boost Controllers',
    files: {
      quickstart: '/manuals/boost_controllers/v4_IBC_1.12/quickstart.pdf',
      instructions: '/manuals/boost_controllers/v4_IBC_1.12/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-IBCR',
    title: 'IBCR',
    category: 'Boost Controllers',
    files: {
      instructions: '/manuals/boost_controllers/IBCR/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-IBC',
    title: 'IBC',
    category: 'Boost Controllers',
    files: {
      instructions: '/manuals/boost_controllers/IBC/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-MS2',
    title: 'MS2',
    category: 'Boost Controllers',
    files: {
      instructions: '/manuals/boost_controllers/MS2/instructions.pdf'
    }
  },
  {
    id: 'boost_controllers-MSIBC',
    title: 'MSIBC',
    category: 'Boost Controllers',
    files: {
      instructions: '/manuals/boost_controllers/MSIBC/instructions.pdf'
    }
  },
  // Shiftlight
  {
    id: 'shiftlight-CB1S',
    title: 'CB1S',
    category: 'Shiftlight',
    files: {
      instructions: '/manuals/shiftlight/CB1S/instructions.pdf'
    }
  },
  {
    id: 'shiftlight-DSII-L',
    title: 'DSII-L',
    category: 'Shiftlight',
    files: {
      instructions: '/manuals/shiftlight/DSII-L/instructions.pdf'
    }
  },
  {
    id: 'shiftlight-DSII',
    title: 'DSII',
    category: 'Shiftlight',
    files: {
      instructions: '/manuals/shiftlight/DSII/instructions.pdf'
    }
  },
  {
    id: 'shiftlight-DS',
    title: 'DS',
    category: 'Shiftlight',
    files: {
      instructions: '/manuals/shiftlight/DS/instructions.pdf'
    }
  },
  {
    id: 'shiftlight-TR2',
    title: 'TR2',
    category: 'Shiftlight',
    files: {
      instructions: '/manuals/shiftlight/TR2/instructions.pdf'
    }
  },
  {
    id: 'shiftlight-TR',
    title: 'TR',
    category: 'Shiftlight',
    files: {
      instructions: '/manuals/shiftlight/TR/instructions.pdf'
    }
  },
  {
    id: 'shiftlight-original_shiftlight',
    title: 'Original Shiftlight',
    category: 'Shiftlight',
    files: {
      instructions: '/manuals/shiftlight/original_shiftlight/instructions.pdf'
    }
  }
];


export const load: PageServerLoad = async () => {
  // In production (Netlify), use hardcoded data
  if (!dev) {
    return { manuals: hardcodedManuals };
  }
  
  // Verify we're in a server context
  try {
    // Import the verifyServerContext function dynamically to prevent it from being bundled
    // in client-side code when not needed
    const { verifyServerContext } = await import('$lib/server/index.js');
    verifyServerContext('PageServer');
  } catch (error) {
    console.error('Server-only code was executed in a browser context');
    return { manuals: hardcodedManuals };
  }
  
  // In development, use filesystem
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