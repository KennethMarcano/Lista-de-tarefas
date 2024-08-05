import { useState } from 'react';

export function useTask () {
    const [newTask, setNewTask] = useState(['', false, '']);
    const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);
    const [index, setIndex] = useState(-1);
    const [open, setOpen] = useState(true);

    const addCheck = () => {
        const nameTasks = document.querySelectorAll('label#tarefas');
        const checkButtonTasks = document.querySelectorAll('#check');
        const totalTasks = nameTasks.length;
        for (let i = 0; i < totalTasks; i++) {
            if (tasks[i][1]) {
                nameTasks[i].classList.add('tarefa-check');
                checkButtonTasks[i].classList.add('button-check');
                continue;
            }
            nameTasks[i].classList.remove('tarefa-check');
            checkButtonTasks[i].classList.remove('button-check');
        }
    }

    const updateTaskCurrent = (e) => {
        setNewTask([e.target.value, false, newTask[2]])
    }

    const addTask = (e, resetNotifications) => {
        e.preventDefault();
        const trimmedTask = newTask[0].trim();
        if (!trimmedTask) return;

        const currentTasks = [...tasks];
        const date = document.getElementsByClassName('calendar')[0]?.value;

        const updatedTask = [trimmedTask, false, open ? '' : date];

        if (index !== -1) {
            resetNotifications(currentTasks, index);
            currentTasks[index] = updatedTask;
        } else {
            currentTasks.unshift(updatedTask);
        }

        setTasks(currentTasks);
        setNewTask(['', false, '']);
        setIndex(-1);
    };

    const deleteTask = (pos) => {
        const currentTasks = tasks;
        // eslint-disable-next-line
        const deleteConfirm = confirm(`Certeza que você quer apagar a tarefa: \n ${currentTasks[pos][0]}`);
        if (!deleteConfirm) return;
        const newTasks = [...currentTasks];
        newTasks.splice(pos, 1);
        setTasks(newTasks);
    }

    const editTask = (pos) => {
        const currentTasks = tasks;
        const newTasks = [...currentTasks];
        const calendar = document.getElementsByClassName('calendar');
        if (newTasks[pos][2] !== '') {
            calendar[0].style.display = 'block';
            setOpen(false);
        }
        else {
            calendar[0].style.display = 'none';
            setOpen(true);
        }
        setNewTask(newTasks[pos])
        setIndex(pos)
    }

    const checkTask = (pos) => {
        const newTasks = [...tasks];
        newTasks[pos][1] = !newTasks[pos][1];
        setTasks(newTasks);
    }

    const openCloseCalendar = () => {
        const calendar = document.getElementsByClassName('calendar');
        if (open) calendar[0].style.display = 'flex';
        else calendar[0].style.display = 'none';
        setOpen(!open)
    }

    return { newTask, tasks, addCheck, updateTaskCurrent, addTask, deleteTask, editTask, checkTask, openCloseCalendar }
}