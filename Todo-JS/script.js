
/* ------------------- Getting elements form the HTML File ------------------ */
const taskInput = document.getElementById('task-input');
const addTask = document.getElementById('add-task');
const taskMain = document.getElementById('tasks');
const search = document.getElementById('search-todo');

/* -------------------- Getting tasks from local storage -------------------- */
let getTasks = JSON.parse(localStorage.getItem('taskList'))
//Checking if the local storage task is empty or not
// Initializing the tasks array according to the data present in the local storage
let tasks = getTasks == null ? [] : getTasks
//Getting the last object id from the task tasks 
let id = tasks.length == 0 ? 0 : tasks[tasks.length - 1].id + 1;
/* -------------------- Event Listener for searching task ------------------- */
search.addEventListener('change', (e) => {
    let searchValue = e.target.value;
    // Gets the filtered tasks into another array
    let filteredTasks = tasks.filter((task) => {
        return task.task.toLowerCase().includes(searchValue.toLowerCase());
    })
    // Renders the filtered Task
    createTask(filteredTasks);
})

/* ------------ Function to render the elements of the task list ------------ */
const createTask = (task) => {
    taskMain.innerHTML = '';
    task.forEach((value) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task--item';
        let title = document.createElement('p');
        title.textContent = value.task;
        let completed = document.createElement('input');
        completed.type = 'checkbox';
        completed.className = 'task-status';
        completed.id = value.id;
        completed.checked = value.completed;
        //checked doesn't work if we use the below method
        // taskDiv.innerHTML = `
        // <p>${value.task}</p>
        // <input type="checkbox" class="task-status" id="${value.id}" "${value.completed ? "checked" : ""}">`
        /* ---------------- Adding created elements to the parent div --------------- */
        taskDiv.appendChild(title);
        taskDiv.appendChild(completed);
        taskMain.appendChild(taskDiv);
    })
}
// Rendering task if they are present. 
//Done when the page first loads
createTask(tasks);

//If task array is empty we cannot change the status
if (tasks.length != 0) {
    //Getting all the checkboxes
    const statusChange = document.querySelectorAll('.task-status');
    statusChange.forEach((checkbox) => {
        // Adding event listener to identify the specific checkbox and change the status
        checkbox.addEventListener('change', function () {
             //Getting the ID of the checkbox
            let statusId = checkbox.id;
            //Changing status of the specific object
            tasks[statusId].completed = !tasks[statusId].completed;
            //Storing the data in local storage after status change
            localStorage.setItem('taskList', JSON.stringify(tasks));

        })
    })
}
//Adding the task object to the array when the user presses the add task button
addTask.addEventListener('click', () => {
    // Changing height value to prevent overflow
    taskMain.style.height = 'auto';
    // Checking if the input is not empty. IF it is don't add the task
    if (taskInput.value != "")
        //Adding the task in the array
        tasks.push({
            id: id++,
            task: taskInput.value,
            completed: false,
        });
    // Saving task in local storage
    localStorage.setItem('taskList', JSON.stringify(tasks));
    //Re-Rendering the task items to display newly added task
    createTask(tasks);
});






