from pydantic import BaseModel
from autogen_core.components.models import ( 
    LLMMessage ,
    AssistantMessage 
    )


class FinalResult(BaseModel):
    body: LLMMessage