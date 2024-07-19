async function init(){
    const tasks = await getTasks();
    populateTasks(tasks);

    listenButton();
    listenCheckbox();
}
init();

/**
 * Récupère toutes les taches depuis l'API
 * @returns {Promise<Array<Task>>} les taches
 */
async function getTasks(){
    try { 
        const req = await fetch('http://localhost/dwwm2024/todo/addtask.php');
        return await req.json();
    } catch (err) {
        console.error(err);
    }
}

/**
 * Récupère les données envoyée sur tasks et qui peuple le DOM
 * @param {Array<Task>} tasks les données de l'input
 * @returns {void}
 */
function populateTasks(datas){
    // On parcour le tableau
    for (const data of datas.tasks) {
        if(data.status == 'todo'){
            const todo = document.querySelector('#todo-list');
            const gabarit = `<li data-id="${data.id}" class="flex items-center space-x-2">
                                <input type="checkbox" data-id="${data.id}" class="checkbox checkbox-primary" />
                                <span>${data.task}</span>
                            </li>`
            todo.insertAdjacentHTML('afterbegin', gabarit);
            continue;
        }
        const done = document.querySelector('#done-list');
        const gabarit = `<li data-id="${data.id}" class="flex items-center space-x-2">
                            <input type="checkbox" data-id="${data.id}" checked class="checkbox checkbox-success" />
                            <span class="line-through">${data.task}</span>
                        </li>`
        done.insertAdjacentHTML('afterbegin', gabarit);
    }
}
/**
 * Récupère les données envoyée sur tasks et qui peuple le DOM
 * @param {Array<Task>} tasks les données de l'input
 * @returns {void}
 */
async function listenButton(){
    const button = document.querySelector('#add-task');
    button.addEventListener('click', async (e) => {
        e.preventDefault();
       // Récupérer le contenu du champ
        const task = document.querySelector('input[type="text"]').value;
        if(task.length <= 2){
            // Show error message on DOM after #todo-title then delete after 3 seconds
            const errorMessage = `<div id="error-message" class="alert alert-error shadow-lg">
                                    <div>La tâche doit contenir au moins 3 caractères</div>
                                </div>`;
            document.querySelector('#todo-title').insertAdjacentHTML('afterend', errorMessage);
            setTimeout(() => {
                document.querySelector('#error-message').remove();
            }, 5000);
            return;
        }

        const add = await addTask(task);
        // Si la tâche a été ajoutée, on l'ajoute dans le DOM
        if(add.success){
            addTaskToDOM(add.task);
            // Efface le champ de saisie
            document.querySelector('input[type="text"]').value = '';
            // Focus sur le champ de saisie
            document.querySelector('input[type="text"]').focus();
        }
    })
}
/** 
 * Ajoute une tâche à la BDD
 * @param {string} task le contenu du champ de saisie
 * @returns {Promise<Task>} la tâche
 */
async function addTask(task){
    try {
        const req = await fetch('http://localhost/dwwm2024/todo/addtask.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({task})
        });
        return await req.json();
    } catch (err) {
        console.error(err);
    }
}
/** 
 * Ajoute une tâche au DOM
 * @param {Task} task la tâche
 * @returns {void}
 */
function addTaskToDOM(task){
    const todo = document.querySelector('#todo-list');
    const gabarit = `<li data-id="${task.id}" class="flex items-center space-x-2">
                        <input type="checkbox" data-id="${task.id}" class="checkbox checkbox-primary" />
                        <span>${task}</span>
                    </li>`
    todo.insertAdjacentHTML('afterbegin', gabarit);
}

/**
 * Récupère les checkbox et les attache à la fonction checkboxChangeHandler
 * @returns {void}
 */
function listenCheckbox(){
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (const chk of checkboxes) {
        chk.addEventListener('change', checkboxChangeHandler);
    }
}

/**
 * Récupère les checkbox et les attache à la fonction checkboxChangeHandler
 * @param {Event} e l'événement
 * @returns {void}
 */
async function checkboxChangeHandler(e) {
    e.preventDefault();
    const id = e.target.dataset.id;
    const status = e.target.checked ? 'done' : 'todo';
    const update = await updateTask(id, status);
    if(update.success){
        updateTaskToDOM(id, status);
    }
}
/**
 * Met à jour la tâche
 * @param {string} id l'id de la tâche
 * @param {string} status le statut de la tâche
 * @returns {Promise<Task>} la tâche
 */
async function updateTask(id, status){
    try {
        const req = await fetch('http://localhost/dwwm2024/todo/addtask.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, status})
        });
        return await req.json();
    } catch (err) {
        console.error(err);
    }
}
/** 
 * Met à jour la tâche dans le DOM
 * @param {string} id l'id de la tâche
 * @param {string} status le statut de la tâche
 * @returns {void}
 */
function updateTaskToDOM(id, status){
    // Sélectionner la tâche
    const task = document.querySelector(`li[data-id="${id}"]`);
    const checkbox = task.querySelector('input[type="checkbox"]');
    const span = task.querySelector('span');

    if(status === 'done'){
        // Déplacer la tâche dans la liste des tâches terminées
        const done = document.querySelector('#done-list');
        done.insertAdjacentElement('afterbegin', task);

        // Mettre à jour les classes et l'état
        checkbox.checked = true;
        checkbox.classList.remove('checkbox-primary');
        checkbox.classList.add('checkbox-success');
        span.classList.add('line-through');
    } else {
        // Déplacer la tâche dans la liste des tâches à faire
        const todo = document.querySelector('#todo-list');
        todo.insertAdjacentElement('afterbegin', task);

        // Mettre à jour les classes et l'état
        checkbox.checked = false;
        checkbox.classList.remove('checkbox-success');
        checkbox.classList.add('checkbox-primary');
        span.classList.remove('line-through');
    }

    // Réattacher l'écouteur d'événements à la case à cocher
    checkbox.removeEventListener('change', checkboxChangeHandler);
    checkbox.addEventListener('change', checkboxChangeHandler);
}