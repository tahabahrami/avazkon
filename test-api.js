const { fal } = require('@fal-ai/client');

// Configure fal.ai client
fal.config({
  credentials: '5d029853-88a4-4965-a5cd-e4bb4a883ca6:c7f7d403fd196f3842dceb51c75ab113'
});

async function testAPI() {
  try {
    console.log('Testing fal.ai API connection...');
    
    // Test with a simple API call
    const result = await fal.subscribe('fal-ai/flux-pro/kontext', {
      input: {
        prompt: 'A simple test image',
        image_url: 'https://picsum.photos/512/512'
      },
      logs: true
    });
    
    console.log('API test successful:', result);
  } catch (error) {
    console.error('API Error Details:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
  }
}

testAPI();