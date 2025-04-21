document.addEventListener('DOMContentLoaded', () => {
    const columns = {
        'todo-tasks': 'Iniciado',
        'in-progress-tasks': 'Em Andamento',
        'done-tasks': 'Concluído'
    };

    let tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [];

    function saveTasks() {
        localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
    }

function createTaskElement(task) {
    const taskEl = document.createElement('div');
    taskEl.className = 'task';
    taskEl.dataset.id = task.id;

    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.style.display = 'flex';
    descriptionWrapper.style.alignItems = 'center';
    descriptionWrapper.style.justifyContent = 'center';
    descriptionWrapper.style.gap = '8px';

    // bolinha de status
    const dot = document.createElement('span');
    dot.className = 'status-dot ' + (
        task.status === 'todo-tasks' ? 'red' :
        task.status === 'in-progress-tasks' ? 'blue' : 'green'
    );
    descriptionWrapper.appendChild(dot);

    // descrição da tarefa
    const description = document.createElement('p');
    description.textContent = task.text;
    description.style.textAlign = 'center';
    description.style.fontSize = '12px';
    description.style.fontWeight = 'bold';
    description.style.cursor = 'pointer';

    // edição da tarefa
    description.addEventListener('click', async () => {
        const { value: newText } = await Swal.fire({
            title: 'Editar tarefa',
            input: 'text',
            inputValue: task.text,
            showCancelButton: true,
            confirmButtonText: 'Salvar',
            cancelButtonText: 'Cancelar'
        });

        if (newText && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    });

    descriptionWrapper.appendChild(description);

    // botão de excluir 🗑️
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.title = 'Excluir tarefa';
    deleteBtn.style.background = 'transparent';
    deleteBtn.style.border = 'none';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.fontSize = '16px';

    deleteBtn.addEventListener('click', async () => {
        const confirmDelete = await Swal.fire({
            title: 'Excluir tarefa?',
            text: 'Você tem certeza que deseja excluir esta tarefa?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir',
            cancelButtonText: 'Cancelar'
        });

        if (confirmDelete.isConfirmed) {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        }
    });

    descriptionWrapper.appendChild(deleteBtn);

    const statusBtn = document.createElement('button');
    statusBtn.textContent = 'Status';
    statusBtn.style.textAlign = 'center';
    statusBtn.style.width = '100%';
    statusBtn.style.backgroundColor = 'gray';
    statusBtn.style.fontSize = '16px';
    statusBtn.style.fontWeight = 'bold';
    statusBtn.className = 'change-status';
    statusBtn.addEventListener('click', () => changeTaskStatus(task.id));

    taskEl.appendChild(descriptionWrapper);
    taskEl.appendChild(statusBtn);

    return taskEl;
}

    function renderTasks() {
        Object.keys(columns).forEach(columnId => {
            const columnEl = document.getElementById(columnId);
            columnEl.innerHTML = '';
            tasks
                .filter(task => task.status === columnId)
                .forEach(task => {
                    const taskEl = createTaskElement(task);
                    columnEl.appendChild(taskEl);
                });
        });
    }

    function changeTaskStatus(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            const statusKeys = Object.keys(columns);
            const currentIndex = statusKeys.indexOf(task.status);
            task.status = statusKeys[(currentIndex + 1) % statusKeys.length];
            saveTasks();
            renderTasks();
        }
    }

    const addTaskButtons = document.querySelectorAll('.add-task');
    addTaskButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const { value: text } = await Swal.fire({
                title: 'Nova tarefa',
                input: 'text',
                inputLabel: 'Digite a descrição da tarefa',
                inputPlaceholder: 'Ex: Estudar para prova',
                showCancelButton: true,
                confirmButtonText: 'Adicionar',
                cancelButtonText: 'Cancelar'
            });

            if (text && text.trim() !== '') {
                const task = {
                    id: Date.now().toString(),
                    text: text.trim(),
                    status: button.previousElementSibling.id
                };
                tasks.push(task);
                saveTasks();
                renderTasks();
            }
        });
    });

    renderTasks();
});
