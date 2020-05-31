export class Task {
    id = 0
    title = ""
    date = ""
    description = ""
    status = ""

    constructor(id, title, date, description) {
        this.id = id
        this.title = title
        this.date = date
        this.description = description

        this.status="todo"
    }

    renderTask() {
        const newTask = document.createElement("div");
        newTask.classList.add("task")
        newTask.innerHTML = 
               `<div class="taskHeader">
                    <div class="taskTitle">${this.title}</div>
                    <select class="statusBox">
                        <option value="todo">Todo</option>
                        <option value="inProgress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div class="taskDetails">
                    <div class="taskDate">
                        ${this.date}
                    </div>
                    <div class="taskDescription">${this.description}</div>
                    <div class="deleteTaskButton">delete task</div>
                </div>`;
        return newTask;
    }

}