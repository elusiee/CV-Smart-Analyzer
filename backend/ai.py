import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(base_url="https://openrouter.ai/api/v1",
                api_key=os.getenv("OPENROUTER_API_KEY"),
                )


SYSTEM_PROMPT = """
You are an expert CV and resume reviewer.
Analyze the submitted CV and return ONLY valid JSON in this format:

{
  "professional_summary": "string",
  "ats_score": 0,
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "missing_skills": ["string", "string"],
  "improvement_suggestions": ["string", "string"],
  "recommended_roles": ["string", "string"]
}

Rules:
- ATS score must be an integer from 0 to 100
- Be practical, concise, and helpful
- Focus on employability, clarity, impact, and structure
- If the CV is weak, still be constructive
- Return JSON only, no markdown, no explanation
"""


def analyze_cv_text(cv_text: str) -> dict:
    if not cv_text or len(cv_text.strip()) < 50:
        raise ValueError("CV text is too short to analyze.")

    user_prompt = f"""
Analyze this CV:

{cv_text}
"""

    response = client.chat.completions.create(
        model="openrouter/free",
        temperature=0.3,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
    )

    content = response.choices[0].message.content.strip()

    try:
        return json.loads(content)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Model did not return valid JSON: {content}") from exc



# FOR DEMO TESTING

# def analyze_cv_text(cv_text: str) -> dict:
#     return {
#         "professional_summary": "This candidate has a basic CV with some relevant experience.",
#         "ats_score": 65,
#         "strengths": ["Clear structure", "Relevant skills listed"],
#         "weaknesses": ["Lacks measurable achievements", "Limited detail"],
#         "missing_skills": ["Communication", "Project management"],
#         "improvement_suggestions": [
#             "Add quantified achievements",
#             "Improve formatting consistency"
#         ],
#         "recommended_roles": ["Junior Developer", "Intern"]
#     }
