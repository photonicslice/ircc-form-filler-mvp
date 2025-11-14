// Test script to list available Gemini models
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ No GEMINI_API_KEY found in .env');
  process.exit(1);
}

console.log('✅ API Key found:', apiKey.substring(0, 20) + '...');
console.log('\nListing available models...\n');

const genAI = new GoogleGenerativeAI(apiKey);

// Try to list models using the REST API directly
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.models) {
      console.log('Available models:');
      console.log('─'.repeat(60));
      data.models.forEach(model => {
        console.log(`\nName: ${model.name}`);
        console.log(`Display Name: ${model.displayName}`);
        console.log(`Supported Methods: ${model.supportedGenerationMethods?.join(', ')}`);
      });
    } else {
      console.error('Error:', data);
    }
  })
  .catch(err => console.error('Fetch error:', err.message));
