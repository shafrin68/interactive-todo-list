let tasks = loadTasks();

const form = document.getElementById("form");
const input = document.getElementById("text");
const list = document.getElementById("list");
const count = document.getElementById("count");
const clearButton = document.getElementById("clearCompleted");

let currentFilter = "all";

function loadTasks() {
    try {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    } catch (error) {
        return [];
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    list.innerHTML = "";

    const filteredTasks = tasks.filter(function(task) {
        if (currentFilter === "active") {
            return !task.done;
        }

        if (currentFilter === "done") {
            return task.done;
        }

        return true;
    });

    filteredTasks.forEach(function(task) {
        const li = document.createElement("li");

        li.dataset.id = task.id;

        if (task.done) {
            li.classList.add("done");
        }

        const span = document.createElement("span");
        span.textContent = task.text;

        const doneButton = document.createElement("button");
        doneButton.textContent = task.done ? "Undo" : "Done";
        doneButton.dataset.action = "toggle";
        doneButton.type = "button";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.dataset.action = "delete";
        deleteButton.type = "button";

        li.append(span, doneButton, deleteButton);
        list.appendChild(li);
    });

    const remaining = tasks.filter(function(task) {
        return !task.done;
    }).length;

    count.textContent = remaining + " tasks left";
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = input.value.trim();

    if (text === "") {
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        done: false
    });

    input.value = "";

    saveTasks();
    renderTasks();
});

list.addEventListener("click", function(event) {
    const action = event.target.dataset.action;

    if (!action) {
        return;
    }

    const li = event.target.closest("li");

    if (!li) {
        return;
    }

    const id = Number(li.dataset.id);

    if (action === "delete") {
        tasks = tasks.filter(function(task) {
            return task.id !== id;
        });
    }

    if (action === "toggle") {
        tasks.forEach(function(task) {
            if (task.id === id) {
                task.done = !task.done;
            }
        });
    }

    saveTasks();
    renderTasks();
});

document.querySelectorAll("[data-filter]").forEach(function(button) {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

clearButton.addEventListener("click", function() {
    tasks = tasks.filter(function(task) {
        return !task.done;
    });

    saveTasks();
    renderTasks();
});

renderTasks();
