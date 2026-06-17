"""
Islamic Inheritance Calculator - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Dict, Any
import json

from .models import (
    InheritanceInput,
    InheritanceResult,
    ChatbotQuery,
    ChatbotResponse,
    RelativeType,
    RelativeInfo,
    FatwaSource
)
from .inheritance_engine import InheritanceEngine
from .database import init_db
from .auth_routes import router as auth_router

# Initialize database
init_db()

# Initialize FastAPI app
app = FastAPI(
    title="Islamic Inheritance Calculator API",
    description="Calculate Islamic inheritance shares following Hanafi jurisprudence",
    version="1.0.0"
)

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication routes
app.include_router(auth_router)

# Initialize inheritance engine
engine = InheritanceEngine()

# Test case data
TEST_CASES = {
    "test_case_1": {
        "description": "Wife and Son",
        "relatives": [
            {"relative_type": "wife", "count": 1},
            {"relative_type": "son", "count": 1}
        ]
    },
    "test_case_2": {
        "description": "Husband, Mother, and Maternal Brother",
        "relatives": [
            {"relative_type": "husband", "count": 1},
            {"relative_type": "mother", "count": 1},
            {"relative_type": "maternal_brother", "count": 1}
        ]
    },
    "test_case_3": {
        "description": "Daughter and Full Sister",
        "relatives": [
            {"relative_type": "daughter", "count": 1},
            {"relative_type": "full_sister", "count": 2}
        ]
    },
}

# Fatwa sources
FATWA_SOURCES = [
    {
        "name": "Darul Ifta, Darul Uloom Deoband",
        "institution": "Darul Uloom Deoband",
        "url": "https://darulifta-deoband.com/en",
        "language": "en",
        "description": "English Fatwas from Darul Ifta Deoband"
    },
    {
        "name": "Darul Ifta, Darul Uloom Deoband (Urdu)",
        "institution": "Darul Uloom Deoband",
        "url": "https://darulifta-deoband.com/",
        "language": "ur",
        "description": "Urdu Fatwas from Darul Ifta Deoband"
    },
    {
        "name": "Darul Ifta Jamia Binoria",
        "institution": "Jamia Binoria",
        "url": "https://www.onlinefatawa.com/EnglishFatwa",
        "language": "en",
        "description": "English Fatwas from Jamia Binoria"
    },
    {
        "name": "Darul Ifta Jamia Binoria (Urdu)",
        "institution": "Jamia Binoria",
        "url": "https://www.onlinefatawa.com/",
        "language": "ur",
        "description": "Urdu Fatwas from Jamia Binoria"
    },
    {
        "name": "Darul Ifta, Jamia Darululoom Karachi",
        "institution": "Jamia Darululoom Karachi",
        "url": "https://onlinedarulifta.com/",
        "language": "en",
        "description": "Fatwas from Jamia Darululoom Karachi"
    }
]

# Simple chatbot knowledge base for test cases
CHATBOT_KNOWLEDGE = {
    "inheritance_general": """
Islamic inheritance (Meerath) is based on the Qur'an and Sunnah. The main principles are:

1. **Prescribed Shares (Al-Furud)**: Certain relatives have fixed shares:
   - Husband: 1/2 (if no children) or 1/4 (if children)
   - Wife: 1/4 (if no children) or 1/8 (if children)
   - Daughter: 1/2 (alone) or 2/3 (multiple)
   - Mother: 1/3 (if no siblings) or 1/6 (if siblings/children)
   - Father: 1/6 (if children) or residue

2. **Residuary (Al-Asaba)**: Remaining estate after prescribed shares
   - Typically males in direct line (sons, then father, then brothers)

3. **Degrees of Proximity**: Only closest relatives inherit
   - Children before grandchildren
   - Parents before grandparents
   - Full siblings before half-siblings

4. **Important Notes**:
   - Non-Muslims cannot inherit
   - Illegitimate children cannot inherit
   - Murderers cannot inherit
   - Adopted children are not automatic heirs
""",
    "test_case_explanation": """
Test cases demonstrate various inheritance scenarios:

**Test Case 1 (Wife, Son)**: Wife gets 1/8, Son gets remainder (7/8)
- Basis: Qur'an 4:11-12, wife's share reduced by presence of children

**Test Case 2 (Husband, Mother, Maternal Brother)**: Husband 1/2, Mother 1/3, Maternal Brother gets remainder
- Basis: Mother's share is 1/3 when no children but siblings present

**Test Case 3 (Daughter, Full Sisters)**: Daughter 1/2, Sisters 1/6 in total
- Basis: Daughter gets prescribed share, sisters get remainder if any
""",
    "general_ruling": """
General rulings on Islamic inheritance:

1. **Eligibility**: Must be Muslim, alive at death of deceased, born before death
2. **Impediments to Inheritance**:
   - Being a non-believer
   - Murder/intentional killing of deceased
   - Slavery (though abolished in modern times)
3. **Conditions for Full Share**:
   - Legal marriage (not secret/invalid)
   - Legitimate birth
   - Not under guardianship restrictions
4. **Distribution Method**:
   - Calculate prescribed shares first
   - Distribute remainder to residuaries
   - If no residuaries, return to public treasury (Bayt-ul-Maal)
"""
}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Islamic Inheritance Calculator API",
        "version": "1.0.0",
        "endpoints": {
            "calculate": "/calculate",
            "test_cases": "/test-cases",
            "test_case_detail": "/test-cases/{test_case_id}",
            "fatwa_sources": "/fatwa-sources",
            "chatbot": "/chatbot"
        }
    }


@app.post("/calculate", response_model=InheritanceResult)
async def calculate_inheritance(data: InheritanceInput):
    """
    Calculate inheritance distribution
    
    Takes the total estate value and list of surviving relatives,
    returns detailed share distribution following Hanafi rules.
    """
    try:
        result = engine.calculate_inheritance(data.total_estate, data.relatives)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")


@app.get("/test-cases")
async def get_test_cases():
    """Get list of all test cases"""
    return {
        "test_cases": [
            {
                "id": test_id,
                "description": data["description"],
                "num_relatives": len(data["relatives"])
            }
            for test_id, data in TEST_CASES.items()
        ]
    }


@app.get("/test-cases/{test_case_id}")
async def get_test_case(test_case_id: str):
    """Get specific test case details and calculate result"""
    if test_case_id not in TEST_CASES:
        raise HTTPException(status_code=404, detail="Test case not found")
    
    case_data = TEST_CASES[test_case_id]
    
    # Convert to RelativeInfo objects
    relatives = [
        RelativeInfo(**r) for r in case_data["relatives"]
    ]
    
    # Calculate with sample estate value
    sample_estate = 100000  # For demonstration
    result = engine.calculate_inheritance(sample_estate, relatives)
    
    return {
        "test_case_id": test_case_id,
        "description": case_data["description"],
        "sample_estate": sample_estate,
        "result": result
    }


@app.get("/fatwa-sources")
async def get_fatwa_sources(language: str = "en"):
    """
    Get list of Fatwa sources (Darul Iftas)
    
    Query parameters:
    - language: 'en' for English, 'ur' for Urdu, 'all' for all
    """
    if language == "all":
        return {"fatwa_sources": FATWA_SOURCES}
    
    filtered = [s for s in FATWA_SOURCES if s["language"] == language or language == "all"]
    return {"fatwa_sources": filtered}


@app.post("/chatbot")
async def chatbot_query(query: ChatbotQuery) -> ChatbotResponse:
    """
    Simple chatbot for inheritance explanations
    
    Supports contexts:
    - inheritance_general: General inheritance rules
    - test_case_explanation: Explanation of specific test cases
    - general_ruling: Islamic rulings on inheritance
    """
    context = query.context or "inheritance_general"
    
    # Simple knowledge base lookup
    knowledge = CHATBOT_KNOWLEDGE.get(context, "")
    
    if not knowledge:
        return ChatbotResponse(
            response="I don't have information about that topic. Please try: inheritance_general, test_case_explanation, or general_ruling",
            references=[]
        )
    
    # Simple response based on knowledge base
    response_text = f"Based on {context}:\n\n{knowledge}"
    
    # Truncate if too long
    if len(response_text) > 1000:
        response_text = response_text[:1000] + "...\n\nFor more detailed information, please consult the Fatwa sources."
    
    return ChatbotResponse(
        response=response_text,
        related_rules=["Qur'an 4:11", "Qur'an 4:12"],
        references=["Fiqh al-Meerath (Islamic Inheritance Law)", "Hanafi School Jurisprudence"]
    )


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Islamic Inheritance Calculator API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
