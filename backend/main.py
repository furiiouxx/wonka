# main.py is the entry point for flask
# contains all the api rotes and their schemas

import openai 
import os
from flask import Flask, request, jsonify
from firebase import firestore_client
from google.cloud import firestore 
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)


# 1. **Meeting Scheduling** 

# Create a meeting
@app.route('/meetings', methods=['POST'])
def create_meeting():
    data = request.json
    meeting = {
        "title": data.get("title"),
        "meeting_date": datetime.strptime(data.get("meeting_date"), '%Y-%m-%d %H:%M:%S'),
        "participants": data.get("participants")
    }
    meeting_ref = firestore_client.collection('meetings').add(meeting)
    return jsonify({"id": meeting_ref[1].id, "message": "Meeting created successfully!"}), 201

# Fetch meetings for the week
@app.route('/meetings/week', methods=['GET'])
def get_weekly_meetings():
    start_date = datetime.now()
    end_date = start_date + timedelta(days=7)
    meetings = []
    for meeting in firestore_client.collection('meetings') \
        .where('meeting_date', '>=', start_date) \
        .where('meeting_date', '<=', end_date).stream():
        meeting_data = meeting.to_dict()
        meeting_data['id'] = meeting.id
        meetings.append(meeting_data)
    return jsonify(meetings), 200


# 2. **Task Automation**

# Create a new task
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    task = {
        "title": data.get("title"),
        "publish_date": datetime.strptime(data.get("publish_date"), '%Y-%m-%d'),
        "assignee": data.get("assignee")
    }
    task_ref = firestore_client.collection('tasks').add(task)
    return jsonify({"id": task_ref[1].id, "message": "Task created successfully!"}), 201

# Fetch Sent Tasks for the week
@app.route('/tasks/past', methods=['GET'])
def get_past_tasks():
    # Fetch tasks with due dates before the current date
    current_date = datetime.now()
    tasks_ref = firestore_client.collection('tasks')
    query = tasks_ref.where('due_date', '<', current_date)
    past_tasks = [doc.to_dict() for doc in query.stream()]
    return jsonify({"tasks": past_tasks}), 200

# Fetch Upcoming Tasks for the week
@app.route('/tasks/upcoming', methods=['GET'])
def get_upcoming_tasks():
    # Fetch tasks with due dates after or equal to the current date.
    current_date = datetime.now()
    tasks_ref = firestore_client.collection('tasks')
    query = tasks_ref.where('due_date', '>=', current_date)
    upcoming_tasks = [doc.to_dict() for doc in query.stream()]
    return jsonify({"tasks": upcoming_tasks}), 200


# 3. **Email Thread Summarization**

# Generate a summary of an email thread
@app.route('/summarize_email', methods=['POST'])
def summarize_email():
    # Get the email content from the request
    email_content = request.json.get('email_content')

    if not email_content:
        return jsonify({"error": "No email content provided"}), 400

    try:
        # Request OpenAI's API to summarize the email content
        response = openai.Completion.create(
            model="text-davinci-003",  # You can use other models if needed
            prompt=f"Summarize this email content: {email_content}",
            max_tokens=150
        )

        # Extract the summarized text from the response
        summary = response.choices[0].text.strip()

        # Return the summary as a JSON response
        return jsonify({"summary": summary})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 4. **Reminders and Alerts**

# Schedule a new reminder
@app.route('/reminders', methods=['POST'])
def schedule_reminder():
    data = request.json
    reminder = {
        "title": data.get("title"),
        "remind_at": datetime.strptime(data.get("send_date"), '%Y-%m-%d %H:%M:%S'),
        "due_date": datetime.strptime(data.get("remind_at"), '%Y-%m-%d %H:%M:%S')
    }
    reminder_ref = firestore_client.collection('reminders').add(reminder)
    return jsonify({"id": reminder_ref[1].id, "message": "Reminder scheduled!"}), 201

# Fetch reminders for the week
@app.route('/reminders/week', methods=['GET'])
def get_weekly_reminders():
    start_date = datetime.now()
    end_date = start_date + timedelta(days=7)
    reminders = []
    for reminder in firestore_client.collection('reminders') \
        .where('send_date', '>=', start_date) \
        .where('send_date', '<=', end_date).stream():
        reminder_data = reminder.to_dict()
        reminder_data['id'] = reminder.id
        reminders.append(reminder_data)
    return jsonify(reminders), 200


# Main entry point for Flask
if __name__ == '__main__':
    app.run(debug=True)
