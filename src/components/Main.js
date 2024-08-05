import React, { useEffect, useState } from 'react';
import { useInterval } from 'react-use';
import { FaExclamationCircle } from 'react-icons/fa';

import { useTaskNotification } from '../hooks/useTaskNotification';
import Form from './Form/index';
import Tarefas from './Tarefas';
import AuthNotifications from './AuthNotifications';
import './Main.css';


const NOTIFICATION_TIMING_IN_MILLISECONDS = {
    ONE_MINUTE: 60000,
    FIFTEEN_MINUTES: 900000,
    ONE_HOUR: 3600000,
    ONE_DAY: 86400000,
};

export default function Main() {
    const [newTask, setNewTask] = useState(['', false, '']);
    const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);
    const [index, setIndex] = useState(-1);
    const [open, setOpen] = useState(true);
    const { taskNotificationsTime, resetNotifications, showNotifications, updateShowNotifications } = useTaskNotification();


    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addCheck();
        // eslint-disable-next-line
    }, [tasks]);

    useInterval(() => {
        (showNotifications && taskNotificationsTime(tasks, NOTIFICATION_TIMING_IN_MILLISECONDS));
    }, showNotifications ? 1000 : null);

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

    const handleChange = (e) => {
        setNewTask([e.target.value, false, newTask[2]])
    }

    const handleSubmit = (e) => {
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

    const handleDelete = (pos) => {
        const currentTasks = tasks;
        // eslint-disable-next-line
        const deleteConfirm = confirm(`Certeza que você quer apagar a tarefa: \n ${currentTasks[pos][0]}`);
        if (!deleteConfirm) return;
        const newTasks = [...currentTasks];
        newTasks.splice(pos, 1);
        setTasks(newTasks);
    }

    const handleEdit = (pos) => {
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

    const handleCheck = (pos) => {
        const newTasks = [...tasks];
        newTasks[pos][1] = !newTasks[pos][1];
        setTasks(newTasks);
    }

    const handleOpenCalendar = () => {
        const calendar = document.getElementsByClassName('calendar');
        if (open) calendar[0].style.display = 'flex';
        else calendar[0].style.display = 'none';
        setOpen(!open)
    }

    return (
        <div className='main'>
            <div className='title-auth'>
                <h1>Lista de tarefas</h1>
                <div className="dropdown">
                    <FaExclamationCircle />
                    <AuthNotifications
                        handleShowNotifications={(show) => updateShowNotifications(show, tasks, NOTIFICATION_TIMING_IN_MILLISECONDS)}
                    />
                </div>
            </div>

            <Form
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                novaTarefa={newTask}
                handleOpenCalendar={handleOpenCalendar}
            />
            <Tarefas
                tarefas={tasks}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleCheck={handleCheck}
            />
        </div>
    )
}
