/* ------------------ Comments Same as in Completed and Script JS File ----------------- */

const taskMain = document.getElementById('tasks');
const search = document.getElementById('search-todo');


function updateTask(task) {
    return task.filter((element) => element.completed == false)
}

let getTasks = JSON.parse(localStorage.getItem('taskList'))
let tasks = getTasks == null ? [] : getTasks
let id = tasks.length == 0 ? 0 : tasks[tasks.length - 1].id + 1;
let remainingTasks = updateTask(tasks);

search.addEventListener('change', (e) => {
    let searchValue = e.target.value;
    let filteredTasks = remainingTasks.filter((task) => {
        return task.task.toLowerCase().includes(searchValue.toLowerCase());
    })
    createTask(filteredTasks);
})



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
        taskDiv.appendChild(title);
        taskDiv.appendChild(completed);
        taskMain.appendChild(taskDiv);
    })
}

createTask(remainingTasks);
if (tasks.length != 0) {
    const statusChange = document.querySelectorAll('.task-status');
    statusChange.forEach((checkbox) => {
        checkbox.addEventListener('change', function () {
            let statusId = checkbox.id;
            tasks[statusId].completed = !tasks[statusId].completed;
            localStorage.setItem('taskList', JSON.stringify(tasks));
            const updatedTask = updateTask(JSON.parse(localStorage.getItem('taskList')))
            createTask(updatedTask);
        })
    })
}





