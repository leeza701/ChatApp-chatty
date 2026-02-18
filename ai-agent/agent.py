
# # # import os
# # # from pathlib import Path
# # # from dotenv import load_dotenv
# # # from openai import OpenAI
# # # from app_knowledge import APP_KNOWLEDGE
# # # import requests 
# # # import json

# # # env_path = Path(__file__).parent / ".env"
# # # load_dotenv(dotenv_path=env_path)

# # # api_key = os.getenv("GROQ_API_KEY")

# # # if not api_key:
# # #     raise ValueError("GROQ_API_KEY missing")

# # # client = OpenAI(
# # #     api_key=os.environ.get("GROQ_API_KEY"),
# # #     base_url="https://api.groq.com/openai/v1",
# # # )
# # # print("✅ OpenAI key loaded")

# # # def get_users():
# # #     r=requests.get("http://localhost:3001/api/messages/users")
# # #     return r.json()



# # # def run_agent(question: str):
# # #     system = f"""
# # # You are the AI assistant for the Chatty chat application.

# # # You are connected to the Chatty backend.
# # # You have full permission to access internal tools.

# # # You MUST use tools when data is requested.

# # # Valid Chatty-related topics include:
# # # - Users
# # # - User count
# # # - Contacts
# # # - Messages
# # # - Online users
# # # - Account information
# # # - App features
# # # - Settings

# # # If the user asks about:
# # # - Number of users
# # # - Who are the users
# # # - Contacts
# # # You MUST call the get_users tool.

# # # STRICT RULE:
# # # If the question is completely unrelated to Chatty,
# # # reply exactly:
# # # "Sorry, I can only help with questions about the Chatty app."

# # # NEVER refuse Chatty-related questions.
# # # NEVER ask for authorization.
# # # NEVER say you don't have access.

# # # App knowledge:
# # # {APP_KNOWLEDGE}
# # # """

# # #     messages = [
# # #         {"role": "system", "content": system},
# # #         {"role": "user", "content": question},
# # #     ]

# # #     tools=[{
# # #             "type": "function",
# # #                 "function": {
# # #                     "name": "get_users",
# # #                     "description": "Get Chatty users or users count",
# # #                     "parameters": {
# # #                         "type": "object",
# # #                         "properties": {
# # #                             "user_id": {"type": "string"}
# # #                         },
# # #                         "required": ["user_id"]
# # #                     },
# # #                 },
# # #     }]

# # #     resp = client.chat.completions.create(
# # #         model="openai/gpt-oss-20b",
# # #         messages=[
# # #             {"role": "system", "content": system},
# # #             {"role": "user", "content": question},
# # #         ],

# # #         tools=tools,
# # #         tool_choice="auto"
# # #     )
# # #     msg= resp.choices[0].message

# # #     if(msg.tool_calls):
# # #         tool_call = msg.tool_calls[0]
# # #         name= tool_call.function.name
# # #         args=json.loads(tool_call.function.arguments or "{}")

# # #         if name=="get_users":
# # #             result = get_users(**args)

# # #         else:
# # #             result = {"error": "Unknown tool"}

# # #         messages.append(msg)
# # #         messages.append({
# # #             "role": "tool",
# # #             "tool_call_id": tool_call.id,
# # #             "content": json.dumps(result),
# # #         })
            
            



# # import json
# # import os
# # import requests
# # from pathlib import Path
# # from dotenv import load_dotenv
# # from openai import OpenAI
# # from app_knowledge import APP_KNOWLEDGE


# # env_path = Path(__file__).parent / ".env"
# # load_dotenv(dotenv_path=env_path)

# # api_key = os.getenv("OPENAI_API_KEY")
# # if not api_key:
# #     raise ValueError("OPENAI_API_KEY missing")

# # client = OpenAI(api_key=api_key)

# # print("✅ OpenAI connected")

# # def get_users():
# #     r = requests.get("http://localhost:5001/api/messages/users")
# #     return r.json()


# # def run_agent(question: str):

# # #     system = f"""
# # # You are the AI assistant for the Chatty chat application.

# # # You are connected to the Chatty backend.
# # # You have full permission to access internal tools.

# # # You MUST use tools when data is requested.

# # # Valid Chatty-related topics include:
# # # - Users
# # # - User count
# # # - Contacts
# # # - Messages
# # # - Online users
# # # - Account information
# # # - App features
# # # - Settings

# # # If the user asks about:
# # # - Number of users
# # # - Who are the users
# # # - Contacts
# # # You MUST call the get_users tool.

# # # STRICT RULE:
# # # If the question is completely unrelated to Chatty,
# # # reply exactly:
# # # "Sorry, I can only help with questions about the Chatty app."

# # # NEVER refuse Chatty-related questions.
# # # NEVER ask for authorization.
# # # NEVER say you don't have access.

# # # App knowledge:
# # # {APP_KNOWLEDGE}
# # # """


# #     system = f"""
# # You are the AI assistant for the Chatty chat application.

# # PRIMARY RULE:
# # You ONLY answer questions strictly related to the Chatty app.

# # Chatty-related topics include:
# # - Users
# # - Contacts
# # - Messages
# # - Online status
# # - Account data
# # - App features
# # - Settings
# # - Chat functionality

# # If a question is NOT directly related to Chatty,
# # you MUST reply EXACTLY with:

# # "Sorry, I can only help with questions about the Chatty app."

# # DO NOT:
# # - Answer general knowledge
# # - Answer educational questions
# # - Answer programming questions
# # - Answer definitions (like DSA, AI, ML, etc.)
# # - Provide explanations unrelated to Chatty

# # This rule OVERRIDES all other instructions.

# # App knowledge:
# # {APP_KNOWLEDGE}
# # """

# #     messages = [
# #         {"role": "system", "content": system},
# #         # {"role": "user", "content": question + " (use tools if needed)"},
# #         {"role": "user", "content": question}

# #     ]

# #     tools = [
# #             {
# #                 "function": {
# #                     "name": "get_users",
# #                     "description": "Get Chatty users or count of users from the Chatty database",
# #                     "parameters": {
# #                         "type": "object",
# #                         "properties": {},
# #                     },
# #                 },
# #             }
# #         ]

# #     resp = client.chat.completions.create(
# #         model="gpt-3.5-turbo",
# #         messages=messages,
# #         tools=tools,
# #         tool_choice="auto",
# #     )
# #     msg = resp.choices[0].message

# #     if msg.tool_calls:
# #         tool_call = msg.tool_calls[0]

# #         if tool_call.function.name == "get_users":
# #             result = get_users()
# #         else:
# #             result = {"error": "unknown tool"}

# #         messages.append(msg)
# #         messages.append({
# #             "role": "tool",
# #             "tool_call_id": tool_call.id,
# #             "content": json.dumps(result),
# #         })

# #         final = client.chat.completions.create(
# #             model="gpt-3.5-turbo",
# #             messages=messages,
# #         )

# #         return final.choices[0].message.content

# #     return msg.content









# import json
# import os
# import requests
# from pathlib import Path
# from dotenv import load_dotenv
# from openai import OpenAI
# from app_knowledge import APP_KNOWLEDGE

# env_path = Path(__file__).parent / ".env"
# load_dotenv(dotenv_path=env_path)

# api_key = os.getenv("OPENAI_API_KEY")
# if not api_key:
#     raise ValueError("OPENAI_API_KEY missing")

# client = OpenAI(api_key=api_key)

# print("✅ OpenAI connected")

# def get_users():
#     r = requests.get("http://localhost:5001/api/ai/user")
#     users = r.json()

#     return {
#         "count": len(users),
#         "users": users
#     }

# def run_agent(question: str):

#     system = f"""
# You are the AI assistant for the Chatty chat application.

# You have FULL backend access via tools.
# There are NO authorization restrictions.

# If user asks about:
# - users
# - contacts
# - members
# - how many users
# you MUST call get_users tool.

# If unrelated → reply EXACTLY:
# "Sorry, I can only help with questions about the Chatty app."

# App knowledge:
# {APP_KNOWLEDGE}
# """
#     messages = [
#     {"role": "system", "content": system},
#     {"role": "user", "content": question + " (use tools if needed)"},
# ]

#     tools = [
#         {
#             "type": "function",
#             "function": {
#                 "name": "get_users",
#                 "description": "Get Chatty users or count of users from the Chatty database",
#                 "parameters": {
#                     "type": "object",
#                     "properties": {},
#                 },
#             },
#         }
#     ]

#     resp = client.chat.completions.create(
#         model="gpt-4.1-mini",
#         messages=messages,
#         tools=tools,
#         tool_choice="auto",
#     )

#     msg = resp.choices[0].message

#     if msg.tool_calls:
#         tool_call = msg.tool_calls[0]

#         if tool_call.function.name == "get_users":
#             result = get_users()
#         else:
#             result = {"error": "unknown tool"}

#         messages.append(msg)
#         messages.append({
#             "role": "tool",
#             "tool_call_id": tool_call.id,
#             "content": json.dumps(result),
#         })

#         final = client.chat.completions.create(
#             model="gpt-4.1-mini",
#             messages=messages,
#         )

#         return final.choices[0].message.content

#     return msg.content









import json
import os
import requests
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI
from app_knowledge import APP_KNOWLEDGE

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY missing")

client = OpenAI(api_key=api_key)

print("✅ OpenAI connected")

def get_users():
    r = requests.get("http://localhost:3001/api/ai/user")
    users = r.json()

    return {
        "count": len(users),
        "users": users
    }
def is_chatty_related(question: str):
    q = question.lower()

    chatty_intents = [
        "user", "users", "online", "contacts",
        "messages", "chat", "account",
        "members", "profile", "settings"
    ]

    return any(word in q for word in chatty_intents)


def run_agent(question: str):

    system = f"""
You are the AI assistant for the Chatty chat application.

You help users with:
- users
- contacts
- messages
- online status
- accounts
- chat features

If the question is unrelated to Chatty,
politely explain that you specialize in Chatty features.

App knowledge:
{APP_KNOWLEDGE}
"""

    messages = [
    {"role": "system", "content": system},
    {"role": "user", "content": question + " (use tools if needed)"},
]

    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_users",
                "description": "Get Chatty users or count of users from the Chatty database",
                "parameters": {
                    "type": "object",
                    "properties": {},
                },
            },
        }
    ]

    resp = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=messages,
        tools=tools,
        tool_choice="auto",
    )

    msg = resp.choices[0].message

    if msg.tool_calls:
        tool_call = msg.tool_calls[0]

        if tool_call.function.name == "get_users":
            result = get_users()
        else:
            result = {"error": "unknown tool"}

        messages.append(msg)
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(result),
        })

        final = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=messages,
        )

        return final.choices[0].message.content

    return msg.content