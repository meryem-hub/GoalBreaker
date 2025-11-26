from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class TaskBase(BaseModel):
    step_number: int = Field(..., ge=1, le=5, description="Step number between 1-5")
    task_title: str = Field(..., min_length=3, description="Title of the task")  # ADD THIS
    task_description: str = Field(..., min_length=5, description="Detailed description of the task")
    complexity_score: int = Field(..., ge=1, le=10, description="Complexity score between 1-10")

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class GoalBase(BaseModel):
    goal_text: str = Field(..., min_length=3, max_length=200)

class GoalCreate(GoalBase):
    pass

class GoalResponse(GoalBase):
    id: str
    complexity_score: Optional[float] = None
    created_at: datetime
    tasks: List[TaskResponse]

    class Config:
        from_attributes = True