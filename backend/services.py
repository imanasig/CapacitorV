import os
import json
from groq import Groq
from typing import List
from models import Report, DailyWarning

def generate_daily_warning(reports: List[Report]) -> DailyWarning:
    """
    Takes a list of community reports and uses Groq to generate a JSON blueprint 
    for the frontend safe simulation challenge.
    """
    
    # If groq api key isn't provided, mock for safety/testing
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("Warning: GROQ_API_KEY missing. Returning mock simulation json.")
        return DailyWarning(
            title="SBI KYC Update Scam",
            description="Scammers are asking to update PAN via malicious links.",
            scenario_json=json.dumps({
                "scenario": [
                    {
                        "en": "Dear SBI Customer, your YONO account is blocked. Please update PAN immediately.",
                        "hi": "प्रिय SBI ग्राहक, आपका YONO अकाउंट ब्लॉक है। तुरंत पैन अपडेट करें।"
                    },
                    {
                        "en": "Click on this link to verify KYC: http://sbi-update-kyc.io",
                        "hi": "KYC वेरिफिकेशन के लिए इस लिंक पर क्लिक करें: http://sbi-update-kyc.io"
                    }
                ],
                "safe_choice_en": "Delete SMS and ignore",
                "safe_choice_hi": "SMS डिलीट करें",
                "danger_choice_en": "Click the link",
                "danger_choice_hi": "लिंक पर क्लिक करें"
            })
        )

    # Initialize Groq client
    client = Groq(api_key=api_key)
    
    # Compress recent reports
    bundled_text = "\n".join([r.text for r in reports])
    if not bundled_text.strip():
         bundled_text = "Users have reported random WhatsApp callers asking for money for hospital bills."
         
    prompt = f"""
    You are an elite cyber-security AI generating a lifelike interactive scam simulation for elderly Indian users.
    
    MISSION: Study the REAL scam reports below from our community database. Pick the SINGLE most dangerous or common threat.
    Build a realistic, step-by-step simulation people can practice to learn how to survive that EXACT scam.
    
    --- LIVE COMMUNITY REPORTS ---
    {bundled_text}
    --- END REPORTS ---
    
    PLATFORM DETECTION RULE (CRITICAL):
    Based on the reports, determine WHERE this scam is happening. Choose EXACTLY ONE platform from this list:
    - "whatsapp" → if the scam mentions WhatsApp
    - "sms" → if the scam mentions SMS, text message, OTP, verification code, bank alert
    - "email" → if the scam mentions email, inbox, Gmail, clicking a link sent via email
    - "instagram" → if the scam mentions Instagram, DM, followers, reels, influencer
    - "facebook" → if the scam mentions Facebook, Messenger, Facebook post, marketplace
    - "telegram" → if the scam mentions Telegram, channel, group invite
    - "phone_call" → if the scam mentions phone call, IVR, automated call, someone calling
    
    IMPORTANT: We want a high diversity of platforms! If the community reports are vague, randomly pick ONE of ("sms", "email", "instagram", "facebook", "telegram", "phone_call", "whatsapp") instead of always defaulting to WhatsApp. Surprise the user with a different platform!
    
    SIMULATION RULES:
    - Write 2-3 realistic scammer messages that show escalating pressure.
    - Messages must feel authentic to that platform (e.g. email is formal, WhatsApp is casual, Instagram DM is flattering).
    - Base every detail DIRECTLY on the community reports. Do NOT invent unrelated scenarios.
    
    Output ONLY valid raw JSON (no markdown, no backticks) matching this exact schema:
    {{
        "title": "Short catchy title of the scam (max 8 words)",
        "description": "1 vivid sentence describing this specific scam threat.",
        "platform": "one of: whatsapp, sms, email, instagram, facebook, telegram, phone_call",
        "scenario": [
            {{
                "en": "First scammer message in English, urgent tone.",
                "hi": "Same message translated to natural Hindi."
            }},
            {{
                "en": "Second message applying more pressure or sending a malicious link.",
                "hi": "Hindi translation."
            }},
            {{
                "en": "Optional third message or final threat. Leave blank string if not needed.",
                "hi": ""
            }}
        ],
        "safe_choice_en": "Specific safe action the user should take (e.g. Block and report this number).",
        "safe_choice_hi": "Safe action in Hindi.",
        "danger_choice_en": "The exact dangerous mistake the victim might make.",
        "danger_choice_hi": "Dangerous action in Hindi."
    }}
    """
    
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a JSON generating system. Return only raw JSON. Never output markdown format blocks, just raw JSON text."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        
        # We store the interactive parts inside scenario_json
        scenario_data = {
            "scenario": data.get("scenario", []),
            "platform": data.get("platform", "whatsapp"),
            "safe_choice_en": data.get("safe_choice_en", ""),
            "safe_choice_hi": data.get("safe_choice_hi", ""),
            "danger_choice_en": data.get("danger_choice_en", ""),
            "danger_choice_hi": data.get("danger_choice_hi", "")
        }
        
        return DailyWarning(
            title=data.get("title", "Community Scam Alert"),
            description=data.get("description", "A new scam has been reported by the community."),
            scenario_json=json.dumps(scenario_data)
        )
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        # Mock Fallback in case of error
        return DailyWarning(
            title="Community Alert",
            description="We noticed increased reports of suspicious activity. Stay vigilant.",
            scenario_json=json.dumps({
                "scenario": [
                    {"en": "Hi, I have an urgent business offer.", "hi": "नमस्ते, मेरे पास एक जरूरी ऑफर है।"}
                ],
                "safe_choice_en": "Block the number",
                "safe_choice_hi": "ब्लॉक करें",
                "danger_choice_en": "Reply to them",
                "danger_choice_hi": "रिप्लाई करें"
            })
        )
