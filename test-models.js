const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const models = await genAI.listModels();
        console.log('Available models:', models);
    } catch (error) {
        console.error('Error:', error);
    }
}

testModels(); 