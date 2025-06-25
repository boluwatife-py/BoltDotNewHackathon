import os
import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from werkzeug.exceptions import BadRequest, InternalServerError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini AI
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your-api-key-here')
if GEMINI_API_KEY and GEMINI_API_KEY != 'your-api-key-here':
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
else:
    model = None
    logger.warning("Gemini API key not configured. Using fallback responses.")

@dataclass
class SupplementInfo:
    name: str
    time: str
    tags: List[str]
    type: str
    completed: bool
    muted: bool
    alerts: Optional[List[Dict[str, str]]] = None

@dataclass
class UserContext:
    userName: str
    userAge: int
    supplements: List[SupplementInfo]
    currentTime: str

@dataclass
class ChatMessage:
    sender: str
    text: str

class MedicalAIAssistant:
    def __init__(self):
        self.medical_knowledge = self._load_medical_knowledge()
        
    def _load_medical_knowledge(self) -> Dict[str, Any]:
        """Load comprehensive medical knowledge base"""
        return {
            "supplements": {
                "vitamin_d3": {
                    "benefits": ["Bone health", "Immune support", "Calcium absorption", "Mood regulation"],
                    "side_effects": ["Nausea at high doses", "Kidney stones (rare)", "Hypercalcemia"],
                    "interactions": ["Enhanced by magnesium", "Avoid with thiazide diuretics"],
                    "timing": "Best with fat-containing meals",
                    "age_considerations": {
                        "40+": "Increased importance for bone health and immune function"
                    }
                },
                "omega_3": {
                    "benefits": ["Heart health", "Brain function", "Anti-inflammatory", "Eye health"],
                    "side_effects": ["Fishy aftertaste", "Digestive upset", "Increased bleeding risk"],
                    "interactions": ["May enhance blood thinners", "Avoid before surgery"],
                    "timing": "With meals to reduce side effects",
                    "age_considerations": {
                        "40+": "Critical for cardiovascular and cognitive health"
                    }
                },
                "magnesium": {
                    "benefits": ["Muscle function", "Sleep quality", "Bone health", "Heart rhythm"],
                    "side_effects": ["Diarrhea at high doses", "Digestive upset"],
                    "interactions": ["Affects antibiotic absorption", "Enhances calcium"],
                    "timing": "Evening preferred for sleep benefits",
                    "age_considerations": {
                        "40+": "Important for muscle and bone health maintenance"
                    }
                },
                "vitamin_c": {
                    "benefits": ["Immune support", "Antioxidant", "Collagen synthesis", "Iron absorption"],
                    "side_effects": ["Digestive upset at high doses", "Kidney stones (rare)"],
                    "interactions": ["Enhances iron absorption", "May affect some medications"],
                    "timing": "Flexible, water-soluble",
                    "age_considerations": {
                        "40+": "Enhanced antioxidant needs with aging"
                    }
                },
                "probiotics": {
                    "benefits": ["Digestive health", "Immune support", "Gut microbiome", "Mental health"],
                    "side_effects": ["Initial digestive changes", "Rare allergic reactions"],
                    "interactions": ["Take away from antibiotics", "May affect immune medications"],
                    "timing": "With or after meals for survival",
                    "age_considerations": {
                        "40+": "Gut health becomes increasingly important"
                    }
                },
                "melatonin": {
                    "benefits": ["Sleep regulation", "Circadian rhythm", "Antioxidant properties"],
                    "side_effects": ["Drowsiness", "Headache", "Vivid dreams", "Hormonal effects"],
                    "interactions": ["Blood thinners", "Diabetes medications", "Immunosuppressants"],
                    "timing": "30-60 minutes before bedtime",
                    "age_considerations": {
                        "40+": "Natural melatonin production decreases with age"
                    }
                }
            },
            "drug_interactions": {
                "blood_thinners": ["omega_3", "vitamin_e", "garlic", "ginkgo"],
                "diabetes_medications": ["chromium", "cinnamon", "bitter_melon"],
                "blood_pressure_medications": ["potassium", "coq10", "hawthorn"],
                "thyroid_medications": ["calcium", "iron", "soy"]
            },
            "age_specific_advice": {
                "40_50": {
                    "focus": ["Cardiovascular health", "Bone density", "Hormone balance"],
                    "recommended": ["Omega-3", "Vitamin D", "Magnesium", "CoQ10"],
                    "monitoring": ["Blood pressure", "Cholesterol", "Bone density"]
                },
                "50_plus": {
                    "focus": ["Cognitive health", "Joint health", "Heart health"],
                    "recommended": ["B-complex", "Vitamin D", "Omega-3", "Glucosamine"],
                    "monitoring": ["Kidney function", "Liver function", "Cognitive assessment"]
                }
            }
        }

    def generate_system_prompt(self, context: UserContext) -> str:
        """Generate comprehensive system prompt with medical knowledge"""
        return f"""
You are SafeDoser Assistant, an expert medical AI specializing in medications, supplements, and health guidance. You have access to comprehensive medical databases and evidence-based information.

CRITICAL SAFETY GUIDELINES:
1. ALWAYS prioritize user safety - recommend consulting healthcare providers for serious concerns
2. Provide evidence-based information from reliable medical sources
3. Never diagnose conditions - only provide educational information
4. Always mention consulting healthcare providers for personalized medical advice
5. Be aware of drug interactions, contraindications, and side effects
6. Consider age-specific factors and individual health contexts

USER CONTEXT:
- Name: {context.userName}
- Age: {context.userAge} years old
- Current Time: {context.currentTime}
- Number of Supplements: {len(context.supplements)}

CURRENT SUPPLEMENT REGIMEN:
{self._format_supplements(context.supplements)}

MEDICAL EXPERTISE AREAS:
- Drug interactions and contraindications
- Supplement benefits, side effects, and proper usage
- Medication timing optimization and food interactions
- Age-specific health considerations (especially for {context.userAge}+ adults)
- Preventive health measures and wellness strategies
- Medication adherence and management techniques

RESPONSE GUIDELINES:
- Be empathetic, professional, and reassuring
- Use appropriate medical emojis (💊, ⚕️, 🩺, ❤️, 🧠)
- Provide actionable, evidence-based advice
- Ask clarifying questions when needed
- Reference the user's current supplement regimen when relevant
- Always emphasize the importance of healthcare provider consultation
- Consider age-related factors in all recommendations

AGE-SPECIFIC CONSIDERATIONS FOR {context.userAge} YEARS OLD:
{self._get_age_specific_advice(context.userAge)}
"""

    def _format_supplements(self, supplements: List[SupplementInfo]) -> str:
        """Format supplement list for AI context"""
        if not supplements:
            return "No supplements currently tracked"
        
        formatted = []
        for supp in supplements:
            status = "✅ Completed" if supp.completed else "⏳ Pending"
            muted = "🔇 Muted" if supp.muted else "🔔 Active"
            alerts = f" | Alerts: {len(supp.alerts)}" if supp.alerts else ""
            
            formatted.append(
                f"• {supp.name} at {supp.time} ({supp.type}) - {status} - {muted}"
                f" | Tags: {', '.join(supp.tags)}{alerts}"
            )
        
        return "\n".join(formatted)

    def _get_age_specific_advice(self, age: int) -> str:
        """Get age-specific health advice"""
        if age >= 50:
            return """
- Increased focus on cardiovascular and cognitive health
- Enhanced need for Vitamin D, B12, and Omega-3
- Important to monitor kidney and liver function
- Consider bone density and joint health supplements
- Regular screening for age-related conditions recommended
"""
        elif age >= 40:
            return """
- Preventive focus on heart health and bone density
- Metabolism changes may affect supplement absorption
- Hormone balance becomes increasingly important
- Regular health screenings recommended
- Stress management and sleep quality crucial
"""
        else:
            return """
- Focus on establishing healthy supplement routines
- Building strong foundation for long-term health
- Emphasis on active lifestyle and balanced nutrition
"""

    def get_supplement_info(self, supplement_name: str, user_age: int) -> Dict[str, Any]:
        """Get detailed information about a specific supplement"""
        name_key = supplement_name.lower().replace(' ', '_').replace('-', '_')
        
        # Try to find exact match or partial match
        for key, info in self.medical_knowledge["supplements"].items():
            if key in name_key or any(word in name_key for word in key.split('_')):
                result = info.copy()
                
                # Add age-specific information
                age_group = "50_plus" if user_age >= 50 else "40_50" if user_age >= 40 else "general"
                if age_group in info.get("age_considerations", {}):
                    result["age_specific"] = info["age_considerations"][age_group]
                
                return result
        
        return {
            "benefits": ["Consult healthcare provider for specific benefits"],
            "side_effects": ["Monitor for any unusual symptoms"],
            "interactions": ["Check with pharmacist for drug interactions"],
            "timing": "Follow package instructions or healthcare provider guidance"
        }

    async def generate_response(self, user_message: str, context: UserContext, chat_history: List[ChatMessage]) -> str:
        """Generate AI response using Gemini or fallback logic"""
        try:
            if model:
                return await self._generate_gemini_response(user_message, context, chat_history)
            else:
                return self._generate_fallback_response(user_message, context)
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return self._generate_error_response(context.userName)

    async def _generate_gemini_response(self, user_message: str, context: UserContext, chat_history: List[ChatMessage]) -> str:
        """Generate response using Gemini AI"""
        system_prompt = self.generate_system_prompt(context)
        
        # Format chat history
        history_text = "\n".join([
            f"{msg.sender.upper()}: {msg.text}" for msg in chat_history[-6:]
        ])
        
        full_prompt = f"""
{system_prompt}

RECENT CONVERSATION HISTORY:
{history_text}

USER MESSAGE: {user_message}

Please provide a helpful, medically accurate response considering the user's context, age ({context.userAge}), and current supplement regimen. Always prioritize safety and recommend consulting healthcare providers when appropriate.
"""
        
        response = model.generate_content(full_prompt)
        return response.text

    def _generate_fallback_response(self, user_message: str, context: UserContext) -> str:
        """Generate intelligent fallback response when Gemini is unavailable"""
        message_lower = user_message.lower()
        user_name = context.userName
        user_age = context.userAge
        supplements = context.supplements

        # Greeting responses
        if any(word in message_lower for word in ['hello', 'hi', 'hey', 'good morning', 'good evening']):
            return f"""Hello {user_name}! 👋 I'm your SafeDoser AI assistant, here to help with your medication and supplement questions.

I can see you're currently managing {len(supplements)} supplements. At {user_age} years old, maintaining a good supplement routine is excellent for your health! 

How can I assist you today? I can help with:
💊 Supplement information and benefits
⏰ Timing and dosage guidance
🔄 Drug interaction checking
⚕️ General health questions
📋 Medication adherence tips"""

        # Supplement-specific questions
        mentioned_supplement = None
        for supp in supplements:
            if supp.name.lower() in message_lower:
                mentioned_supplement = supp
                break

        if mentioned_supplement:
            supp_info = self.get_supplement_info(mentioned_supplement.name, user_age)
            status = "completed today ✅" if mentioned_supplement.completed else "pending ⏳"
            
            return f"""Great question about {mentioned_supplement.name}, {user_name}! 

**Your Current Schedule:** {mentioned_supplement.time} - Status: {status}
**Type:** {mentioned_supplement.type} | **Tags:** {', '.join(mentioned_supplement.tags)}

**Key Benefits:** {', '.join(supp_info['benefits'][:3])}
**Timing:** {supp_info['timing']}
**Age Consideration:** {supp_info.get('age_specific', 'Beneficial for your age group')}

**Important:** Always consult your healthcare provider for personalized advice, especially at {user_age} years old.

Is there something specific about {mentioned_supplement.name} you'd like to know more about? 💊"""

        # Interaction questions
        if 'interaction' in message_lower or 'interact' in message_lower:
            if not supplements:
                return f"{user_name}, you don't have any supplements tracked yet. When you add them, I can help check for potential interactions! 🔍"
            
            supplement_names = [s.name for s in supplements]
            return f"""Excellent question about interactions, {user_name}! Drug interactions are crucial to monitor, especially at {user_age}.

**Your Current Supplements:** {', '.join(supplement_names)}

**Key Interaction Guidelines:**
🔹 **Timing Separation:** Some supplements compete for absorption
🔹 **Food Interactions:** Some need food, others work better on empty stomach  
🔹 **Prescription Drugs:** Always check with your pharmacist
🔹 **Age Factor:** Metabolism changes at {user_age} can affect interactions

**Immediate Action:** Please consult your pharmacist or healthcare provider for a comprehensive interaction review. They have access to complete drug interaction databases.

Do you have a specific interaction concern I can help address? ⚕️"""

        # Side effect questions
        if 'side effect' in message_lower or 'adverse' in message_lower:
            return f"""Side effects are an important consideration, {user_name}, especially at {user_age} years old.

**General Monitoring Guidelines:**
⚠️ **Watch for:** Digestive upset, headaches, allergic reactions
🩺 **Age-Related:** Kidney and liver function more important to monitor
📞 **When to Call Doctor:** Severe symptoms, persistent issues, new symptoms

**Your Supplements:** I can provide specific side effect information for each of your {len(supplements)} supplements.

**Important:** If you're experiencing any concerning symptoms, contact your healthcare provider immediately. Never ignore potential side effects.

Would you like specific side effect information for any of your supplements? 🔍"""

        # Dosage questions
        if any(word in message_lower for word in ['dose', 'dosage', 'how much', 'amount']):
            return f"""Dosage questions are critical for safety, {user_name}! At {user_age}, proper dosing is especially important.

**Safety Guidelines:**
📋 **Never adjust doses** without healthcare provider approval
🔍 **Age Considerations:** Metabolism and kidney function affect dosing at {user_age}
⚕️ **Individual Factors:** Your health conditions and other medications matter
📞 **When Unsure:** Always consult your doctor or pharmacist

**Your Current Regimen:** I can see your supplement schedule, but dosage verification should always be done with your healthcare provider.

For immediate dosage questions, contact your pharmacist - they're excellent resources for this information! 💊

Is there a specific supplement dosage you're concerned about?"""

        # Timing questions
        if any(word in message_lower for word in ['when', 'time', 'timing', 'schedule']):
            if not supplements:
                return f"{user_name}, you don't have any supplements scheduled yet. When you add them, I can help optimize timing for best results! ⏰"
            
            schedule = sorted([(s.time, s.name) for s in supplements])
            schedule_text = '\n'.join([f"• {time} - {name}" for time, name in schedule])
            
            return f"""Here's your current supplement schedule, {user_name}:

{schedule_text}

**Optimal Timing Tips:**
🌅 **Morning (6-10 AM):** Energy supplements, B vitamins, iron
🌞 **Midday (10 AM-2 PM):** Most vitamins, especially with lunch
🌆 **Evening (6-9 PM):** Relaxing supplements, magnesium
🌙 **Bedtime:** Melatonin, calcium (if not taken with other minerals)

**Age Consideration:** At {user_age}, consistent timing becomes more important for optimal absorption.

Your current schedule looks well-distributed! Any specific timing questions? ⏰"""

        # Age-related questions
        if any(word in message_lower for word in ['age', 'older', 'senior', str(user_age)]):
            age_advice = self._get_age_specific_advice(user_age)
            return f"""Great question about age-related supplement considerations, {user_name}!

**At {user_age} years old, here are key considerations:**
{age_advice}

**Your Current Regimen:** You're managing {len(supplements)} supplements, which shows good attention to health maintenance.

**Recommendations:**
🩺 Regular health screenings become more important
💊 Supplement absorption may change with age
⚕️ More frequent healthcare provider consultations recommended
📋 Keep detailed records of supplements and any effects

Always discuss your supplement regimen with your healthcare provider, especially any changes or new additions! 👨‍⚕️

Any specific age-related health concerns you'd like to discuss?"""

        # General health questions
        if any(word in message_lower for word in ['health', 'benefit', 'good for', 'help with']):
            return f"""Excellent focus on health, {user_name}! Your supplement regimen shows great attention to wellness.

**Your Current Health Support:**
💊 **{len(supplements)} Supplements** - Good foundation for health maintenance
🎯 **Age {user_age}** - Perfect time to focus on preventive health
⏰ **Scheduled Routine** - Consistency is key for supplement effectiveness

**General Health Benefits:**
❤️ **Cardiovascular Support** - Especially important at your age
🧠 **Cognitive Health** - Maintaining brain function
🦴 **Bone Health** - Critical for long-term mobility
🛡️ **Immune Support** - Enhanced protection

**Remember:** Supplements work best alongside:
🥗 Balanced nutrition
🏃‍♂️ Regular exercise  
😴 Quality sleep
🩺 Regular medical check-ups

Is there a specific health goal you're working towards? I'm here to provide evidence-based guidance! 🌟"""

        # Default comprehensive response
        return f"""I'd be happy to help you with that, {user_name}! I'm your SafeDoser AI assistant with access to comprehensive medical information.

**I can see you're managing {len(supplements)} supplements** - that's great health awareness at {user_age} years old!

**I can help you with:**
💊 **Supplement Information** - Benefits, side effects, interactions
⏰ **Timing Optimization** - Best absorption and effectiveness
🔄 **Drug Interactions** - Safety checking and guidance
🩺 **Health Questions** - Evidence-based information
📋 **Adherence Tips** - Staying consistent with your regimen
⚕️ **Age-Specific Advice** - Tailored for your {user_age} years

**Important:** I provide educational information to support your health decisions, but always consult your healthcare provider for personalized medical advice.

Could you be more specific about what you'd like to know? I'm here to help with evidence-based, safety-focused guidance! 🌟"""

    def _generate_error_response(self, user_name: str) -> str:
        """Generate error response when AI fails"""
        return f"""I'm experiencing some technical difficulties right now, {user_name}, but I'm still here to help! 🔧

**For immediate assistance:**
📞 **Urgent Medical Questions:** Contact your healthcare provider
💊 **Medication Information:** Consult your pharmacist
🌐 **Reliable Sources:** WebMD, Mayo Clinic, or your medication package inserts

**I'll be back to full functionality soon!** In the meantime, never hesitate to reach out to your healthcare team for any concerns.

Thank you for your patience! 💊✨"""

# Initialize the medical AI assistant
medical_ai = MedicalAIAssistant()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "gemini_configured": model is not None
    })

@app.route('/chat', methods=['POST'])
async def chat():
    """Main chat endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            raise BadRequest("No JSON data provided")
        
        # Validate required fields
        required_fields = ['message', 'context']
        for field in required_fields:
            if field not in data:
                raise BadRequest(f"Missing required field: {field}")
        
        user_message = data['message'].strip()
        if not user_message:
            raise BadRequest("Message cannot be empty")
        
        # Parse context
        context_data = data['context']
        supplements = [
            SupplementInfo(**supp) for supp in context_data.get('supplements', [])
        ]
        
        context = UserContext(
            userName=context_data.get('userName', 'User'),
            userAge=context_data.get('userAge', 45),
            supplements=supplements,
            currentTime=context_data.get('currentTime', datetime.now().isoformat())
        )
        
        # Parse chat history
        chat_history = []
        if 'chatHistory' in data:
            chat_history = [
                ChatMessage(sender=msg['sender'], text=msg['text'])
                for msg in data['chatHistory']
            ]
        
        # Generate response
        response = await medical_ai.generate_response(user_message, context, chat_history)
        
        # Log interaction
        logger.info(f"Chat interaction - User: {context.userName}, Age: {context.userAge}, "
                   f"Supplements: {len(supplements)}, Message length: {len(user_message)}")
        
        return jsonify({
            "reply": response,
            "timestamp": datetime.now().isoformat(),
            "status": "success"
        })
        
    except BadRequest as e:
        logger.warning(f"Bad request: {e}")
        return jsonify({"error": str(e)}), 400
    
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        return jsonify({
            "reply": "I'm experiencing technical difficulties. Please try again or contact your healthcare provider for immediate assistance.",
            "error": "Internal server error",
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/chat-history', methods=['GET'])
def get_chat_history():
    """Get chat history endpoint (placeholder - would typically use database)"""
    # In a real implementation, this would fetch from a database
    # For now, return empty array to let frontend handle local storage
    return jsonify([])

@app.route('/supplement-info/<supplement_name>', methods=['GET'])
def get_supplement_info_endpoint(supplement_name: str):
    """Get detailed information about a specific supplement"""
    try:
        user_age = request.args.get('age', 45, type=int)
        info = medical_ai.get_supplement_info(supplement_name, user_age)
        
        return jsonify({
            "supplement": supplement_name,
            "info": info,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Supplement info error: {e}")
        return jsonify({"error": "Failed to retrieve supplement information"}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info(f"Starting SafeDoser API server on port {port}")
    logger.info(f"Gemini AI configured: {model is not None}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)