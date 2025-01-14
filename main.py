# main.py is the entry point for flask
# contains all the api rotes and their schemas

from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory storage for simplicity (Replace with Firebase in production)
meetings = []
tasks = []
reminders = []
summaries = {}

# 1. **Meeting Scheduling** 

# Schedule a new meeting
@app.route('/meetings', methods=['POST'])
def schedule_meeting():
    data = request.get_json()
    meeting_id = len(meetings) + 1
    meeting = {
        'meeting_id': meeting_id,
        'title': data['title'],
        'participants': data['participants'],
        'start_time': data['start_time'],
        'end_time': data['end_time'],
        'location': data['location']
    }
    meetings.append(meeting)
    return jsonify({"message": "Meeting scheduled successfully", "meeting_id": meeting_id}), 201

# Fetch all upcoming meetings
@app.route('/meetings', methods=['GET'])
def get_meetings():
    participant_email = request.args.get('participant_email')
    if participant_email:
        participant_meetings = [meeting for meeting in meetings if participant_email in meeting['participants']]
        return jsonify(participant_meetings)
    return jsonify(meetings)

# Cancel a scheduled meeting
@app.route('/meetings/<int:meeting_id>', methods=['DELETE'])
def cancel_meeting(meeting_id):
    meeting = next((meeting for meeting in meetings if meeting['meeting_id'] == meeting_id), None)
    if not meeting:
        return jsonify({"message": "Meeting not found"}), 404
    meetings.remove(meeting)
    return jsonify({"message": "Meeting cancelled"})


# 2. **Task Automation**

# Create a new task
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    task_id = len(tasks) + 1
    task = {
        'task_id': task_id,
        'title': data['title'],
        'due_date': data['due_date'],
        'assignee': data['assignee'],
        'status': data['status']
    }
    tasks.append(task)
    return jsonify({"message": "Task created successfully", "task_id": task_id}), 201

# Update the status or details of a task
@app.route('/tasks/<int:task_id>', methods=['PATCH'])
def update_task(task_id):
    data = request.get_json()
    task = next((task for task in tasks if task['task_id'] == task_id), None)
    if not task:
        return jsonify({"message": "Task not found"}), 404
    task.update(data)
    return jsonify({"message": "Task updated successfully"})

# Fetch all tasks for a user
@app.route('/tasks', methods=['GET'])
def get_tasks():
    assignee = request.args.get('assignee')
    if assignee:
        assignee_tasks = [task for task in tasks if task['assignee'] == assignee]
        return jsonify(assignee_tasks)
    return jsonify(tasks)


# 3. **Email Thread Summarization**

# Generate a summary of an email thread
@app.route('/summarize-email', methods=['POST'])
def summarize_email():
    data = request.get_json()
    email_thread = data['email_thread']
    summary = " ".join([message['content'] for message in email_thread])
    email_thread_id = len(summaries) + 1
    summaries[email_thread_id] = summary
    return jsonify({"summary": summary})


# 4. **Reminders and Alerts**

# Create a new reminder
@app.route('/reminders', methods=['POST'])
def create_reminder():
    data = request.get_json()
    reminder_id = len(reminders) + 1
    reminder = {
        'reminder_id': reminder_id,
        'message': data['message'],
        'remind_at': data['remind_at'],
        'recipient': data['recipient']
    }
    reminders.append(reminder)
    return jsonify({"message": "Reminder created successfully", "reminder_id": reminder_id}), 201

# Fetch all reminders for a user.
@app.route('/reminders', methods=['GET'])
def get_reminders():
    recipient = request.args.get('recipient')
    if recipient:
        recipient_reminders = [reminder for reminder in reminders if reminder['recipient'] == recipient]
        return jsonify(recipient_reminders)
    return jsonify(reminders)

# Main entry point for Flask
if __name__ == '__main__':
    app.run(debug=True)
