""" from google.cloud import firestore
from datetime import datetime

print("Modules are installed and working!") """

import openai

# Replace 'your-api-key' with your actual OpenAI API key
openai.api_key = 'your-api-key'

response = openai.Completion.create(
    model="text-davinci-003",
    prompt="Say hello to the world",
    max_tokens=5
)

print(response.choices[0].text.strip())




