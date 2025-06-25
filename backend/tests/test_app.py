import pytest
import json
from app import app, medical_ai

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def sample_context():
    return {
        "userName": "TestUser",
        "userAge": 45,
        "supplements": [
            {
                "name": "Vitamin D3",
                "time": "08:00",
                "tags": ["#Morning", "#Bone"],
                "type": "softgel",
                "completed": False,
                "muted": False,
                "alerts": []
            }
        ],
        "currentTime": "2024-01-15T10:30:00Z"
    }

def test_health_check(client):
    """Test health check endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data['status'] == 'healthy'
    assert 'timestamp' in data
    assert 'gemini_configured' in data

def test_chat_endpoint_valid_request(client, sample_context):
    """Test chat endpoint with valid request"""
    request_data = {
        "message": "What are the benefits of Vitamin D?",
        "context": sample_context,
        "chatHistory": []
    }
    
    response = client.post('/chat', 
                          data=json.dumps(request_data),
                          content_type='application/json')
    
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert 'reply' in data
    assert 'timestamp' in data
    assert data['status'] == 'success'
    assert len(data['reply']) > 0

def test_chat_endpoint_missing_message(client, sample_context):
    """Test chat endpoint with missing message"""
    request_data = {
        "context": sample_context
    }
    
    response = client.post('/chat',
                          data=json.dumps(request_data),
                          content_type='application/json')
    
    assert response.status_code == 400
    
    data = json.loads(response.data)
    assert 'error' in data

def test_chat_endpoint_empty_message(client, sample_context):
    """Test chat endpoint with empty message"""
    request_data = {
        "message": "",
        "context": sample_context
    }
    
    response = client.post('/chat',
                          data=json.dumps(request_data),
                          content_type='application/json')
    
    assert response.status_code == 400

def test_supplement_info_endpoint(client):
    """Test supplement info endpoint"""
    response = client.get('/supplement-info/vitamin_d3?age=45')
    
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert 'supplement' in data
    assert 'info' in data
    assert 'timestamp' in data

def test_medical_ai_supplement_info():
    """Test medical AI supplement info functionality"""
    info = medical_ai.get_supplement_info("Vitamin D3", 45)
    
    assert 'benefits' in info
    assert 'side_effects' in info
    assert 'interactions' in info
    assert 'timing' in info
    
    assert len(info['benefits']) > 0
    assert isinstance(info['benefits'], list)

def test_medical_ai_fallback_response():
    """Test medical AI fallback response generation"""
    from app import UserContext, SupplementInfo
    
    context = UserContext(
        userName="TestUser",
        userAge=45,
        supplements=[
            SupplementInfo(
                name="Vitamin D3",
                time="08:00",
                tags=["#Morning"],
                type="softgel",
                completed=False,
                muted=False
            )
        ],
        currentTime="2024-01-15T10:30:00Z"
    )
    
    response = medical_ai._generate_fallback_response("Hello", context)
    
    assert len(response) > 0
    assert "TestUser" in response
    assert "45" in response or "age" in response.lower()

def test_chat_history_endpoint(client):
    """Test chat history endpoint"""
    response = client.get('/chat-history')
    
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert isinstance(data, list)

if __name__ == '__main__':
    pytest.main([__file__])