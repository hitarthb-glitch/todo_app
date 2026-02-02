let allUsersData = (() => {
    const storedData = localStorage.getItem('allUsersData');
    if (!storedData) return {};

    try {
        const decrypted = decryptData(storedData);
        console.log(decrypted);
        return JSON.parse(decrypted);
    } catch {
        return {};
    }
})();

let users = (() => {
    const storedData = localStorage.getItem('users');
    if (!storedData) return {};

    try {
        return JSON.parse(storedData);
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

export function authenticateUser(userName, userPassword) {
    const encryptedPassword = encryptPassword(userPassword);
    if (users[userName] === encryptedPassword) {
        return userName;
    }
    return null;
}

export function createUser(userName, userPassword) {
    if (users[userName]) {
        return null;
    }
    users[userName] = encryptPassword(userPassword);
    allUsersData[userName] = [];
    saveData();
    return userName;
}

export function getUser(userName) {
    return { userName, todos: allUsersData[userName] || [] };
}

function saveData() {
    localStorage.setItem(
        'allUsersData',
        encryptData(JSON.stringify(allUsersData))
    );
    localStorage.setItem('users', JSON.stringify(users));
}

export function addTodo(userName, task) {
    if (allUsersData[userName]) {
        allUsersData[userName].push({ task, completed: false });
        saveData();
    }
}

export function updateTodo(userName, todoIndex, newTask) {
    const user = allUsersData[userName];
    if (user && user[todoIndex]) {
        user[todoIndex].task = newTask;
        saveData();
    }
}

export function removeTodo(userName, todoIndex) {
    const user = allUsersData[userName];
    if (user && user[todoIndex]) {
        user.splice(todoIndex, 1);
        saveData();
    }
}
