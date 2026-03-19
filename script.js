const SUPABASE_URL = 'https://jutekdfijehfvfdonxpc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1dGVrZGZpamVoZnZmZG9ueHBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MjY0NTksImV4cCI6MjA4OTUwMjQ1OX0.8eD5ciRSlG-0dSlt5wvXfwLcZDAmV9grUeAuHsXmFF8';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');

let todos = [];
let currentFilter = 'all';

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentFilter = e.target.dataset.filter;
        updateFilterButtons();
        renderTodos();
    });
});

init();

async function init() {
    showLoading();
    try {
        await loadTodos();
        renderTodos();
        updateStats();
    } catch (error) {
        showError('Failed to load todos. Please refresh the page.');
        console.error('Init error:', error);
    }
}

async function loadTodos() {
    const { data, error } = await db
        .from('qta_todo_items')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    todos = data || [];
}

async function addTodo() {
    const title = todoInput.value.trim();
    if (!title) return;

    try {
        const { data, error } = await db
            .from('qta_todo_items')
            .insert([{ title, completed: false }])
            .select()
            .single();

        if (error) throw error;

        todos.unshift(data);
        todoInput.value = '';
        renderTodos();
        updateStats();
    } catch (error) {
        console.error('Error adding todo:', error);
        showError('Failed to add todo. Please try again.');
    }
}

async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
        const { error } = await db
            .from('qta_todo_items')
            .update({ completed: !todo.completed })
            .eq('id', id);

        if (error) throw error;

        todo.completed = !todo.completed;
        renderTodos();
        updateStats();
    } catch (error) {
        console.error('Error toggling todo:', error);
        showError('Failed to update todo.');
    }
}

async function deleteTodo(id) {
    if (!confirm('Delete this todo?')) return;

    try {
        const { error } = await db
            .from('qta_todo_items')
            .delete()
            .eq('id', id);

        if (error) throw error;

        todos = todos.filter(t => t.id !== id);
        renderTodos();
        updateStats();
    } catch (error) {
        console.error('Error deleting todo:', error);
        showError('Failed to delete todo.');
    }
}

async function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const newTitle = prompt('Edit todo:', todo.title);
    if (!newTitle || newTitle.trim() === todo.title) return;

    try {
        const { error } = await db
            .from('qta_todo_items')
            .update({ title: newTitle.trim() })
            .eq('id', id);

        if (error) throw error;

        todo.title = newTitle.trim();
        renderTodos();
    } catch (error) {
        console.error('Error editing todo:', error);
        showError('Failed to edit todo.');
    }
}

function renderTodos() {
    const filteredTodos = getFilteredTodos();

    if (filteredTodos.length === 0) {
        showEmptyState();
        return;
    }

    todoList.innerHTML = filteredTodos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}">
            <input
                type="checkbox"
                class="todo-checkbox"
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo('${todo.id}')"
            >
            <span class="todo-text">${escapeHtml(todo.title || '')}</span>
            <div class="todo-actions">
                <button class="edit-btn" onclick="editTodo('${todo.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteTodo('${todo.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function getFilteredTodos() {
    switch (currentFilter) {
        case 'completed': return todos.filter(todo => todo.completed);
        case 'pending': return todos.filter(todo => !todo.completed);
        default: return todos;
    }
}

function updateFilterButtons() {
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === currentFilter);
    });
}

function updateStats() {
    totalTasks.textContent = todos.length;
    completedTasks.textContent = todos.filter(todo => todo.completed).length;
}

function showLoading() {
    todoList.innerHTML = '<div class="loading">Loading todos...</div>';
}

function showError(message) {
    todoList.innerHTML = `<div class="error">${message}</div>`;
}

function showEmptyState() {
    const message = currentFilter === 'all'
        ? 'No todos yet. Add your first task above!'
        : `No ${currentFilter} todos found.`;

    todoList.innerHTML = `
        <div class="empty-state">
            <h3>${message}</h3>
            <p>Stay organized and get things done!</p>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
window.editTodo = editTodo;
