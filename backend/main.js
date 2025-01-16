const BASE_URL = "https://api.myapp.com";  // Replace with your actual API URL

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
async function createMeeting(meetingData) {
    const result = await apiCall("/meetings", "POST", meetingData);
    console.log("Meeting created:", result);
}

// 2. Fetch Weekly Meetings
async function getWeeklyMeetings() {
    const result = await apiCall("/meetings/week");
    console.log("Weekly Meetings:", result);
  }
 
// 3. Create a Task
async function createTask(taskData) {
    const result = await apiCall("/tasks", "POST", taskData);
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
// API Function to send email input and get the output
async function sendEmailInput(inputText) {
    try {
        const response = await fetch("/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ input_text: inputText }),
        });

        const data = await response.json();

        if (response.ok) {
            return data.output_text; // Return the output from the backend
        } else {
            throw new Error(data.message || 'Failed to send email');
        }
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email. Please try again.');
    }
}

// 7. Schedule Reminder
// API function to schedule a new reminder
async function scheduleReminder(data) {
    const result = await apiCall("/reminders", "POST", data);
    console.log("Reminder scheduled:", result);
}

// 8. Fetch Weekly Reminders
// API function to get the weekly reminders
async function getWeeklyReminders() {
    try {
        const response = await fetch("/reminders/week", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (response.ok) {
            return data.reminders; // Assuming the response has a "reminders" key
        } else {
            throw new Error(data.message || "Failed to fetch weekly reminders");
        }
    } catch (error) {
        console.error("Error fetching reminders:", error);
        throw new Error("Error fetching weekly reminders. Please try again.");
    }
}




// Event Listeners
// 1. Create a Meeting
document.querySelector(".add-meeting-button").addEventListener("click", async () => {
    // Get input values from form fields
    const title = document.getElementById("meetingTitle").value;
    const meetingDate = document.getElementById("start-time").value;
    const participants = Array.from(document.getElementById("selectedParticipants").children).map(child => child.textContent);

    // Validate inputs
    if (!title || !meetingDate || participants.length === 0) {
        alert("All fields are required.");
        return;
    }

    // Create request body
    const meetingData = {
        title: title,
        meeting_date: meetingDate,
        participants: participants,
    };

    // Call the API function to create the meeting
    try {
        await createMeeting(meetingData);
        alert('Meeting created successfully!');
    } catch (error) {
        console.error("Error creating meeting:", error);
        alert("Failed to create the meeting. Please try again.");
    }
});


// 2. Fetch Weekly Meetings
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch meetings from the backend
        const response = await fetch('/meetings/week', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const meetings = await response.json();

        if (response.ok) {
            // Reference to the container for displaying meetings
            const meetingsContainer = document.querySelector('.main-widget');

            // Clear existing content
            meetingsContainer.innerHTML = `
                <h2 style="font-family: 'New Century Schoolbook', 'TeX Gyre Schola', serif;">MEETINGS FOR THE WEEK</h2>
            `;

            // Check if there are meetings
            if (meetings.length === 0) {
                meetingsContainer.innerHTML += `<p>No meetings scheduled for this week.</p>`;
                return;
            }

            // Display each meeting
            meetings.forEach(meeting => {
                const meetingDiv = document.createElement('div');
                meetingDiv.classList.add('meeting-item'); // Optional for styling
                meetingDiv.innerHTML = `
                    <h3>${meeting.title}</h3>
                    <p>Date: ${new Date(meeting.start_time).toLocaleString()}</p>
                    <p>Participants: ${meeting.participants.join(', ')}</p>
                `;
                meetingsContainer.appendChild(meetingDiv);
            });
        } else {
            console.error("Failed to fetch meetings:", meetings.message);
            alert("Failed to load meetings for the week.");
        }
    } catch (error) {
        console.error("Error fetching weekly meetings:", error);
        alert("An error occurred while fetching meetings.");
    }
});

// 3. Create a Task
document.querySelector('.send-task-button').addEventListener('click', async () => {
    try {
        // Get the task title
        const title = document.getElementById('title').value;

        // Get the publish date
        const publishDate = document.getElementById('publish-date').value;

        // Get selected assignees
        const assignees = Array.from(document.getElementById('selectedAssignees').children).map(child => child.textContent);

        // Validate input fields
        if (!title || !publishDate || assignees.length === 0) {
            alert('All fields are required.');
            return;
        }

        // Create the task data object
        const taskData = {
            title: title,
            publish_date: publishDate,
            assignees: assignees
        };

        // Call the API function to create the task
        await createTask(taskData);
        alert('Task assigned successfully!');
    } catch (error) {
        console.error('Error assigning task:', error);
        alert('An error occurred while assigning the task.');
    }
});


// 4. Fetch Past Tasks
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch sent tasks from the backend
        const response = await fetch("/tasks/past", { 
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (response.ok) {
            const tasksContainer = document.querySelector('.sent-widget');
            
            // Clear any existing content
            tasksContainer.innerHTML = `
                <h2 style="font-family: 'New Century Schoolbook', 'TeX Gyre Schola', serif;">SENT:</h2>
            `;

            if (data.tasks && data.tasks.length > 0) {
                // Dynamically create HTML for each task
                const tasksList = document.createElement('ul');
                tasksList.style.listStyle = 'none'; // Optional styling
                data.tasks.forEach(task => {
                    const taskItem = document.createElement('li');
                    taskItem.textContent = `${task.title} - ${new Date(task.publish_date).toLocaleString()}`;
                    tasksList.appendChild(taskItem);
                });

                tasksContainer.appendChild(tasksList);
            } else {
                // No tasks available
                const noTasksMessage = document.createElement('p');
                noTasksMessage.textContent = 'No sent tasks available.';
                tasksContainer.appendChild(noTasksMessage);
            }
        } else {
            console.error('Failed to fetch tasks:', data.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
});

// 5. Fetch Upcoming Tasks
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch upcoming tasks from the backend
        const response = await fetch('/tasks/upcoming', { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            const tasksContainer = document.querySelector('.upcoming-widget');
            
            // Clear any existing content
            tasksContainer.innerHTML = `
                <h2 style="font-family: 'New Century Schoolbook', 'TeX Gyre Schola', serif;">TO BE SENT:</h2>
            `;

            if (data.tasks && data.tasks.length > 0) {
                // Dynamically create HTML for each task
                const tasksList = document.createElement('ul');
                tasksList.style.listStyle = 'none'; // Optional styling
                data.tasks.forEach(task => {
                    const taskItem = document.createElement('li');
                    taskItem.textContent = `${task.title} - ${new Date(task.publish_date).toLocaleString()}`;
                    tasksList.appendChild(taskItem);
                });

                tasksContainer.appendChild(tasksList);
            } else {
                // No tasks available
                const noTasksMessage = document.createElement('p');
                noTasksMessage.textContent = 'No upcoming tasks to be sent.';
                tasksContainer.appendChild(noTasksMessage);
            }
        } else {
            console.error('Failed to fetch tasks:', data.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
});

// 6. Summarize Email
// Event Listener for the submit button
document.querySelector(".submit-button").addEventListener("click", async () => {
    const inputText = document.getElementById("input-text").value;

    // Validate input text
    if (!inputText.trim()) {
        alert("Please enter some text before submitting.");
        return;
    }

    try {
        // Send the email input and receive the output
        const outputText = await sendEmailInput(inputText);

        // Display the output in the output-text textarea
        document.getElementById("output-text").value = outputText;
    } catch (error) {
        document.getElementById("output-text").value = error.message;
    }
});

// 7. Schedule Reminder
// Event listener to trigger scheduleReminder when the button is clicked
document.querySelector(".add-reminder-button").addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent page refresh

    try {
        // Get form input values
        const message = document.getElementById("title").value;
        const remindAt = document.getElementById("remind-at").value;

        // Validate input
        if (!message || !remindAt) {
            alert("All fields are required.");
            return;
        }

        // Create data object to send to the backend
        const data = {
            message,   // Title of the reminder
            remind_at: remindAt, // Reminder date and time
        };

        // Call the function to schedule the reminder
        await scheduleReminder(data);

        // Optionally, provide feedback to the user
        alert("Reminder added successfully!");
    } catch (error) {
        console.error("Error adding reminder:", error);
        alert("Failed to add reminder. Please try again.");
    }
});


// 8. Fetch Weekly Reminders
// Event listener to display upcoming reminders when the page loads
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch the weekly reminders
        const reminders = await getWeeklyReminders();

        // Get the container where reminders will be displayed
        const reminderContainer = document.querySelector('.side-widget');

        // Clear any existing content
        reminderContainer.innerHTML = `
            <h2 style="font-family: 'New Century Schoolbook', 'TeX Gyre Schola', serif;">TO DO LIST</h2>
        `;

        // Check if there are any reminders
        if (reminders && reminders.length > 0) {
            // Create an unordered list for the reminders
            const reminderList = document.createElement('ul');
            reminderList.style.listStyle = 'none'; // Optional styling

            // Loop through reminders and display each one
            reminders.forEach(reminder => {
                const reminderItem = document.createElement('li');
                reminderItem.textContent = `${reminder.message} - ${new Date(reminder.remind_at).toLocaleString()}`;
                reminderList.appendChild(reminderItem);
            });

            // Append the list to the reminder container
            reminderContainer.appendChild(reminderList);
        } else {
            // Display message if no reminders exist
            const noRemindersMessage = document.createElement('p');
            noRemindersMessage.textContent = 'No upcoming reminders for this week.';
            reminderContainer.appendChild(noRemindersMessage);
        }
    } catch (error) {
        console.error("Error displaying reminders:", error);
    }
});










