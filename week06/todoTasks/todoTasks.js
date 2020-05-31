import { Task } from './task.js'

console.log(localStorage)

let taskList = new Array()
if ("taskList" in localStorage) {
    convertAnonymousObjectsToTasks(JSON.parse(localStorage.getItem('taskList')))
}

console.log(taskList)


//taskList.push(new Task(0, "Water the Plants", "May 30, 2020", "Don't water them too much! 1/4 cup is fine. 1/2 for the Jade."))
//taskList.push(new Task(1, "Mop the Floor", "May 30, 2020", "Sweep first if you need to"))

//on load grab the array and insert it into the page
window.addEventListener("load", () => {
  showTaskList();
  document.getElementById('addTaskButton').addEventListener('click', openTaskCreator)

  document.getElementById('createTaskButton').addEventListener('click', validateTask)
  document.getElementById('closeTaskCreatorButton').addEventListener('click', closeTaskCreator)
})

function showTaskList() {
  const taskListElement = document.getElementById("tasks");
  taskListElement.innerHTML = "";
  renderTaskList(taskList, taskListElement);
}

function renderTaskList(tasks, parent) {

    if (tasks.length < 1) {
        document.getElementById('emptyState').style.display = 'block'
    } else {
        document.getElementById('emptyState').style.display = 'none'
    }

    tasks.forEach(task => {
        const taskElement = task.renderTask()
        const taskTitle = taskElement.getElementsByClassName('taskHeader')[0].getElementsByClassName('taskTitle')[0]
        const taskStatusBox = taskElement.getElementsByClassName('taskHeader')[0].getElementsByClassName('statusBox')[0]
        const taskDetails = taskElement.getElementsByClassName('taskDetails')[0]

        taskTitle.addEventListener('click', () => {
            onTaskTouched(taskDetails)
        })
        taskDetails.addEventListener('click', () => {
            onTaskTouched(taskDetails)
        })
        taskStatusBox.addEventListener('change', () => {
            onTaskStatusChange(taskStatusBox, task.id)
        })

        const deleteTaskButton = taskDetails.getElementsByClassName('deleteTaskButton')[0]
        deleteTaskButton.addEventListener('click', () => {
            onDeleteClicked(task.id)
        })

        taskStatusBox.value = task.status
        onTaskStatusChange(taskStatusBox, task.id)

        parent.appendChild(taskElement);
    }) 
}

function onTaskTouched(taskDetails) {
    const detailsStyle = taskDetails.style
    if (detailsStyle.display == 'block') {
        detailsStyle.display = 'none'
    } else {
        detailsStyle.display = 'block'
    }
}

function onTaskStatusChange(statusBox, id) {
    console.log(statusBox.value)


    taskList.filter((task) => {
        return task.id == id
    })[0].status = statusBox.value

    updateStorage()
    
    switch (statusBox.value) {
        case "inProgress":
            statusBox.style.backgroundColor = "blue"
            statusBox.parentElement.parentElement.style.border = "1px solid blue"
            statusBox.parentElement.getElementsByClassName('taskTitle')[0].style.textDecoration = "none"
            statusBox.parentElement.getElementsByClassName('taskTitle')[0].style.color = "black"
            break
            case "completed":
                statusBox.style.backgroundColor = "green"
                statusBox.parentElement.parentElement.style.border = "1px solid green"
                statusBox.parentElement.getElementsByClassName('taskTitle')[0].style.textDecoration = "line-through"
                statusBox.parentElement.getElementsByClassName('taskTitle')[0].style.color = "darkgreen"
                break
            default:
                statusBox.style.backgroundColor = "#ff9900"
                statusBox.parentElement.parentElement.style.border = "1px solid #ff9900"
                statusBox.parentElement.getElementsByClassName('taskTitle')[0].style.textDecoration = "none"
                statusBox.parentElement.getElementsByClassName('taskTitle')[0].style.color = "black"

    }

}

function onDeleteClicked(id) {
    deleteTask(id)
}

function openTaskCreator() {
    console.log("opening task creator")

    document.getElementById("taskCreator").style.display="block"
}

function closeTaskCreator() {
    document.getElementById("taskCreator").style.display="none"
    resetTaskCreator()
}

function validateTask() {
    console.log("validating task")
    const titleElement = document.getElementById('newTaskTitle')
    const date = document.getElementById('newTaskDate').value
    const description = document.getElementById('newTaskDescription').value

    if (titleElement.value == "") {
        titleElement.style.border = "1px solid red"
        return
    }

    addTask(new Task(Date.now(), titleElement.value, date, description))
}

function resetTaskCreator() {
    document.getElementById('newTaskTitle').value = ""
    document.getElementById('newTaskDate').value = ""
    document.getElementById('newTaskDescription').value = ""
}

function addTask(task) {
    taskList.push(task)

    closeTaskCreator()
    resetTaskCreator()
    showTaskList()
    updateStorage()
}

function deleteTask(id) {
    taskList = taskList.filter( (item) => {
        return item.id != id
    })
    showTaskList()
    updateStorage()
}

function updateStorage() {
    localStorage.setItem('taskList', JSON.stringify(taskList))
}

function convertAnonymousObjectsToTasks(objects) {
    console.table(objects)
    objects.forEach(object => {
        let task = new Task()
        Object.assign(task, object)
        taskList.push(task)
    })
}