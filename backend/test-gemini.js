// Quick test to verify Gemini AI tips are working
import fetch from 'node-fetch';

const testData = {
  fieldName: 'dli',
  useAI: true,
  formData: {
    personalInfo: { citizenship: 'India' },
    studyPurpose: { canadianInstitution: 'University of Toronto' }
  }
};

console.log('Testing Gemini AI tips endpoint...\n');

fetch('http://localhost:3001/api/tips/get-tips', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
})
  .then(res => res.json())
  .then(data => {
    console.log('Response source:', data.source);
    console.log('Has AI tip:', !!data.aiTip);
    console.log('Has static tip:', !!data.tip);

    if (data.source === 'ai') {
      console.log('\n🎉 SUCCESS! Gemini API was called');
      console.log('\nAI Response:');
      console.log('─'.repeat(60));
      console.log(data.aiTip);
      console.log('─'.repeat(60));
    } else {
      console.log('\n⚠️  Fell back to static tips - API may have failed');
      if (typeof data.tip === 'object') {
        console.log('Static tip:', data.tip.tip);
      }
    }
  })
  .catch(err => console.error('Error:', err.message));
