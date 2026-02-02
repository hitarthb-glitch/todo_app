
export function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

export function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

export function getCurrentUserName() {
    return localStorage.getItem('currentUserName');
}

export function setCurrentUserName(userName) {
    localStorage.setItem('currentUserName', userName);
}

export function removeCurrentUserName() {
    localStorage.removeItem('currentUserName');
}
