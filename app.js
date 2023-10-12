window.addEventListener('load', function () {
    const form = document.querySelector('#formId');
    const input = document.querySelector('#inputId');
    const taskList = document.querySelector('#taskList');
    let taskIdCounter = 1;

    // Sayfa yüklendiğinde localStorage'dan görevleri getir.
    const tasksFromLocalStorage = JSON.parse(localStorage.getItem('tasks')) || [];

    // localStorage'daki görevleri ekrana ekle.
    for (const taskText of tasksFromLocalStorage) {
        addTaskToDOM(taskText);
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const taskText = input.value.trim();

        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        // Görevi ekran üzerine ekler ve localStorage'a kaydeder.
        addTaskToDOM(taskText);
        saveTaskToLocalStorage(taskText);

        input.value = '';
        taskIdCounter++;
    });

    function addTaskToDOM(taskText) {
        const taskElement = document.createElement('li');
        taskElement.classList.add('taskId', 'bg-gray-700', 'py-4', 'rounded-xl', 'pl-3', 'flex', 'items-center', 'justify-between');
        taskElement.id = 'task-' + taskIdCounter;

        const taskContent = document.createElement('div');
        taskContent.textContent = taskText;

        const taskActions = document.createElement('div');
        taskActions.classList.add('w-[15%]', 'flex', 'items-center', 'gap-x-3', 'text-2xl');
        taskActions.innerHTML = `
            <i class="fa-solid fa-pen-to-square cursor-pointer" style="color: #2d69d2;"></i>
            <i class="fa-solid fa-trash cursor-pointer" style="color: #c31d36;"></i>
            <i class="fa-solid fa-check cursor-pointer" style="color: #2ee55c; display: none;"></i>
        `;

        taskElement.appendChild(taskContent);
        taskElement.appendChild(taskActions);

        taskList.appendChild(taskElement);

        const editIcon = taskActions.querySelector('.fa-pen-to-square');
        const checkIcon = taskActions.querySelector('.fa-check');
        const deleteIcon = taskActions.querySelector('.fa-trash');

        deleteIcon.addEventListener('click', function () {
            taskList.removeChild(taskElement);
            removeTaskFromLocalStorage(taskText); // Silinen görevi Local Storage'dan kaldır.
        });

        editIcon.addEventListener('click', function (event) {
            taskContent.contentEditable = true;
            editIcon.style.display = 'none';
            checkIcon.style.display = 'inline';
            taskContent.focus();
            event.stopPropagation();
        });

        checkIcon.addEventListener('click', function (event) {
            taskContent.contentEditable = false;
            checkIcon.style.display = 'none';
            editIcon.style.display = 'inline';
            updateTaskInLocalStorage(taskText, taskContent.textContent); // Görevi güncelle ve Local Storage'da kaydet.
            event.stopPropagation();
        });

        document.addEventListener('click', function (event) {
            if (taskContent.contentEditable === 'true' && event.target !== taskContent) {
                taskContent.contentEditable = false;
                checkIcon.style.display = 'none';
                editIcon.style.display = 'inline';
                updateTaskInLocalStorage(taskText, taskContent.textContent); // Görevi güncelle ve Local Storage'da kaydet.
            }
        });
    }

    function saveTaskToLocalStorage(taskText) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTaskFromLocalStorage(taskText) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const filteredTasks = tasks.filter(task => task !== taskText);
        localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    }

    function updateTaskInLocalStorage(oldTaskText, updatedTaskText) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const index = tasks.indexOf(oldTaskText);
        if (index !== -1) {
            tasks[index] = updatedTaskText;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
});
