from sqlalchemy.orm import Session
from typing import List, Optional
import logging
import os
from app.db.models import Goal, Task
from app.schemas.goals import GoalCreate
from app.services.ai_service import AIService

logger = logging.getLogger(__name__)

class GoalService:
    def __init__(self):
        # Remove the API key loading and parameter passing
        # AIService now handles API key loading internally
        self.ai_service = AIService()

    def create_goal_with_tasks(self, db: Session, goal_create: GoalCreate) -> Goal:
        """Create goal with AI-generated tasks - NO FALLBACKS"""
        try:
            # Get REAL AI breakdown - will raise exception if AI fails
            ai_result = self.ai_service.break_down_goal(goal_create.goal_text)
            
            # Create goal
            goal = Goal(
                goal_text=goal_create.goal_text,
                complexity_score=ai_result["complexity_score"]
            )
            db.add(goal)
            db.flush()

            # Create tasks
            for task_data in ai_result["tasks"]:
                task = Task(
                    goal_id=goal.id,
                    task_description=task_data["task_description"],
                    step_number=task_data["step_number"],
                    complexity_score=task_data["complexity_score"]
                )
                db.add(task)

            db.commit()
            db.refresh(goal)
            logger.info(f"Created goal with REAL AI steps: {goal.id}")
            return goal

        except Exception as e:
            db.rollback()
            logger.error(f"AI failed to create goal: {e}")
            raise  # Re-raise the exception - NO FALLBACK!

    def get_goal_by_id(self, db: Session, goal_id: str) -> Optional[Goal]:
        return db.query(Goal).filter(Goal.id == goal_id).first()

    def get_all_goals(self, db: Session, skip: int = 0, limit: int = 100) -> List[Goal]:
        return db.query(Goal).offset(skip).limit(limit).all()