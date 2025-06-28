"""
Database module for SafeDoser backend
Handles all database operations using Supabase
"""

import os
import logging
from datetime import datetime, date
from typing import Optional, Dict, Any, List
import json
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
logger = logging.getLogger(__name__)

class Database:
    """Database service for SafeDoser using Supabase"""
    
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_ANON_KEY")
        self.supabase: Optional[Client] = None
        
        if not self.supabase_url or not self.supabase_key:
            logger.error("Missing Supabase configuration")
            raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set")
    
    async def initialize(self):
        """Initialize database connection"""
        try:
            self.supabase = create_client(self.supabase_url, self.supabase_key)
            logger.info("Database initialized successfully")
        except Exception as e:
            logger.error(f"Database initialization failed: {str(e)}")
            raise
    
    async def close(self):
        """Close database connection"""
        # Supabase client doesn't need explicit closing
        logger.info("Database connection closed")
    
    def _serialize_for_json(self, data: Any) -> Any:
        """Convert data types that aren't JSON serializable"""
        if isinstance(data, dict):
            return {key: self._serialize_for_json(value) for key, value in data.items()}
        elif isinstance(data, list):
            return [self._serialize_for_json(item) for item in data]
        elif isinstance(data, date):
            return data.isoformat()
        elif isinstance(data, datetime):
            return data.isoformat()
        else:
            return data
    
    def _prepare_supplement_data(self, supplement_data: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare supplement data for database insertion"""
        logger.debug(f"Preparing supplement data: {supplement_data}")
        
        # Create a copy to avoid modifying the original
        prepared_data = supplement_data.copy()
        
        # Handle times_of_day - convert to JSON string if it's a dict
        if 'times_of_day' in prepared_data:
            times_data = prepared_data['times_of_day']
            logger.debug(f"Original times_of_day type: {type(times_data)}, value: {times_data}")
            
            if isinstance(times_data, dict):
                # Convert datetime objects to ISO strings
                serialized_times = {}
                for period, times_list in times_data.items():
                    if isinstance(times_list, list):
                        serialized_times[period] = [
                            time.isoformat() if isinstance(time, (datetime, date)) else str(time)
                            for time in times_list
                        ]
                    else:
                        serialized_times[period] = times_list
                
                prepared_data['times_of_day'] = json.dumps(serialized_times)
                logger.debug(f"Serialized times_of_day: {prepared_data['times_of_day']}")
        
        # Handle interactions - convert to JSON string if it's a list
        if 'interactions' in prepared_data:
            interactions = prepared_data['interactions']
            logger.debug(f"Original interactions type: {type(interactions)}, value: {interactions}")
            
            if isinstance(interactions, list):
                prepared_data['interactions'] = json.dumps(interactions)
                logger.debug(f"Serialized interactions: {prepared_data['interactions']}")
        
        # Handle expiration_date - ensure it's a string
        if 'expiration_date' in prepared_data:
            exp_date = prepared_data['expiration_date']
            logger.debug(f"Original expiration_date type: {type(exp_date)}, value: {exp_date}")
            
            if isinstance(exp_date, (datetime, date)):
                prepared_data['expiration_date'] = exp_date.isoformat()
            elif exp_date is not None:
                prepared_data['expiration_date'] = str(exp_date)
            
            logger.debug(f"Prepared expiration_date: {prepared_data['expiration_date']}")
        
        # Ensure all other fields are properly serialized
        prepared_data = self._serialize_for_json(prepared_data)
        
        logger.debug(f"Final prepared supplement data: {prepared_data}")
        return prepared_data
    
    # User operations
    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user"""
        try:
            logger.debug(f"Creating user with data: {user_data}")
            
            # Serialize the data
            serialized_data = self._serialize_for_json(user_data)
            
            result = self.supabase.table("users").insert(serialized_data).execute()
            
            if result.data:
                logger.info(f"User created successfully: {result.data[0]['id']}")
                return result.data[0]
            else:
                logger.error("Failed to create user: No data returned")
                raise Exception("Failed to create user")
                
        except Exception as e:
            logger.error(f"Create user error: {str(e)}")
            raise
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        try:
            logger.debug(f"Getting user by email: {email}")
            
            result = self.supabase.table("users").select("*").eq("email", email).execute()
            
            if result.data:
                logger.debug(f"User found: {result.data[0]['id']}")
                return result.data[0]
            else:
                logger.debug(f"No user found with email: {email}")
                return None
                
        except Exception as e:
            logger.error(f"Get user by email error: {str(e)}")
            raise
    
    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        try:
            logger.debug(f"Getting user by ID: {user_id}")
            
            result = self.supabase.table("users").select("*").eq("id", user_id).execute()
            
            if result.data:
                logger.debug(f"User found: {result.data[0]['id']}")
                return result.data[0]
            else:
                logger.debug(f"No user found with ID: {user_id}")
                return None
                
        except Exception as e:
            logger.error(f"Get user by ID error: {str(e)}")
            raise
    
    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update user data"""
        try:
            logger.debug(f"Updating user {user_id} with data: {update_data}")
            
            # Add updated_at timestamp
            update_data["updated_at"] = datetime.utcnow().isoformat()
            
            # Serialize the data
            serialized_data = self._serialize_for_json(update_data)
            
            result = self.supabase.table("users").update(serialized_data).eq("id", user_id).execute()
            
            if result.data:
                logger.info(f"User updated successfully: {user_id}")
                return result.data[0]
            else:
                logger.error(f"Failed to update user: {user_id}")
                raise Exception("Failed to update user")
                
        except Exception as e:
            logger.error(f"Update user error: {str(e)}")
            raise
    
    # Supplement operations
    async def create_supplement(self, user_id: str, supplement_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new supplement"""
        try:
            logger.info(f"Creating supplement for user {user_id}")
            logger.debug(f"Raw supplement data: {supplement_data}")
            
            # Add user_id and timestamps
            supplement_data["user_id"] = user_id
            supplement_data["created_at"] = datetime.utcnow().isoformat()
            supplement_data["updated_at"] = datetime.utcnow().isoformat()
            
            # Prepare data for database insertion
            prepared_data = self._prepare_supplement_data(supplement_data)
            
            logger.debug(f"Inserting supplement data into database: {prepared_data}")
            
            result = self.supabase.table("supplements").insert(prepared_data).execute()
            
            if result.data:
                created_supplement = result.data[0]
                logger.info(f"Supplement created successfully: {created_supplement['id']}")
                logger.debug(f"Created supplement data: {created_supplement}")
                return created_supplement
            else:
                logger.error("Failed to create supplement: No data returned")
                raise Exception("Failed to create supplement")
                
        except Exception as e:
            logger.error(f"Create supplement error: {str(e)}")
            logger.error(f"Failed supplement data: {supplement_data}")
            raise
    
    async def get_user_supplements(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all supplements for a user"""
        try:
            logger.debug(f"Getting supplements for user: {user_id}")
            
            result = self.supabase.table("supplements").select("*").eq("user_id", user_id).order("created_at", desc=False).execute()
            
            supplements = result.data or []
            logger.debug(f"Found {len(supplements)} supplements for user {user_id}")
            
            # Parse JSON fields
            for supplement in supplements:
                if supplement.get('times_of_day') and isinstance(supplement['times_of_day'], str):
                    try:
                        supplement['times_of_day'] = json.loads(supplement['times_of_day'])
                    except json.JSONDecodeError:
                        logger.warning(f"Failed to parse times_of_day for supplement {supplement['id']}")
                        supplement['times_of_day'] = {}
                
                if supplement.get('interactions') and isinstance(supplement['interactions'], str):
                    try:
                        supplement['interactions'] = json.loads(supplement['interactions'])
                    except json.JSONDecodeError:
                        logger.warning(f"Failed to parse interactions for supplement {supplement['id']}")
                        supplement['interactions'] = []
            
            return supplements
            
        except Exception as e:
            logger.error(f"Get user supplements error: {str(e)}")
            raise
    
    async def get_supplement_by_id(self, supplement_id: int) -> Optional[Dict[str, Any]]:
        """Get supplement by ID"""
        try:
            logger.debug(f"Getting supplement by ID: {supplement_id}")
            
            result = self.supabase.table("supplements").select("*").eq("id", supplement_id).execute()
            
            if result.data:
                supplement = result.data[0]
                logger.debug(f"Supplement found: {supplement['id']}")
                
                # Parse JSON fields
                if supplement.get('times_of_day') and isinstance(supplement['times_of_day'], str):
                    try:
                        supplement['times_of_day'] = json.loads(supplement['times_of_day'])
                    except json.JSONDecodeError:
                        logger.warning(f"Failed to parse times_of_day for supplement {supplement['id']}")
                        supplement['times_of_day'] = {}
                
                if supplement.get('interactions') and isinstance(supplement['interactions'], str):
                    try:
                        supplement['interactions'] = json.loads(supplement['interactions'])
                    except json.JSONDecodeError:
                        logger.warning(f"Failed to parse interactions for supplement {supplement['id']}")
                        supplement['interactions'] = []
                
                return supplement
            else:
                logger.debug(f"No supplement found with ID: {supplement_id}")
                return None
                
        except Exception as e:
            logger.error(f"Get supplement by ID error: {str(e)}")
            raise
    
    async def update_supplement(self, supplement_id: int, update_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update supplement data"""
        try:
            logger.info(f"Updating supplement {supplement_id}")
            logger.debug(f"Update data: {update_data}")
            
            # Add updated_at timestamp
            update_data["updated_at"] = datetime.utcnow().isoformat()
            
            # Prepare data for database update
            prepared_data = self._prepare_supplement_data(update_data)
            
            logger.debug(f"Prepared update data: {prepared_data}")
            
            result = self.supabase.table("supplements").update(prepared_data).eq("id", supplement_id).execute()
            
            if result.data:
                updated_supplement = result.data[0]
                logger.info(f"Supplement updated successfully: {supplement_id}")
                
                # Parse JSON fields for return
                if updated_supplement.get('times_of_day') and isinstance(updated_supplement['times_of_day'], str):
                    try:
                        updated_supplement['times_of_day'] = json.loads(updated_supplement['times_of_day'])
                    except json.JSONDecodeError:
                        logger.warning(f"Failed to parse times_of_day for updated supplement {supplement_id}")
                        updated_supplement['times_of_day'] = {}
                
                if updated_supplement.get('interactions') and isinstance(updated_supplement['interactions'], str):
                    try:
                        updated_supplement['interactions'] = json.loads(updated_supplement['interactions'])
                    except json.JSONDecodeError:
                        logger.warning(f"Failed to parse interactions for updated supplement {supplement_id}")
                        updated_supplement['interactions'] = []
                
                return updated_supplement
            else:
                logger.error(f"Failed to update supplement: {supplement_id}")
                raise Exception("Failed to update supplement")
                
        except Exception as e:
            logger.error(f"Update supplement error: {str(e)}")
            logger.error(f"Failed update data: {update_data}")
            raise
    
    async def delete_supplement(self, supplement_id: int) -> bool:
        """Delete a supplement"""
        try:
            logger.info(f"Deleting supplement: {supplement_id}")
            
            result = self.supabase.table("supplements").delete().eq("id", supplement_id).execute()
            
            if result.data:
                logger.info(f"Supplement deleted successfully: {supplement_id}")
                return True
            else:
                logger.warning(f"No supplement found to delete: {supplement_id}")
                return False
                
        except Exception as e:
            logger.error(f"Delete supplement error: {str(e)}")
            raise
    
    # Chat operations
    async def save_chat_message(self, user_id: str, sender: str, message: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Save a chat message"""
        try:
            logger.debug(f"Saving chat message for user {user_id}, sender: {sender}")
            
            message_data = {
                "user_id": user_id,
                "sender": sender,
                "message": message,
                "context": json.dumps(context) if context else None,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            result = self.supabase.table("chat_messages").insert(message_data).execute()
            
            if result.data:
                logger.debug(f"Chat message saved: {result.data[0]['id']}")
                return result.data[0]
            else:
                logger.error("Failed to save chat message")
                raise Exception("Failed to save chat message")
                
        except Exception as e:
            logger.error(f"Save chat message error: {str(e)}")
            raise
    
    async def get_chat_history(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get chat history for a user"""
        try:
            logger.debug(f"Getting chat history for user {user_id}, limit: {limit}")
            
            result = self.supabase.table("chat_messages").select("*").eq("user_id", user_id).order("timestamp", desc=True).limit(limit).execute()
            
            messages = result.data or []
            # Reverse to get chronological order
            messages.reverse()
            
            logger.debug(f"Found {len(messages)} chat messages for user {user_id}")
            
            # Parse context JSON
            for message in messages:
                if message.get('context') and isinstance(message['context'], str):
                    try:
                        message['context'] = json.loads(message['context'])
                    except json.JSONDecodeError:
                        logger.warning(f"Failed to parse context for message {message['id']}")
                        message['context'] = {}
            
            return messages
            
        except Exception as e:
            logger.error(f"Get chat history error: {str(e)}")
            raise
    
    async def clear_chat_history(self, user_id: str) -> bool:
        """Clear chat history for a user"""
        try:
            logger.info(f"Clearing chat history for user: {user_id}")
            
            result = self.supabase.table("chat_messages").delete().eq("user_id", user_id).execute()
            
            deleted_count = len(result.data) if result.data else 0
            logger.info(f"Cleared {deleted_count} chat messages for user {user_id}")
            
            return True
            
        except Exception as e:
            logger.error(f"Clear chat history error: {str(e)}")
            raise

# Dependency to get database instance
async def get_database() -> Database:
    """Get database instance"""
    # In a real application, you might want to use dependency injection
    # For now, we'll create a new instance each time
    db = Database()
    await db.initialize()
    return db