import google.generativeai as genai
import os
import json
import logging
import re
from typing import Dict
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

class AIService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("⚠️ Missing GEMINI_API_KEY in .env")

        logger.info("🔐 API Key Loaded Successfully")
        genai.configure(api_key=api_key)

        # Hardcode a free Gemini model
        self.model = genai.GenerativeModel("models/gemini-2.5-flash")
        logger.info("🎯 Using Gemini free model: gemini-2.5-flash")

    def break_down_goal(self, goal: str) -> Dict:
        """Generate a robust structured task breakdown using Gemini AI"""
        prompt = f"""
        You are a strategic execution expert transforming big goals into precise,
        measurable, and time-bound micro tasks.

        Break the goal below into EXACTLY 5 clear, actionable, outcome-focused tasks.
        Each task must include numbers, measurable targets, tools or strategies.
        Avoid vague advice like 'research', 'learn more', or 'try to'.

        FORMAT EACH TASK WITH:
        - A clear TITLE (3-7 words summarizing the main action)
        - A detailed DESCRIPTION (specific steps, numbers, timelines)

        Rate overall complexity from 1.0 to 10.0 based on effort, planning,
        time, domain-specific difficulty, and discipline required.

        Return ONLY valid JSON in this format:

        {{
            "complexity_score": float,
            "tasks": [
                {{
                    "step_number": int, 
                    "task_title": "string (clear 3-7 word title)",
                    "task_description": "string (detailed description with numbers and specifics)", 
                    "complexity_score": int
                }}
            ]
        }}

        Goal: "{goal}"
        """

        logger.info(f"🎯 Processing goal: {goal}")

        try:
            response = self.model.generate_content(prompt)
            raw_output = response.text.strip()

            # --- Extract JSON block using regex ---
            match = re.search(r"\{.*\}", raw_output, re.DOTALL)
            if match:
                raw_output = match.group(0)
            else:
                logger.warning("No JSON block detected, using raw output")

            # --- Clean extra quotes and newlines ---
            raw_output = raw_output.strip('"').replace('\\"', '"').replace("\n", "")
            logger.debug(f"Cleaned AI output: {raw_output}")

            # --- Parse JSON ---
            data = json.loads(raw_output)

            # --- Validate structure ---
            if not isinstance(data, dict) or "tasks" not in data or len(data["tasks"]) != 5:
                raise ValueError("AI returned JSON with wrong structure or wrong number of tasks")

            for task in data["tasks"]:
                if not all(k in task for k in ("step_number", "task_title", "task_description", "complexity_score")):
                    raise ValueError(f"Task missing required fields: {task}")

            logger.info("🚀 Successfully generated structured task breakdown")
            return data

        except json.JSONDecodeError:
            logger.error(f"❌ Failed to parse AI response as JSON: {raw_output}")
            raise ValueError("Invalid JSON format returned by AI")
        except Exception as e:
            logger.error(f"⚠️ Gemini AI failed: {e}")
            raise ValueError("Gemini AI could not generate valid task breakdown")