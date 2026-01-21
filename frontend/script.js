// API base URL - your backend runs on port 3000
const API_URL = 'http://localhost:3000/users';

// Get references to buttons and containers
const showUsersBtn = document.getElementById('showUsersBtn');
const newUserBtn = document.getElementById('newUserBtn');
const usersTableContainer = document.getElementById('usersTableContainer');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const createUserForm = document.getElementById('createUserForm');
const usersTableBody = document.getElementById('usersTableBody');

function closeModal() {
    modalOverlay.style.display = 'none';
    createUserForm.reset();
}

// Show Users
showUsersBtn.addEventListener('click', async () => {
    closeModal();
    
    usersTableContainer.style.display = 'block';
    
    await fetchUsers();
});

// New User
newUserBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
    
    createUserForm.reset();
});

closeModalBtn.addEventListener('click', () => {
    closeModal();
});

cancelBtn.addEventListener('click', () => {
    closeModal();
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// List Users
async function fetchUsers() {
    try {
        const response = await fetch(`${API_URL}/list`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        
        const users = await response.json();
        
        displayUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Error loading users. Make sure the backend server is running on port 3000.');
    }
}

function displayUsers(users) {
    usersTableBody.innerHTML = '';
    
    if (users.length === 0) {
        usersTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No users found</td></tr>';
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${user.firstName || ''}</td>
            <td>${user.lastName || ''}</td>
            <td>${user.dateOfBirth || ''}</td>
            <td>${user.username || ''}</td>
        `;
        
        usersTableBody.appendChild(row);
    });
}

createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };
    
    try {
        const response = await fetch(`${API_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create user');
        }
        
        const newUser = await response.json();
        
        alert('User created successfully!');
        
        createUserForm.reset();
        
        closeModal();
        
        if (usersTableContainer.style.display === 'block') {
            await fetchUsers();
        }
        
    } catch (error) {
        console.error('Error creating user:', error);
        alert('Error creating user: ' + error.message);
    }
});