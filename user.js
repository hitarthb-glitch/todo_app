let users = (() => {
    const storedData = localStorage.getItem('users');
    if (!storedData) return {};

    try {
        const decrypted = decryptData(storedData);
        console.log(decrypted);
        return JSON.parse(encryptPassword);
       
    } catch {
        return {};
    }
})();

function encryptData(data) {
    return btoa(
        data
            .split('')
            .map(c => String.fromCharCode(c.charCodeAt(0) + 1))
            .join('')
    );
}

function decryptData(data) {
    const decoded = atob(data);
    return decoded
        .split('')
        .map(c => String.fromCharCode(c.charCodeAt(0) - 1))
        .join('');
}

function encryptPassword(password) {
    return btoa(
        password
            .split('')
            .map(c => String.fromCharCode(c.charCodeAt(0) + 1))
            .join('')
    );
}

export function authenticateUser(email, userPassword) {
    const encryptedPassword = encryptPassword(userPassword);
    if (users[email] && users[email].password === encryptedPassword) {
        return email;
    }
    return null;
}

export function createUser(firstName, lastName, email, userPassword) {
    if (users[email]) {
        return null;
    }
    users[email] = { firstName, lastName, email, password: encryptPassword(userPassword), todos: [] };
    saveData();
    return email;
}

export function getUser(email) {
    return users[email] || null;
}

function saveData() {
    localStorage.setItem('users', encryptData(JSON.stringify(users)));
}

export function addTodo(email, task) {
    if (users[email]) {
        users[email].todos.push({ task, completed: false });
        saveData();
    }
}

export function updateTodo(email, todoIndex, newTask) {
    const user = users[email];
    if (user && user.todos[todoIndex]) {
        user.todos[todoIndex].task = newTask;
        saveData();
    }
}

export function removeTodo(email, todoIndex) {
    const user = users[email];
    if (user && user.todos[todoIndex]) {
        user.todos.splice(todoIndex, 1);
        saveData();
    }
}
