// This module marks code that should only run on the server
// It's used to prevent Node.js-specific code from being executed in the browser

// Check if we're in a server environment
// In SvelteKit, this can be determined by checking if the window object is undefined
const isServer = typeof window === 'undefined';

// Export a constant that can be imported by other server modules
export const serverOnlyModule = isServer;

// Export a utility function to verify server context
export function verifyServerContext(moduleName = 'Unknown') {
  if (!isServer) {
    const error = `${moduleName} module was accessed in a browser context`;
    console.error(error);
    throw new Error(error);
  }
  return true;
}

// Log a warning if this module is somehow imported in a browser context
if (!isServer) {
  console.warn('Server-only module was imported in a browser context');
}