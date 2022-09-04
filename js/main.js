"use strict";

const taskInput = document.querySelector("#task-text");
const allTasks = document.querySelector(".all-tasks");
const clearAllButton = document.querySelector(".btn");
const filters = document.querySelectorAll(".filters li");

// The reason we need to parse is because getItem actually returns
// a string, but we need it to be an object.

let isEditedTask = false;
let editID;

function showToDos(filter) {
    let allTodos = JSON.parse(localStorage.getItem("todoList"));
    let li = "";
    if (allTodos) {
        allTodos.forEach((todo, id) => {
            // Check if task is completed. If yes, keep the strikethrough and
            // check
            let isComplete = todo.status == "completed" ? "checked" : "";
            if (filter === todo.status || filter === "all") {
                li += `<li class="task">
                            <label for="${id}">
                                <input type="checkbox" onclick="updateStatus(this)" name="${id}" id="${id}" ${isComplete}>
                                <p class="${isComplete}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick="editTask(${id}, '${todo.name}')">
                                        <i class="uil uil-pen"><span>Edit</span></i>
                                    </li>
                                    <li onclick="deleteTask(${id})">
                                        <i class="uil uil-trash"><span>Delete</span></i>
                                    </li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    allTasks.innerHTML = li || `<span>You don't have any tasks here</span>`;
}
// Call it here so that when user comes the next time, older todo's are displayed
showToDos("all");

// Making different filters -> completed, pending and all
filters.forEach(btn => {
    btn.addEventListener("click", e => {
        document.querySelector(".active").classList.remove("active");
        btn.classList.add("active");
        showToDos(btn.id);
    });
});

function editTask(taskID, taskName) {
    taskInput.value = taskName;

    // The reason we need to parse is because getItem actually returns
    // a string, but we need it to be an object.
    editID = taskID;
    isEditedTask = true;
}

function deleteTask(taskID) {
    let allTodos = JSON.parse(localStorage.getItem("todoList"));

    // remove task from allTodos
    allTodos.splice(taskID, 1);
    localStorage.setItem("todoList", JSON.stringify(allTodos));
    showToDos("all");
}

function showMenu(selectedTask) {
    // show is updated in CSS to display the menu

    // get ul containing the list
    let menuItems = selectedTask.parentElement.lastElementChild;
    menuItems.classList.add("show");

    // If screen is clicked, stop displaying the menu
    document.addEventListener("click", e => {
        if (e.target !== selectedTask || e.target.tagName !== "I") {
            menuItems.classList.remove("show");
        }
    });
}

function updateStatus(checkedTask) {
    let allTodos = JSON.parse(localStorage.getItem("todoList"));

    // Selecting the paragraph which has name of todo task
    let taskName = checkedTask.parentElement.lastElementChild;

    if (checkedTask.checked) {
        taskName.classList.add("checked");
        allTodos[checkedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        allTodos[checkedTask.id].status = "pending";
    }
    localStorage.setItem("todoList", JSON.stringify(allTodos));
}

taskInput.addEventListener("keyup", e => {
    // Trim method removes whitespaces before and after entered string
    let userTask = taskInput.value.trim();

    if (e.key === "Enter" && userTask) {
        // Initially todoList does not exist
        // The reason we need to parse is because getItem actually returns
        // a string, but we need it to be an object.
        let allTodos = JSON.parse(localStorage.getItem("todoList"));

        // If isEditedTask is false, then we need to create a new task
        // else we need to edit it.
        if (!isEditedTask) {
            // if allTodos does not exist(i.e is null) then make it an empty array
            if (!allTodos) {
                allTodos = [];
            }
            let currTask = { name: userTask, status: "pending" };
            allTodos.push(currTask);
        } else {
            allTodos[editID].name = userTask;
            isEditedTask = false;
        }

        // After you press enter, the input area for your task will be
        // cleared
        taskInput.value = "";
        localStorage.setItem("todoList", JSON.stringify(allTodos));
        showToDos("all");
    }
});

clearAllButton.addEventListener("click", e => {
    // let allTodos = JSON.parse(localStorage.getItem("todoList"));
    // allTodos.splice(0, allTodos.length);
    // localStorage.setItem("todoList", JSON.stringify(allTodos));
    localStorage.clear();
    showToDos("all");
});
