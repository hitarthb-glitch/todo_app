
import { authenticateUser, createUser, getUser, addTodo, updateTodo, removeTodo } from './user.js';
import { getUsers, saveUsers, getCurrentUserName, setCurrentUserName, removeCurrentUserName } from './storage.js';

export function init() {
    setupEventListeners();
}

function setupEventListeners() {
    const loginButton = document.getElementById('login');
    const logoutButton = document.getElementById('logout');
    const dialog = document.getElementById('form-dialog');
    const form = document.getElementById('login-form');
    const todoForm = document.getElementById('todoForm');

    loginButton.addEventListener('click', () => {
        dialog.showModal();
    });

    logoutButton.addEventListener('click', () => {
        removeCurrentUserName();
        loginButton.style.display = 'inline-block';
        logoutButton.setAttribute('hidden', true);
        document.querySelector('.login-container p').style.display = 'block';
        document.getElementById('mainTodoList').style.display = 'none';
        const userInfo = document.getElementById('user-info');
        userInfo.style.display = 'none';
        renderTodos();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        handleLogin();
    });

    todoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        handleAddTodo();
    });
}

function handleLogin() {
    const userName = document.getElementById('name').value.trim();
    const userPassword = document.getElementById('password').value.trim();

    if (!userName || !userPassword) return;


    let authenticatedUser = authenticateUser(userName, userPassword);
    if (authenticatedUser !== null) {
 
        document.getElementById('form-dialog').close();
        document.getElementById('login-form').reset();

        document.getElementById('login').style.display = 'none';
        document.getElementById('logout').removeAttribute('hidden');
        document.querySelector('.login-container p').style.display = 'none';
        document.getElementById('mainTodoList').style.display = 'block';

        const userInfo = document.getElementById('user-info');
        const userNameSpan = document.getElementById('user-name');
        userNameSpan.textContent = userName;
        userInfo.style.display = 'inline';

        setCurrentUserName(authenticatedUser);
        renderTodos();
        return;
    }

    
    const existingUsers = getUsers();
    if (existingUsers[userName]) {
        
        showMessage('Username or password is incorrect.');
        return;
    }

  
    authenticatedUser = createUser(userName, userPassword);
    if (authenticatedUser === null) {
        showMessage('Failed to create user.');
        return;
    }

    document.getElementById('form-dialog').close();
    document.getElementById('login-form').reset();

    document.getElementById('login').style.display = 'none';
    document.getElementById('logout').removeAttribute('hidden');
    document.querySelector('.login-container p').style.display = 'none';
    document.getElementById('mainTodoList').style.display = 'block';

    const userInfo = document.getElementById('user-info');
    const userNameSpan = document.getElementById('user-name');
    userNameSpan.textContent = userName;
    userInfo.style.display = 'inline';

    setCurrentUserName(authenticatedUser);
    renderTodos();
}

function handleAddTodo() {
    const currentUserName = getCurrentUserName();
    if (currentUserName === null) {
        showLoginMessage();
        return;
    }

    const todoInput = document.getElementById('todoInput');
    const task = todoInput.value.trim();
    if (task) {
        addTodo(currentUserName, task);
        todoInput.value = '';
        renderTodos();
    }
}

function showMessage(message) {
    const existingMessage = document.querySelector('.login-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'login-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #ff6b6b;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-weight: bold;
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

function showLoginMessage() {
    showMessage('Please login first to add todos!');
}

export function renderTodos() {
    const currentUserName = getCurrentUserName();
    if (currentUserName === null) return;

    const user = getUser(currentUserName);
    if (!user || !user.todos) return;

    const todoList = document.getElementById('mainTodoList');
    todoList.innerHTML = '';

    user.todos.forEach((todo, index) => {
        const li = document.createElement('li');
        const div = document.createElement('div');
        div.className = 'todo-item';

        const span = document.createElement('span');
        span.textContent = todo.task;
        if (todo.completed) span.style.textDecoration = 'line-through';

        const editIcon = document.createElement('span');
        editIcon.className = 'icon';
        editIcon.innerHTML = '✏️';
        editIcon.addEventListener('click', () => editTodo(index));

        const doneIcon = document.createElement('span');
        doneIcon.className = 'icon';
        doneIcon.innerHTML = '✅';
        doneIcon.addEventListener('click', () => handleRemoveTodo(index));

        div.appendChild(span);
        div.appendChild(editIcon);
        div.appendChild(doneIcon);
        li.appendChild(div);
        todoList.appendChild(li);
    });
}

function editTodo(index) {
    const currentUserName = getCurrentUserName();
    if (currentUserName === null) return;

    const user = getUser(currentUserName);
    if (!user || !user.todos) return;

    const todo = user.todos[index];
    const li = document.querySelectorAll('#mainTodoList li')[index];
    const div = li.querySelector('.todo-item');
    div.innerHTML = '';

    const input = document.createElement('input');
    input.value = todo.task;

    const editButtonsDiv = document.createElement('div');
    editButtonsDiv.className = 'edit-buttons';

    const saveBtn = document.createElement('button');
    saveBtn.innerHTML = '✔️';
    saveBtn.addEventListener('click', () => {
        updateTodo(currentUserName, index, input.value.trim());
        renderTodos();
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.innerHTML = '❌';
    cancelBtn.addEventListener('click', () => renderTodos());

    editButtonsDiv.appendChild(saveBtn);
    editButtonsDiv.appendChild(cancelBtn);

    div.appendChild(input);
    div.appendChild(editButtonsDiv);
}

function handleRemoveTodo(index) {
    const currentUserName = getCurrentUserName();
    if (currentUserName === null) return;

    removeTodo(currentUserName, index);
    renderTodos();
}
