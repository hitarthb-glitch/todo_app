
import { authenticateUser, createUser, getUser, addTodo, updateTodo, removeTodo } from './user.js';
import { getUsers, saveUsers, getCurrentUserName, setCurrentUserName, removeCurrentUserName } from './storage.js';

export function init() {
    const currentUserName = getCurrentUserName();
    if (currentUserName) {
        document.querySelector('.login-container').style.display = 'none';
        document.querySelector('.container-todos').style.display = 'block';
        document.getElementById('logout').removeAttribute('hidden');
        document.getElementById('mainTodoList').style.display = 'block';

        const userInfo = document.getElementById('user-info');
        const userNameSpan = document.getElementById('user-name');
        const user = getUser(currentUserName);
        userNameSpan.textContent = user.firstName + user.lastName.charAt(0);
        userInfo.style.display = 'inline';
    }
    setupEventListeners();
}

let isInitial = true;

function setupEventListeners() {
    const signInButton = document.getElementById('sign-in');
    const signUpButton = document.getElementById('sign-up');
    const logoutButton = document.getElementById('logout');
    const dialog = document.getElementById('form-dialog');
    const form = document.getElementById('login-form');
    const todoForm = document.getElementById('todoForm');

    signInButton.addEventListener('click', () => {
        document.getElementById('dialog-title').textContent = 'Sign In';
        dialog.setAttribute('data-mode', 'sign-in');
        document.getElementById('sign-in-fields').style.display = 'block';
        document.getElementById('sign-up-fields').style.display = 'none';
        document.getElementById('email').required = true;
        document.getElementById('password').required = true;
        document.getElementById('firstName').required = false;
        document.getElementById('lastName').required = false;
        document.getElementById('signUpEmail').required = false;
        document.getElementById('signUpPassword').required = false;
        dialog.showModal();
        isInitial = true;
        validateForm();
    });

    signUpButton.addEventListener('click', () => {
        document.getElementById('dialog-title').textContent = 'Sign Up';
        dialog.setAttribute('data-mode', 'sign-up');
        document.getElementById('sign-in-fields').style.display = 'none';
        document.getElementById('sign-up-fields').style.display = 'block';
        document.getElementById('email').required = false;
        document.getElementById('password').required = false;
        document.getElementById('firstName').required = true;
        document.getElementById('lastName').required = true;
        document.getElementById('signUpEmail').required = true;
        document.getElementById('signUpPassword').required = true;
        dialog.showModal();
        isInitial = true;
        validateForm();
    });

    logoutButton.addEventListener('click', () => {
        removeCurrentUserName();
        document.querySelector('.login-container').style.display = 'block';
        document.querySelector('.container-todos').style.display = 'none';
        logoutButton.setAttribute('hidden', true);
        document.getElementById('mainTodoList').style.display = 'none';
        const userInfo = document.getElementById('user-info');
        userInfo.style.display = 'none';
        renderTodos();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const mode = dialog.getAttribute('data-mode');
        if (form.checkValidity()) {
            if (mode === 'sign-in') {
                handleSignIn();
            } else if (mode === 'sign-up') {
                handleSignUp();
            }
        }
    });

   
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            isInitial = false;
            validateForm();
        });
    });

    todoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        handleAddTodo();
    });

    const todoInput = document.getElementById('todoInput');
    const addButton = document.querySelector('.container-todos button[type="submit"]');
    addButton.disabled = true; 
    todoInput.addEventListener('input', () => {
        if (todoInput.value.trim() === '') {
            addButton.disabled = true;
        } else {
            addButton.disabled = false;
        }
    });
}

function handleSignIn() {
    const email = document.getElementById('email').value.trim();
    const userPassword = document.getElementById('password').value.trim();

    if (!email || !userPassword) return;

    const authenticatedUser = authenticateUser(email, userPassword);
    if (authenticatedUser !== null) {
        document.getElementById('form-dialog').close();
        document.getElementById('login-form').reset();

        document.querySelector('.login-container').style.display = 'none';
        document.querySelector('.container-todos').style.display = 'block';
        document.getElementById('logout').removeAttribute('hidden');
        document.getElementById('mainTodoList').style.display = 'block';

        const userInfo = document.getElementById('user-info');
        const userNameSpan = document.getElementById('user-name');
        const user = getUser(authenticatedUser);
        userNameSpan.textContent = user.firstName + user.lastName.charAt(0);
        userInfo.style.display = 'inline';

        setCurrentUserName(authenticatedUser);
        renderTodos();
        return;
    }

    showMessage('Email or password is incorrect.');
}

function handleSignUp() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('signUpEmail').value.trim();
    const userPassword = document.getElementById('signUpPassword').value.trim();

    if (!firstName || !lastName || !email || !userPassword) {
        showMessage('All fields are required.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address.');
        return;
    }

    const newUser = createUser(firstName, lastName, email, userPassword);
    if (newUser === null) {
        showMessage('User already exists.');
        return;
    }

    document.getElementById('form-dialog').close();
    document.getElementById('login-form').reset();

    
    showMessage('Account created successfully! Please sign in to access your todo list.');
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
        const user = getUser(currentUserName);
        const existingTodo = user.todos.find(todo => todo.task.toLowerCase() === task.toLowerCase());
        if (existingTodo) {
            showMessage('Todo already exists!');
            return;
        }
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

    if (user.todos.length === 0) {
        todoList.style.display = 'none';
        return;
    }

    todoList.style.display = 'block';

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

function validateForm(showMessages = false) {
    const mode = document.getElementById('form-dialog').getAttribute('data-mode');
    const submitButton = document.getElementById('submit-form-button');
    let missingFields = [];

    if (mode === 'sign-in') {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email) missingFields.push('Email');
        if (!password) missingFields.push('Password');
    } else if (mode === 'sign-up') {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('signUpEmail').value.trim();
        const password = document.getElementById('signUpPassword').value.trim();

        if (!firstName) missingFields.push('First Name');
        if (!lastName) missingFields.push('Last Name');
        if (!email) missingFields.push('Email');
        if (!password) missingFields.push('Password');
    }

    if (missingFields.length > 0) {
        submitButton.disabled = true;
        submitButton.style.cursor = 'not-allowed';
        if (showMessages) {
            showMessage(`Please fill in the following fields: ${missingFields.join(', ')}`);
        }
    } else {
        submitButton.disabled = false;
        submitButton.style.cursor = 'pointer';
        const existingMessage = document.querySelector('.login-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }

    return missingFields.length === 0;
}
