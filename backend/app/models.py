"""
Islamic Inheritance (Meerath) Models - Hanafi School
Based on Quranic verses and Hanafi jurisprudence
"""

from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, validator


class RelativeType(str, Enum):
    """All 29 relative types in Islamic inheritance"""
    # Spouses
    HUSBAND = "husband"
    WIFE = "wife"
    
    # Direct Descendants
    SON = "son"
    DAUGHTER = "daughter"
    GRANDSON = "grandson"  # son's son
    GRANDDAUGHTER = "granddaughter"  # son's daughter
    
    # Direct Ancestors
    FATHER = "father"
    MOTHER = "mother"
    GRANDFATHER = "grandfather"  # father's father
    PATERNAL_GRANDMOTHER = "paternal_grandmother"  # father's mother
    MATERNAL_GRANDMOTHER = "maternal_grandmother"  # mother's mother
    
    # Siblings
    FULL_BROTHER = "full_brother"
    FULL_SISTER = "full_sister"
    PATERNAL_BROTHER = "paternal_brother"  # same father, different mother
    PATERNAL_SISTER = "paternal_sister"
    MATERNAL_BROTHER = "maternal_brother"  # same mother, different father
    MATERNAL_SISTER = "maternal_sister"
    
    # Nephews
    FULL_NEPHEW = "full_nephew"  # brother's son
    PATERNAL_NEPHEW = "paternal_nephew"
    FULL_NEPHEW_SON = "full_nephew_son"  # full brother's son's son
    PATERNAL_NEPHEW_SON = "paternal_nephew_son"  # paternal brother's son's son
    
    # Uncles
    FULL_UNCLE = "full_uncle"  # father's full brother
    PATERNAL_UNCLE = "paternal_uncle"  # father's half-brother (same father)
    
    # Cousins and their descendants
    FULL_COUSIN = "full_cousin"  # father's full brother's son
    PATERNAL_COUSIN = "paternal_cousin"  # father's half-brother's son
    FULL_COUSIN_SON = "full_cousin_son"  # full cousin's son
    PATERNAL_COUSIN_SON = "paternal_cousin_son"  # paternal cousin's son
    FULL_COUSIN_GRANDSON = "full_cousin_grandson"  # full cousin's grandson
    PATERNAL_COUSIN_GRANDSON = "paternal_cousin_grandson"  # paternal cousin's grandson


class RelativeInfo(BaseModel):
    """Information about a single relative"""
    relative_type: RelativeType
    count: int = Field(default=1, ge=1)
    
    class Config:
        use_enum_values = True


class InheritanceInput(BaseModel):
    """Input for inheritance calculation"""
    total_estate: float = Field(gt=0, description="Total estate value")
    relatives: List[RelativeInfo] = Field(min_items=1)
    
    @validator('relatives')
    def validate_relatives(cls, v):
        """Validate relative combinations"""
        relative_types = [r.relative_type for r in v]
        
        # Spouse cannot exist with non-spouse relatives in some cases
        has_spouses = any(t in [RelativeType.HUSBAND, RelativeType.WIFE] for t in relative_types)
        
        return v


class RelativeShare(BaseModel):
    """Share information for a relative"""
    relative_type: RelativeType
    relative_name: str
    count: int
    share_fraction: str = Field(description="e.g., '1/4', '1/3', '1/2'")
    share_percentage: float = Field(description="Percentage share")
    amount: float = Field(description="Amount in currency")
    quranic_reference: Optional[str] = None
    notes: Optional[str] = None
    
    class Config:
        use_enum_values = True


class InheritanceResult(BaseModel):
    """Result of inheritance calculation"""
    total_estate: float
    currency: str = "USD"
    relatives_list: List[RelativeShare]
    calculation_steps: List[str] = Field(description="Step-by-step calculation")
    summary: Dict[str, Any] = Field(description="Summary by category")
    status: str = "success"
    

class TestCase(BaseModel):
    """Pre-built test case for demonstration"""
    test_case_id: str
    description: str
    relatives: List[RelativeInfo]
    expected_result: Dict[str, Any]


class FatwaSource(BaseModel):
    """Fatwa reference source"""
    name: str
    institution: str
    url: str
    language: str = "en"  # en, ur, ar
    description: Optional[str] = None


class ChatbotQuery(BaseModel):
    """User query to chatbot"""
    message: str
    context: Optional[str] = None  # "inheritance_general", "test_case_explanation", etc.
    language: str = "en"


class ChatbotResponse(BaseModel):
    """Chatbot response"""
    response: str
    related_rules: Optional[List[str]] = None
    references: Optional[List[str]] = None
