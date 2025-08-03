// Test script to verify fal.ai Kontext API with CLI
const { fal } = require('@fal-ai/client');
const fs = require('fs');
const path = require('path');

// Configure fal.ai client with the API key from .env
require('dotenv').config();
fal.config({
  credentials: process.env.REACT_APP_FAL_KEY
});

// Test function to verify API connectivity and token
async function testKontextAPI() {
  try {
    console.log('Testing fal.ai Kontext API...');
    console.log('API Key:', process.env.REACT_APP_FAL_KEY ? 'Found' : 'Missing');
    
    // Test with a simple image URL and prompt
    const testInput = {
      prompt: "Change the background to a sunset",
      image_url: "https://picsum.photos/512/512", // Using a test image URL
      guidance_scale: 3.5,
      num_inference_steps: 28,
      output_format: "jpeg",
      safety_tolerance: "2"
    };
    
    console.log('\nTesting fal-ai/flux-pro/kontext endpoint...');
    console.log('Input:', JSON.stringify(testInput, null, 2));
    
    const result = await fal.subscribe('fal-ai/flux-pro/kontext', {
      input: testInput,
      logs: true,
      onQueueUpdate: (update) => {
        console.log('Queue update:', update.status);
        if (update.logs) {
          update.logs.forEach(log => console.log('Log:', log.message));
        }
      },
    });
    
    console.log('\n✅ API Test Successful!');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    return result;
    
  } catch (error) {
    console.error('\n❌ API Test Failed!');
    console.error('Error:', error.message);
    console.error('Full error:', error);
    
    // Check for specific error types
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      console.error('\n🔑 Authentication Error: Check your API key');
    } else if (error.message.includes('400') || error.message.includes('Bad Request')) {
      console.error('\n📝 Request Error: Check your input parameters');
    } else if (error.message.includes('429') || error.message.includes('rate limit')) {
      console.error('\n⏰ Rate Limit Error: Too many requests');
    } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
      console.error('\n🔧 Server Error: fal.ai service issue');
    }
    
    throw error;
  }
}

// Test different endpoints
async function testAllEndpoints() {
  const endpoints = [
    'fal-ai/flux-pro/kontext',
    'fal-ai/flux-pro/kontext/max',
    'fal-ai/flux-pro/kontext/max/multi'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n\n=== Testing ${endpoint} ===`);
      
      const testInput = {
        prompt: "Change the background to a sunset",
        image_url: "https://picsum.photos/512/512",
        guidance_scale: 3.5,
        num_inference_steps: 28,
        output_format: "jpeg",
        safety_tolerance: "2"
      };
      
      // For multi endpoint, use image_urls array
      if (endpoint.includes('multi')) {
        testInput.image_urls = [testInput.image_url, "https://picsum.photos/512/512"];
        delete testInput.image_url;
      }
      
      const result = await fal.subscribe(endpoint, {
        input: testInput,
        logs: true,
        onQueueUpdate: (update) => {
          console.log(`${endpoint} - Queue update:`, update.status);
        },
      });
      
      console.log(`✅ ${endpoint} - Success!`);
      console.log('Result keys:', Object.keys(result));
      
    } catch (error) {
      console.error(`❌ ${endpoint} - Failed:`, error.message);
    }
  }
}

// Run the tests
if (require.main === module) {
  console.log('🧪 Starting fal.ai Kontext API Tests\n');
  
  testKontextAPI()
    .then(() => {
      console.log('\n\n🔍 Testing all endpoints...');
      return testAllEndpoints();
    })
    .then(() => {
      console.log('\n\n🎉 All tests completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n\n💥 Test suite failed:', error.message);
      process.exit(1);
    });
}

module.exports = { testKontextAPI, testAllEndpoints };