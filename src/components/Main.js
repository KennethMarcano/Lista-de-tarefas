import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useInterval } from 'react-use';
import { FaExclamationCircle } from 'react-icons/fa';

import formatDate from '../services/formatDate';
import Form from './Form/index';
import Tarefas from './Tarefas';
import AuthNotifications from './AuthNotifications';
import './Main.css';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const son = require('../sounds/sound_alert.mp3');
const playAlert = new Audio(son);
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
    const [notifications, setNotifications] = useState({
        day: [],
        hour: [],
        min: [],
        expired: [],
    });
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addCheck();
        // eslint-disable-next-line
    }, [tasks]);

    useInterval(() => {
        (showNotifications && taskNotificationsTime());
    }, showNotifications ? 1000 : null);

    const checkNotification = (typeNotification, task, message, typeMessage) => {
        if (!notifications[typeNotification].includes(task)) {
            playAlert.play()
                .catch(error => {
                    console.error('error:', error);
                });
            switch (typeMessage) {
                case 'error':
                    toast.error(`${message}: "${task}"`);
                    break;
                case 'warn':
                    toast.warn(`${message}: "${task}"`);
                    break;
                default:
                    toast(`${message}: "${task}"`);
            }

            setNotifications(prevNotifications => ({
                ...prevNotifications,
                [typeNotification]: [...prevNotifications[typeNotification], task]
            }));
        }

    }

    const taskNotificationsTime = () => {
        const now = new Date();
        tasks.forEach((task, pos) => {
            if (task[1] || task[2] === '') return;
            const dueDate = new Date(formatDate(task[2]));
            const timeDifference = dueDate.getTime() - now.getTime();
            if (timeDifference < 0) {
                checkNotification(timeDifference, 'expired', task[0], '¡Atenção! Já expirou o prazo da tarefa', 'error');
                return;
            }

            if (timeDifference > 0 && timeDifference < NOTIFICATION_TIMING_IN_MILLISECONDS.FIFTEEN_MINUTES) {
                checkNotification(timeDifference, 'min', task[0], '¡Atenção! Menos de 15 minutos para vencer o prazo da tarefa', 'warn');
                return;
            }

            if (timeDifference > NOTIFICATION_TIMING_IN_MILLISECONDS.FIFTEEN_MINUTES && timeDifference < NOTIFICATION_TIMING_IN_MILLISECONDS.ONE_HOUR) {
                checkNotification(timeDifference, 'hour', task[0], '¡Atenção! Menos de 1 hora para vencer o prazo da tarefa', 'warn');
                return;
            }

            if (timeDifference > NOTIFICATION_TIMING_IN_MILLISECONDS.ONE_HOUR && timeDifference < NOTIFICATION_TIMING_IN_MILLISECONDS.ONE_DAY) {
                checkNotification(timeDifference, 'day', task[0], '¡Atenção! Menos de 1 dia para vencer o prazo da tarefa', 'warn');
                return;
            }
        });
    }

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

    const resetNotifications = (newTasks) => {
        if (index === -1) {
            setNotifications({
                day: [],
                hour: [],
                min: [],
                expired: []
            });
            return;
        }
        if (notifications.day.indexOf(newTasks[index][0]) !== -1) {
            setNotifications(prevNotifications => ({
                ...prevNotifications,
                day: [...prevNotifications.day.filter(item => item !== newTasks[index][0])]
            }));
        }
        if (notifications.hour.indexOf(newTasks[index][0]) !== -1) {
            setNotifications(prevNotifications => ({
                ...prevNotifications,
                hour: [...prevNotifications.hour.filter(item => item !== newTasks[index][0])]
            }));
        }
        if (notifications.min.indexOf(newTasks[index][0]) !== -1) {
            setNotifications(prevNotifications => ({
                ...prevNotifications,
                min: [...prevNotifications.min.filter(item => item !== newTasks[index][0])]
            }));
        }
        if (notifications.expired.indexOf(newTasks[index][0]) !== -1) {
            setNotifications(prevNotifications => ({
                ...prevNotifications,
                expired: [...prevNotifications.expired.filter(item => item !== newTasks[index][0])]
            }));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedTask = newTask[0].trim();
        if (!trimmedTask) return;

        const currentTasks = [...tasks];
        const date = document.getElementsByClassName('calendar')[0]?.value;

        const updatedTask = [trimmedTask, false, open ? '' : date];

        if (index !== -1) {
            resetNotifications(currentTasks);
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

    const handleShowNotifications = (show) => {
        if (!show) {
            setShowNotifications(show);
            return;
        }
        const currentTasks = tasks;
        const newTasks = [...currentTasks];
        resetNotifications(newTasks)
        setShowNotifications(show);
        taskNotificationsTime()
    }

    return (
        <div className='main'>
            <div className='title-auth'>
                <h1>Lista de tarefas</h1>
                <div className="dropdown">
                    <FaExclamationCircle />
                    <AuthNotifications
                        handleShowNotifications={handleShowNotifications}
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
