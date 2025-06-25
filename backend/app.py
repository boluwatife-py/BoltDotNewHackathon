import os
import json
import logging
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, create_refresh_token
import google.generativeai as genai
from werkzeug.exceptions import BadRequest, InternalServerError
from werkzeug.security import generate_password_hash, check_password_hash
from supabase import create_client, Client
import uuid
from functools import wraps
import base64
from PIL import Image
import io

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])  # Allow frontend origins

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
jwt = JWTManager(app)

# Supabase Configuration
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://your-project.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY', 'your-anon-key')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Configure Gemini AI
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyDxkHF--RPv5MXIvqXAxHZAS0KDsa5l38s')
if GEMINI_API_KEY and GEMINI_API_KEY != 'your-api-key-here':
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
else:
    model = None
    logger.warning("Gemini API key not configured. Using fallback responses.")

@dataclass
class User:
    id: str
    email: str
    name: str
    age: int
    avatar_url: Optional[str] = None
    created_at: Optional[str] = None

@dataclass
class SupplementInfo:
    id: Optional[int]
    name: str
    brand: str
    dosage_form: str
    dose_quantity: str
    dose_unit: str
    frequency: str
    times_of_day: Dict[str, List[str]]
    interactions: List[str]
    remind_me: bool
    expiration_date: str
    quantity: str
    image_url: Optional[str] = None
    user_id: Optional[str] = None
    created_at: Optional[str] = None

@dataclass
class ChatMessage:
    id: Optional[str]
    user_id: str
    sender: str  # 'user' or 'assistant'
    message: str
    timestamp: str
    context: Optional[Dict[str, Any]] = None

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
            }
        }

    async def generate_response(self, user_message: str, user_data: User, user_supplements: List[SupplementInfo], chat_history: List[ChatMessage]) -> str:
        """Generate AI response using Gemini or fallback logic"""
        try:
            if model:
                return await self._generate_gemini_response(user_message, user_data, user_supplements, chat_history)
            else:
                return self._generate_fallback_response(user_message, user_data, user_supplements)
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return self._generate_error_response(user_data.name)

    async def _generate_gemini_response(self, user_message: str, user_data: User, user_supplements: List[SupplementInfo], chat_history: List[ChatMessage]) -> str:
        """Generate response using Gemini AI"""
        system_prompt = self._generate_system_prompt(user_data, user_supplements)
        
        # Format chat history
        history_text = "\n".join([
            f"{msg.sender.upper()}: {msg.message}" for msg in chat_history[-6:]
        ])
        
        full_prompt = f"""
{system_prompt}

RECENT CONVERSATION HISTORY:
{history_text}

USER MESSAGE: {user_message}

Please provide a helpful, medically accurate response considering the user's context, age ({user_data.age}), and current supplement regimen. Always prioritize safety and recommend consulting healthcare providers when appropriate.
"""
        
        response = model.generate_content(full_prompt)
        return response.text

    def _generate_system_prompt(self, user_data: User, user_supplements: List[SupplementInfo]) -> str:
        """Generate comprehensive system prompt with medical knowledge"""
        supplements_text = self._format_supplements(user_supplements)
        
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
- Name: {user_data.name}
- Age: {user_data.age} years old
- Email: {user_data.email}
- Number of Supplements: {len(user_supplements)}

CURRENT SUPPLEMENT REGIMEN:
{supplements_text}

MEDICAL EXPERTISE AREAS:
- Drug interactions and contraindications
- Supplement benefits, side effects, and proper usage
- Medication timing optimization and food interactions
- Age-specific health considerations (especially for {user_data.age}+ adults)
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
"""

    def _format_supplements(self, supplements: List[SupplementInfo]) -> str:
        """Format supplement list for AI context"""
        if not supplements:
            return "No supplements currently tracked"
        
        formatted = []
        for supp in supplements:
            times = []
            for period, time_list in supp.times_of_day.items():
                if time_list:
                    times.extend([f"{period}: {time}" for time in time_list])
            
            times_str = ", ".join(times) if times else "No specific times set"
            interactions_str = ", ".join(supp.interactions) if supp.interactions else "None noted"
            
            formatted.append(
                f"• {supp.name} ({supp.brand}) - {supp.dose_quantity} {supp.dose_unit} {supp.dosage_form}"
                f" | Frequency: {supp.frequency} | Times: {times_str}"
                f" | Interactions: {interactions_str} | Expires: {supp.expiration_date}"
            )
        
        return "\n".join(formatted)

    def _generate_fallback_response(self, user_message: str, user_data: User, user_supplements: List[SupplementInfo]) -> str:
        """Generate intelligent fallback response when Gemini is unavailable"""
        message_lower = user_message.lower()
        user_name = user_data.name
        user_age = user_data.age

        # Greeting responses
        if any(word in message_lower for word in ['hello', 'hi', 'hey', 'good morning', 'good evening']):
            return f"""Hello {user_name}! 👋 I'm your SafeDoser AI assistant, here to help with your medication and supplement questions.

I can see you're currently managing {len(user_supplements)} supplements. At {user_age} years old, maintaining a good supplement routine is excellent for your health! 

How can I assist you today? I can help with:
💊 Supplement information and benefits
⏰ Timing and dosage guidance
🔄 Drug interaction checking
⚕️ General health questions
📋 Medication adherence tips"""

        # Default response with context
        return f"""I'd be happy to help you with that, {user_name}! I have access to comprehensive medical information and can see you're currently managing {len(user_supplements)} supplements. 

I can help you with:
💊 Supplement information and interactions
⏰ Timing and dosage guidance  
🩺 General health questions
⚠️ Side effect information
🔄 Medication adherence tips

Could you be more specific about what you'd like to know? I'm here to provide evidence-based information while always recommending you consult with your healthcare provider for personalized advice.

Note: I'm currently running in offline mode, but I can still provide helpful general information!"""

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

# Helper functions
def validate_email(email: str) -> bool:
    """Basic email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def process_image(image_data: str) -> str:
    """Process and upload image to Supabase storage"""
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes))
        
        # Resize image if too large
        max_size = (800, 800)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Convert to JPEG
        output = io.BytesIO()
        image.save(output, format='JPEG', quality=85)
        output.seek(0)
        
        # Generate unique filename
        filename = f"avatars/{uuid.uuid4()}.jpg"
        
        # Upload to Supabase storage
        result = supabase.storage.from_("user-images").upload(filename, output.getvalue())
        
        if result.error:
            logger.error(f"Image upload error: {result.error}")
            return None
        
        # Get public URL
        public_url = supabase.storage.from_("user-images").get_public_url(filename)
        return public_url.data.public_url
        
    except Exception as e:
        logger.error(f"Image processing error: {e}")
        return None

# Authentication routes
@app.route('/auth/signup', methods=['POST'])
def signup():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'name', 'age']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        name = data['name'].strip()
        age = int(data['age'])
        
        # Validate email format
        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        
        # Validate age
        if age < 13 or age > 120:
            return jsonify({"error": "Age must be between 13 and 120"}), 400
        
        # Validate password strength
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400
        
        # Check if user already exists
        existing_user = supabase.table('users').select('*').eq('email', email).execute()
        if existing_user.data:
            return jsonify({"error": "User with this email already exists"}), 409
        
        # Process avatar image if provided
        avatar_url = None
        if 'avatar' in data and data['avatar']:
            avatar_url = process_image(data['avatar'])
        
        # Hash password
        password_hash = generate_password_hash(password)
        
        # Create user in database
        user_data = {
            'id': str(uuid.uuid4()),
            'email': email,
            'password_hash': password_hash,
            'name': name,
            'age': age,
            'avatar_url': avatar_url,
            'created_at': datetime.now().isoformat()
        }
        
        result = supabase.table('users').insert(user_data).execute()
        
        if result.error:
            logger.error(f"Database error: {result.error}")
            return jsonify({"error": "Failed to create user"}), 500
        
        # Create JWT tokens
        user_id = user_data['id']
        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)
        
        # Return user data (without password hash)
        user_response = {
            'id': user_data['id'],
            'email': user_data['email'],
            'name': user_data['name'],
            'age': user_data['age'],
            'avatar_url': user_data['avatar_url']
        }
        
        return jsonify({
            "message": "User created successfully",
            "user": user_response,
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 201
        
    except ValueError as e:
        return jsonify({"error": "Invalid age format"}), 400
    except Exception as e:
        logger.error(f"Signup error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"error": "Email and password are required"}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        
        # Find user in database
        result = supabase.table('users').select('*').eq('email', email).execute()
        
        if not result.data:
            return jsonify({"error": "Invalid email or password"}), 401
        
        user_data = result.data[0]
        
        # Check password
        if not check_password_hash(user_data['password_hash'], password):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Create JWT tokens
        user_id = user_data['id']
        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)
        
        # Return user data (without password hash)
        user_response = {
            'id': user_data['id'],
            'email': user_data['email'],
            'name': user_data['name'],
            'age': user_data['age'],
            'avatar_url': user_data['avatar_url']
        }
        
        return jsonify({
            "message": "Login successful",
            "user": user_response,
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 200
        
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        current_user_id = get_jwt_identity()
        new_token = create_access_token(identity=current_user_id)
        
        return jsonify({
            "access_token": new_token
        }), 200
        
    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/auth/forgot-password', methods=['POST'])
def forgot_password():
    """Password reset request endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({"error": "Email is required"}), 400
        
        email = data['email'].strip().lower()
        
        # Check if user exists
        result = supabase.table('users').select('id, email').eq('email', email).execute()
        
        if not result.data:
            # Don't reveal if email exists or not for security
            return jsonify({"message": "If the email exists, a reset link has been sent"}), 200
        
        # In a real implementation, you would:
        # 1. Generate a secure reset token
        # 2. Store it in the database with expiration
        # 3. Send an email with the reset link
        
        # For now, just return success
        return jsonify({"message": "If the email exists, a reset link has been sent"}), 200
        
    except Exception as e:
        logger.error(f"Forgot password error: {e}")
        return jsonify({"error": "Internal server error"}), 500

# Protected routes
@app.route('/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        
        result = supabase.table('users').select('id, email, name, age, avatar_url, created_at').eq('id', user_id).execute()
        
        if not result.data:
            return jsonify({"error": "User not found"}), 404
        
        user_data = result.data[0]
        
        return jsonify({
            "user": user_data
        }), 200
        
    except Exception as e:
        logger.error(f"Get profile error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/user/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    """Update user profile"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Prepare update data
        update_data = {}
        
        if 'name' in data:
            update_data['name'] = data['name'].strip()
        
        if 'age' in data:
            age = int(data['age'])
            if age < 13 or age > 120:
                return jsonify({"error": "Age must be between 13 and 120"}), 400
            update_data['age'] = age
        
        if 'avatar' in data and data['avatar']:
            avatar_url = process_image(data['avatar'])
            if avatar_url:
                update_data['avatar_url'] = avatar_url
        
        if not update_data:
            return jsonify({"error": "No valid fields to update"}), 400
        
        # Update user in database
        result = supabase.table('users').update(update_data).eq('id', user_id).execute()
        
        if result.error:
            logger.error(f"Database error: {result.error}")
            return jsonify({"error": "Failed to update profile"}), 500
        
        return jsonify({"message": "Profile updated successfully"}), 200
        
    except ValueError as e:
        return jsonify({"error": "Invalid age format"}), 400
    except Exception as e:
        logger.error(f"Update profile error: {e}")
        return jsonify({"error": "Internal server error"}), 500

# Supplement routes
@app.route('/supplements', methods=['GET'])
@jwt_required()
def get_supplements():
    """Get user's supplements"""
    try:
        user_id = get_jwt_identity()
        
        result = supabase.table('supplements').select('*').eq('user_id', user_id).execute()
        
        supplements = []
        for supp_data in result.data:
            # Parse times_of_day JSON
            times_of_day = json.loads(supp_data['times_of_day']) if supp_data['times_of_day'] else {}
            interactions = json.loads(supp_data['interactions']) if supp_data['interactions'] else []
            
            supplement = SupplementInfo(
                id=supp_data['id'],
                name=supp_data['name'],
                brand=supp_data['brand'],
                dosage_form=supp_data['dosage_form'],
                dose_quantity=supp_data['dose_quantity'],
                dose_unit=supp_data['dose_unit'],
                frequency=supp_data['frequency'],
                times_of_day=times_of_day,
                interactions=interactions,
                remind_me=supp_data['remind_me'],
                expiration_date=supp_data['expiration_date'],
                quantity=supp_data['quantity'],
                image_url=supp_data['image_url'],
                user_id=supp_data['user_id'],
                created_at=supp_data['created_at']
            )
            supplements.append(asdict(supplement))
        
        return jsonify({
            "supplements": supplements
        }), 200
        
    except Exception as e:
        logger.error(f"Get supplements error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/supplements', methods=['POST'])
@jwt_required()
def create_supplement():
    """Create a new supplement"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'brand', 'dosage_form', 'dose_quantity', 'dose_unit', 'frequency', 'expiration_date', 'quantity']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Process image if provided
        image_url = None
        if 'image' in data and data['image']:
            image_url = process_image(data['image'])
        
        # Prepare supplement data
        supplement_data = {
            'user_id': user_id,
            'name': data['name'].strip(),
            'brand': data['brand'].strip(),
            'dosage_form': data['dosage_form'],
            'dose_quantity': data['dose_quantity'],
            'dose_unit': data['dose_unit'],
            'frequency': data['frequency'],
            'times_of_day': json.dumps(data.get('times_of_day', {})),
            'interactions': json.dumps(data.get('interactions', [])),
            'remind_me': data.get('remind_me', True),
            'expiration_date': data['expiration_date'],
            'quantity': data['quantity'],
            'image_url': image_url,
            'created_at': datetime.now().isoformat()
        }
        
        result = supabase.table('supplements').insert(supplement_data).execute()
        
        if result.error:
            logger.error(f"Database error: {result.error}")
            return jsonify({"error": "Failed to create supplement"}), 500
        
        return jsonify({
            "message": "Supplement created successfully",
            "supplement": result.data[0]
        }), 201
        
    except Exception as e:
        logger.error(f"Create supplement error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/supplements/<int:supplement_id>', methods=['PUT'])
@jwt_required()
def update_supplement(supplement_id: int):
    """Update a supplement"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Check if supplement belongs to user
        existing = supabase.table('supplements').select('*').eq('id', supplement_id).eq('user_id', user_id).execute()
        
        if not existing.data:
            return jsonify({"error": "Supplement not found"}), 404
        
        # Prepare update data
        update_data = {}
        
        allowed_fields = ['name', 'brand', 'dosage_form', 'dose_quantity', 'dose_unit', 'frequency', 'expiration_date', 'quantity', 'remind_me']
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        if 'times_of_day' in data:
            update_data['times_of_day'] = json.dumps(data['times_of_day'])
        
        if 'interactions' in data:
            update_data['interactions'] = json.dumps(data['interactions'])
        
        if 'image' in data and data['image']:
            image_url = process_image(data['image'])
            if image_url:
                update_data['image_url'] = image_url
        
        if not update_data:
            return jsonify({"error": "No valid fields to update"}), 400
        
        result = supabase.table('supplements').update(update_data).eq('id', supplement_id).eq('user_id', user_id).execute()
        
        if result.error:
            logger.error(f"Database error: {result.error}")
            return jsonify({"error": "Failed to update supplement"}), 500
        
        return jsonify({
            "message": "Supplement updated successfully",
            "supplement": result.data[0]
        }), 200
        
    except Exception as e:
        logger.error(f"Update supplement error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/supplements/<int:supplement_id>', methods=['DELETE'])
@jwt_required()
def delete_supplement(supplement_id: int):
    """Delete a supplement"""
    try:
        user_id = get_jwt_identity()
        
        # Check if supplement belongs to user
        existing = supabase.table('supplements').select('*').eq('id', supplement_id).eq('user_id', user_id).execute()
        
        if not existing.data:
            return jsonify({"error": "Supplement not found"}), 404
        
        result = supabase.table('supplements').delete().eq('id', supplement_id).eq('user_id', user_id).execute()
        
        if result.error:
            logger.error(f"Database error: {result.error}")
            return jsonify({"error": "Failed to delete supplement"}), 500
        
        return jsonify({"message": "Supplement deleted successfully"}), 200
        
    except Exception as e:
        logger.error(f"Delete supplement error: {e}")
        return jsonify({"error": "Internal server error"}), 500

# Chat routes
@app.route('/chat', methods=['POST'])
@jwt_required()
async def chat():
    """Chat with AI assistant"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({"error": "Message is required"}), 400
        
        user_message = data['message'].strip()
        if not user_message:
            return jsonify({"error": "Message cannot be empty"}), 400
        
        # Get user data
        user_result = supabase.table('users').select('*').eq('id', user_id).execute()
        if not user_result.data:
            return jsonify({"error": "User not found"}), 404
        
        user_data = User(**user_result.data[0])
        
        # Get user supplements
        supplements_result = supabase.table('supplements').select('*').eq('user_id', user_id).execute()
        user_supplements = []
        
        for supp_data in supplements_result.data:
            times_of_day = json.loads(supp_data['times_of_day']) if supp_data['times_of_day'] else {}
            interactions = json.loads(supp_data['interactions']) if supp_data['interactions'] else []
            
            supplement = SupplementInfo(
                id=supp_data['id'],
                name=supp_data['name'],
                brand=supp_data['brand'],
                dosage_form=supp_data['dosage_form'],
                dose_quantity=supp_data['dose_quantity'],
                dose_unit=supp_data['dose_unit'],
                frequency=supp_data['frequency'],
                times_of_day=times_of_day,
                interactions=interactions,
                remind_me=supp_data['remind_me'],
                expiration_date=supp_data['expiration_date'],
                quantity=supp_data['quantity'],
                image_url=supp_data['image_url'],
                user_id=supp_data['user_id'],
                created_at=supp_data['created_at']
            )
            user_supplements.append(supplement)
        
        # Get recent chat history
        history_result = supabase.table('chat_messages').select('*').eq('user_id', user_id).order('timestamp', desc=True).limit(10).execute()
        
        chat_history = []
        for msg_data in history_result.data:
            message = ChatMessage(
                id=msg_data['id'],
                user_id=msg_data['user_id'],
                sender=msg_data['sender'],
                message=msg_data['message'],
                timestamp=msg_data['timestamp'],
                context=json.loads(msg_data['context']) if msg_data['context'] else None
            )
            chat_history.append(message)
        
        chat_history.reverse()  # Reverse to get chronological order
        
        # Save user message
        user_msg_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'sender': 'user',
            'message': user_message,
            'timestamp': datetime.now().isoformat(),
            'context': json.dumps({
                'supplements_count': len(user_supplements),
                'user_age': user_data.age
            })
        }
        
        supabase.table('chat_messages').insert(user_msg_data).execute()
        
        # Generate AI response
        ai_response = await medical_ai.generate_response(user_message, user_data, user_supplements, chat_history)
        
        # Save AI response
        ai_msg_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'sender': 'assistant',
            'message': ai_response,
            'timestamp': datetime.now().isoformat(),
            'context': json.dumps({
                'model_used': 'gemini-pro' if model else 'fallback',
                'supplements_count': len(user_supplements)
            })
        }
        
        supabase.table('chat_messages').insert(ai_msg_data).execute()
        
        return jsonify({
            "reply": ai_response,
            "timestamp": datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return jsonify({
            "reply": "I'm experiencing technical difficulties. Please try again or contact your healthcare provider for immediate assistance.",
            "error": "Internal server error"
        }), 500

@app.route('/chat/history', methods=['GET'])
@jwt_required()
def get_chat_history():
    """Get user's chat history"""
    try:
        user_id = get_jwt_identity()
        limit = request.args.get('limit', 50, type=int)
        
        result = supabase.table('chat_messages').select('*').eq('user_id', user_id).order('timestamp', desc=True).limit(limit).execute()
        
        messages = []
        for msg_data in result.data:
            message = {
                'id': msg_data['id'],
                'sender': msg_data['sender'],
                'text': msg_data['message'],  # Frontend expects 'text' field
                'timestamp': msg_data['timestamp']
            }
            messages.append(message)
        
        messages.reverse()  # Return in chronological order
        
        return jsonify({
            "messages": messages
        }), 200
        
    except Exception as e:
        logger.error(f"Get chat history error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/chat/clear', methods=['DELETE'])
@jwt_required()
def clear_chat_history():
    """Clear user's chat history"""
    try:
        user_id = get_jwt_identity()
        
        result = supabase.table('chat_messages').delete().eq('user_id', user_id).execute()
        
        if result.error:
            logger.error(f"Database error: {result.error}")
            return jsonify({"error": "Failed to clear chat history"}), 500
        
        return jsonify({"message": "Chat history cleared successfully"}), 200
        
    except Exception as e:
        logger.error(f"Clear chat history error: {e}")
        return jsonify({"error": "Internal server error"}), 500

# Health check
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "gemini_configured": model is not None,
        "supabase_configured": SUPABASE_URL != 'https://your-project.supabase.co'
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": "Token has expired"}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({"error": "Invalid token"}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({"error": "Authorization token is required"}), 401

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info(f"Starting SafeDoser API server on port {port}")
    logger.info(f"Gemini AI configured: {model is not None}")
    logger.info(f"Supabase configured: {SUPABASE_URL != 'https://your-project.supabase.co'}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)