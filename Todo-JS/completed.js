/* -------------------- Getting HTML Elements by their ID ------------------- */
const taskMain = document.getElementById('tasks');
const search = document.getElementById('search-todo');

/* -------------------- Getting tasks from local storage -------------------- */
let getTasks = JSON.parse(localStorage.getItem('taskList'))
//Checking if the local storage task is empty or not
// Initializing the tasks array according to the data present in the local storage
let tasks = getTasks == null ? [] : getTasks

let id = tasks.length == 0 ? 0 : tasks[tasks.length - 1].id + 1;
//Filtering out remaining tasks

function updateTask(task) {
    return task.filter((element) => element.completed == true)
}
let completedTask = updateTask(tasks);


//Event Listener for searching certain tasks
search.addEventListener('change', (e) => {
    let searchValue = e.target.value;
    let filteredTasks = completedTask.filter((task) => {
        return task.task.toLowerCase().includes(searchValue.toLowerCase());
    })
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
        // taskDiv.innerHTML = `
        // <p>${value.task}</p>
        // <input type="checkbox" class="task-status" id="${value.id}" "${value.completed ? "checked" : ""}">`

        // Adding created elements to the parent div
        taskDiv.appendChild(title);
        taskDiv.appendChild(completed);
        taskMain.appendChild(taskDiv);
    })
}

// Rendering task if they are present. Done when the page loads
createTask(completedTask);
if (tasks.length != 0) {
    const statusChange = document.querySelectorAll('.task-status');
    statusChange.forEach((checkbox) => {
        checkbox.addEventListener('change', function () {
            let statusId = checkbox.id;
            tasks[statusId].completed = !tasks[statusId].completed;
            localStorage.setItem('taskList', JSON.stringify(tasks));
            const updatedTask = updateTask(JSON.parse(localStorage.getItem('taskList')));
            createTask(updatedTask);
        })
    })
}





