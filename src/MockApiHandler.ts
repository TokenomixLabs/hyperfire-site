
// This file simulates API responses for development purposes

class MockApiHandler {
  // Intercept fetch requests and handle them
  static init() {
    const originalFetch = window.fetch;
    
    window.fetch = async function(input, init) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      
      console.log('🔄 Mock API request:', url, init);
      
      // Handle profile setup API
      if (url === '/api/users/profile-setup' && init?.method === 'POST') {
        const body = init.body ? JSON.parse(init.body.toString()) : {};
        console.log('📝 Handling profile setup request:', body);
        
        // Simulate API processing
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Return success response
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Fall back to original fetch for other requests
      return originalFetch.apply(this, [input, init]);
    };
    
    console.log('✅ Mock API handler initialized');
  }
}

// Initialize the mock API handler
MockApiHandler.init();

export default MockApiHandler;
