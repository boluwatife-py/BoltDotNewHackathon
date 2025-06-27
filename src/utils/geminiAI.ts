// Gemini AI Integration Utility
// This would typically use the Google Generative AI SDK

export interface ChatContext {
  userName: string;
  userAge: number;
  supplements: Array<{
    name: string;
    time: string;
    tags: string[];
    type: string;
    completed: boolean;
    muted: boolean;
    alerts?: Array<{ message: string; type: string }>;
  }>;
  currentTime: string;
}

export interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

// Medical knowledge base for the AI
const MEDICAL_KNOWLEDGE_PROMPT = `
You are SafeDoser Assistant, a knowledgeable and helpful medical AI assistant specializing in medications, supplements, and health guidance. You have access to comprehensive medical databases and drug interaction information.

IMPORTANT GUIDELINES:
1. Always prioritize user safety - recommend consulting healthcare providers for serious concerns
2. Provide evidence-based information from reliable medical sources
3. Be empathetic and understanding about health concerns
4. Never diagnose conditions - only provide educational information
5. Always mention consulting healthcare providers for personalized advice
6. Be aware of drug interactions, contraindications, and side effects
7. Consider the user's age, current supplements, and medical context

MEDICAL KNOWLEDGE AREAS:
- Drug interactions and contraindications
- Supplement benefits, side effects, and proper usage
- Medication timing and food interactions
- Age-specific considerations for medications
- Common health conditions and their treatments
- Preventive health measures
- Medication adherence strategies

RESPONSE STYLE:
- Friendly, professional, and reassuring
- Use emojis appropriately (💊, ⚕️, 🩺, etc.)
- Provide actionable advice when appropriate
- Ask clarifying questions when needed
- Reference the user's current supplement regimen when relevant
`;

export class GeminiAIService {
  constructor() {
    // In a real implementation, this would come from environment variables
    // For now, we'll use a demo implementation
  }

  async generateResponse(
    userMessage: string,
    context: ChatContext,
    chatHistory: ChatMessage[]
  ): Promise<string> {
    try {
      // Prepare the context prompt
      const contextPrompt = this.buildContextPrompt(context);
      const historyPrompt = this.buildHistoryPrompt(chatHistory);
      
      // In a real implementation, this would make an actual API call to Gemini
      // For now, we'll simulate with intelligent responses based on the context
      return this.generateIntelligentResponse(userMessage, context);
      
    } catch (error) {
      console.error('Gemini AI Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  private buildContextPrompt(context: ChatContext): string {
    const supplementsList = context.supplements.map(supp => 
      `- ${supp.name} at ${supp.time} (${supp.type}) - Tags: ${supp.tags.join(', ')} - Status: ${supp.completed ? 'Completed' : 'Pending'}`
    ).join('\n');

    return `
Name: ${context.userName}
Age: ${context.userAge} years old
Current Time: ${context.currentTime}

Current Supplements:
${supplementsList || 'No supplements currently tracked'}
`;
  }

  private buildHistoryPrompt(chatHistory: ChatMessage[]): string {
    return chatHistory.slice(-6).map(msg => 
      `${msg.sender.toUpperCase()}: ${msg.text}`
    ).join('\n');
  }

  private generateIntelligentResponse(userMessage: string, context: ChatContext): string {
    const lowerMessage = userMessage.toLowerCase();
    const userName = context.userName;
    const userAge = context.userAge;
    const supplements = context.supplements;

    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello ${userName}! 👋 I'm here to help you with any questions about your medications and supplements. I see you're currently taking ${supplements.length} supplements. How can I assist you today? 💊`;
    }

    // Supplement-specific questions
    const mentionedSupplement = supplements.find(supp => 
      lowerMessage.includes(supp.name.toLowerCase())
    );

    if (mentionedSupplement) {
      return this.generateSupplementSpecificResponse(mentionedSupplement, userName, userAge);
    }

    // Drug interaction questions
    if (lowerMessage.includes('interaction') || lowerMessage.includes('interact')) {
      return this.generateInteractionResponse(supplements, userName);
    }

    // Side effects questions
    if (lowerMessage.includes('side effect') || lowerMessage.includes('adverse')) {
      return `Side effects are an important consideration, ${userName}. At ${userAge} years old, it's especially important to monitor for any unusual symptoms. Common supplement side effects can include digestive upset, headaches, or allergic reactions. 

For your current supplements, here are some general considerations:
${this.generateSideEffectInfo(supplements)}

If you're experiencing any concerning symptoms, please contact your healthcare provider immediately. Would you like information about any specific supplement? ⚕️`;
    }

    // Dosage questions
    if (lowerMessage.includes('dose') || lowerMessage.includes('dosage') || lowerMessage.includes('how much')) {
      return `Dosage questions are crucial for safety, ${userName}! At ${userAge}, proper dosing is especially important. I can see your current supplement schedule, but I always recommend confirming dosages with your healthcare provider or pharmacist.

Never adjust doses without medical supervision. If you're unsure about any dosage, please consult your doctor. Would you like me to review your current supplement timing? 📋`;
    }

    // Timing questions
    if (lowerMessage.includes('when') || lowerMessage.includes('time') || lowerMessage.includes('timing')) {
      return this.generateTimingResponse(supplements, userName);
    }

    // Age-related questions
    if (lowerMessage.includes('age') || lowerMessage.includes('older') || lowerMessage.includes('senior')) {
      return `At ${userAge} years old, there are some important considerations for supplement use:

🔹 **Absorption**: Some supplements may be absorbed differently with age
🔹 **Kidney Function**: Important to monitor with certain supplements
🔹 **Drug Interactions**: More likely if taking multiple medications
🔹 **Bone Health**: Calcium, Vitamin D, and Magnesium become increasingly important

Your current supplement regimen looks well-balanced. Always discuss any changes with your healthcare provider, especially considering age-related factors. Is there a specific concern you'd like to discuss? 👨‍⚕️`;
    }

    // General health questions
    if (lowerMessage.includes('health') || lowerMessage.includes('benefit') || lowerMessage.includes('good for')) {
      return `Great question about health benefits, ${userName}! Your current supplement regimen shows good attention to overall wellness. Here's what I can tell you about the general benefits:

${this.generateHealthBenefitsInfo(supplements)}

Remember, supplements work best as part of a healthy lifestyle including proper diet, exercise, and regular medical check-ups. At ${userAge}, maintaining these habits is especially beneficial! 🌟

Is there a specific health goal you're working towards?`;
    }

    // Default response with context
    return `I'd be happy to help you with that, ${userName}! I have access to comprehensive medical information and can see you're currently managing ${supplements.length} supplements. 

I can help you with:
💊 Supplement information and interactions
⏰ Timing and dosage guidance  
🩺 General health questions
⚠️ Side effect information
🔄 Medication adherence tips

Could you be more specific about what you'd like to know? I'm here to provide evidence-based information while always recommending you consult with your healthcare provider for personalized advice.`;
  }

  private generateSupplementSpecificResponse(supplement: any, userName: string, userAge: number): string {
    const supplementName = supplement.name;
    const time = supplement.time;
    const tags = supplement.tags.join(', ');

    return `I can help you with information about ${supplementName}, ${userName}! 

**Your Current Schedule:** ${time}
**Categories:** ${tags}
**Status:** ${supplement.completed ? 'Completed today ✅' : 'Pending'}

${this.getSupplementInfo(supplementName, userAge)}

Is there something specific about ${supplementName} you'd like to know more about? I can discuss timing, interactions, benefits, or any concerns you might have. 💊`;
  }

  private generateInteractionResponse(supplements: any[], userName: string): string {
    if (supplements.length === 0) {
      return `${userName}, you don't currently have any supplements tracked, so there are no interactions to check. When you add supplements, I can help you identify potential interactions! 🔍`;
    }

    const supplementNames = supplements.map(s => s.name).join(', ');
    
    return `Great question about interactions, ${userName}! I can see you're taking: ${supplementNames}.

**General Interaction Guidelines:**
🔹 **Timing**: Some supplements compete for absorption (like calcium and iron)
🔹 **Food**: Some work better with food, others on empty stomach
🔹 **Medications**: Always check with your pharmacist about prescription drug interactions

**Your Current Supplements:**
${supplements.map(supp => `• ${supp.name} - ${this.getBasicInteractionInfo(supp.name)}`).join('\n')}

For specific interaction concerns, especially with prescription medications, please consult your pharmacist or healthcare provider. They can access comprehensive interaction databases! ⚕️

Do you have a specific interaction concern?`;
  }

  private generateTimingResponse(supplements: any[], userName: string): string {
    if (supplements.length === 0) {
      return `${userName}, you don't have any supplements scheduled yet. When you add them, I can help optimize your timing for best absorption and effectiveness! ⏰`;
    }

    const schedule = supplements.map(supp => `• ${supp.time} - ${supp.name}`).sort();
    
    return `Here's your current supplement schedule, ${userName}:

${schedule.join('\n')}

**Timing Tips:**
🌅 **Morning**: Best for energizing supplements (B vitamins, iron)
🌆 **Evening**: Good for relaxing supplements (magnesium, melatonin)
🍽️ **With Food**: Fat-soluble vitamins (A, D, E, K) absorb better with meals
🥛 **Empty Stomach**: Some minerals absorb better without food

Your timing looks well-distributed! Any specific timing concerns or questions about optimal absorption? ⏰`;
  }

  private generateSideEffectInfo(supplements: any[]): string {
    return supplements.map(supp => 
      `• **${supp.name}**: ${this.getBasicSideEffectInfo(supp.name)}`
    ).join('\n');
  }

  private generateHealthBenefitsInfo(supplements: any[]): string {
    return supplements.map(supp => 
      `• **${supp.name}**: ${this.getBasicBenefitInfo(supp.name)}`
    ).join('\n');
  }

  private getSupplementInfo(name: string, age: number): string {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('vitamin d')) {
      return `**Vitamin D3** is excellent for bone health, especially important at ${age}! Best absorbed with fat-containing meals. Supports immune function and calcium absorption. Recommended to check blood levels annually.`;
    }
    
    if (lowerName.includes('omega') || lowerName.includes('fish oil')) {
      return `**Omega-3** supports heart and brain health - very beneficial at your age! Take with meals to reduce fishy aftertaste. Look for EPA/DHA content on labels. Great for inflammation reduction.`;
    }
    
    if (lowerName.includes('magnesium')) {
      return `**Magnesium** supports muscle function, sleep, and bone health. Evening timing is often preferred as it can be relaxing. Important for heart rhythm and blood pressure regulation.`;
    }
    
    if (lowerName.includes('vitamin c')) {
      return `**Vitamin C** is a powerful antioxidant supporting immune function. Water-soluble, so timing is flexible. Helps with iron absorption when taken together.`;
    }
    
    if (lowerName.includes('probiotic')) {
      return `**Probiotics** support digestive and immune health. Best taken consistently, often with or after meals. Look for multiple strains and adequate CFU count.`;
    }
    
    if (lowerName.includes('melatonin')) {
      return `**Melatonin** helps regulate sleep cycles. Take 30-60 minutes before desired bedtime. Start with lowest effective dose. Avoid bright lights after taking.`;
    }
    
    return `This supplement can be beneficial as part of a balanced health regimen. For specific information about benefits, dosing, and interactions, I recommend consulting with your healthcare provider or pharmacist.`;
  }

  private getBasicInteractionInfo(name: string): string {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('vitamin d')) return 'Take with calcium for synergy, avoid with thiazide diuretics';
    if (lowerName.includes('omega')) return 'May enhance blood-thinning medications';
    if (lowerName.includes('magnesium')) return 'Can affect absorption of antibiotics and bisphosphonates';
    if (lowerName.includes('vitamin c')) return 'Enhances iron absorption, may affect some medications';
    if (lowerName.includes('probiotic')) return 'Take 2+ hours apart from antibiotics';
    if (lowerName.includes('melatonin')) return 'May interact with blood thinners and diabetes medications';
    
    return 'Check with pharmacist for specific interactions';
  }

  private getBasicSideEffectInfo(name: string): string {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('vitamin d')) return 'Generally well-tolerated; high doses may cause nausea or kidney issues';
    if (lowerName.includes('omega')) return 'May cause fishy aftertaste, digestive upset, or increased bleeding risk';
    if (lowerName.includes('magnesium')) return 'May cause digestive upset or diarrhea at high doses';
    if (lowerName.includes('vitamin c')) return 'High doses may cause digestive upset or kidney stones';
    if (lowerName.includes('probiotic')) return 'Initial digestive changes are normal; rare allergic reactions possible';
    if (lowerName.includes('melatonin')) return 'May cause drowsiness, headache, or vivid dreams';
    
    return 'Monitor for any unusual symptoms and consult healthcare provider if concerned';
  }

  private getBasicBenefitInfo(name: string): string {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('vitamin d')) return 'Bone health, immune support, calcium absorption';
    if (lowerName.includes('omega')) return 'Heart health, brain function, inflammation reduction';
    if (lowerName.includes('magnesium')) return 'Muscle function, sleep quality, bone health';
    if (lowerName.includes('vitamin c')) return 'Immune support, antioxidant protection, collagen synthesis';
    if (lowerName.includes('probiotic')) return 'Digestive health, immune support, gut microbiome balance';
    if (lowerName.includes('melatonin')) return 'Sleep regulation, circadian rhythm support';
    
    return 'Supports overall health and wellness as part of balanced nutrition';
  }
}

// Export singleton instance
export const geminiAI = new GeminiAIService();