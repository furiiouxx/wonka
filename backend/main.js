
// Utility function for API calls
async function apiCall(endpoint, method = "GET", data = null) {
    try {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      if (data) {
        options.body = JSON.stringify(data);
      }
  
      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }
  
      return result;
    } catch (error) {
      console.error("API call error:", error);
      alert(error.message);
    }
  }
  
// API functions
// 1. Create a Meeting
async function createMeeting() {
    const title = document.getElementById("meetingTitle").value;
    const meetingDate = document.getElementById("meetingDate").value;
    const participants = document.getElementById("participants").value.split(",");
  
    const data = {
      title,
      meeting_date: meetingDate,
      participants,
    };
  
    const result = await apiCall("/meetings", "POST", data);
    console.log("Meeting created:", result);
  }

// 2. Fetch Weekly Meetings
async function getWeeklyMeetings() {
    const result = await apiCall("/meetings/week");
    console.log("Weekly Meetings:", result);
  }
 
// 3. Create a Task
async function createTask() {
    const title = document.getElementById("taskTitle").value;
    const publishDate = document.getElementById("publishDate").value;
    const assignee = document.getElementById("assignee").value;
  
    const data = {
      title,
      publish_date: publishDate,
      assignee,
    };
  
    const result = await apiCall("/tasks", "POST", data);
    console.log("Task created:", result);
  }

// 4. Fetch Past Tasks
async function getPastTasks() {
    const result = await apiCall("/tasks/past");
    console.log("Past Tasks:", result);
  }

// 5. Fetch Upcoming Tasks
async function getUpcomingTasks() {
    const result = await apiCall("/tasks/upcoming");
    console.log("Upcoming Tasks:", result);
  }

// 6. Summarize Email
async function summarizeEmail() {
    const emailContent = document.getElementById("emailContent").value;
  
    const data = {
      email_content: emailContent,
    };
  
    const result = await apiCall("/summarize_email", "POST", data);
    console.log("Email Summary:", result);
  }

// 7. Schedule Reminder
async function scheduleReminder() {
    const title = document.getElementById("reminderTitle").value;
    const remindAt = document.getElementById("remindAt").value;
    const dueDate = document.getElementById("dueDate").value;
  
    const data = {
      title,
      send_date: remindAt,
      remind_at: dueDate,
    };
  
    const result = await apiCall("/reminders", "POST", data);
    console.log("Reminder scheduled:", result);
  }

// 8. Fetch Weekly Reminders
async function getWeeklyReminders() {
    const result = await apiCall("/reminders/week");
    console.log("Weekly Reminders:", result);
  }

// Event Listeners