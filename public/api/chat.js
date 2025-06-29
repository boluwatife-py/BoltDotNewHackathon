// Mock API endpoint for Gemini AI integration
// In a real deployment, this would be a proper backend endpoint

import { geminiAI } from '../../src/utils/geminiAI.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context, chatHistory } = req.body;

    if (!message || !context) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate AI response using Gemini AI service
    const reply = await geminiAI.generateResponse(message, context, chatHistory || []);
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Return a helpful fallback response
    const fallbackResponse = `I'm experiencing some technical difficulties right now, but I'm still here to help! 🔧

For immediate medical questions, please contact your healthcare provider. For general supplement information, you can also check reliable sources like:
- Your pharmacist
- WebMD or Mayo Clinic websites  
- Your supplement packaging and inserts

I'll be back to full functionality soon. Thank you for your patience! 💊`;

    return res.status(200).json({ reply: fallbackResponse });
  }
}