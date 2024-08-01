import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useInterval } from 'react-use';
import { FaExclamationCircle } from 'react-icons/fa';

import formatDate from '../services/formatDate';
import Form from './Form/index';
import Tarefas from './Tarefas';
import AuthNotifications from './AuthNotifications';
import './Main.css'
// eslint-disable-next-line @typescript-eslint/no-var-requires

const son = require('../sounds/sound_alert.mp3')
const playAlert = new Audio(son);

export default function Main() {
    const [newTask, setNewTask] = useState(['', 0, '']);
    let saveTask = JSON.parse(localStorage.getItem('tasks')) || [];
    const [tasks, setTasks] = useState(saveTask);
    const [index, setIndex] = useState(-1);
    const [open, setOpen] = useState(true);
    const [notifiedDay, setNotifiedDay] = useState([]);
    const [notifiedHour, setNotifiedHour] = useState([]);
    const [notifiedMin, setNotifiedMin] = useState([]);
    const [notifiedExpired, setNotifiedExpired] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addCheck();
        // eslint-disable-next-line
    }, [tasks]);

    useInterval(() => {
        (showNotifications && taskNotificationsTime());
    }, showNotifications ? 5000 : null);

    const taskNotificationsTime = () => {
        const now = new Date();
        tasks.forEach((task, pos) => {
            if (task[1] || task[2] === '') return;
            const dueDate = new Date(formatDate(task[2]));
            const timeDifference = dueDate.getTime() - now.getTime();
            if (timeDifference < 0) {
                if (!notifiedExpired.includes(task[0])) {
                    playAlert.play()
                        .catch(error => {
                            console.error('error:', error);
                        });
                    toast.error(`¡Atenção! Já expirou o prazo da tarefa: "${task[0]}"`);
                    setNotifiedExpired((prev) => [...prev, task[0]]);
                    return;
                }
            }

            if (timeDifference > 0 && timeDifference < 900000) {
                if (!notifiedMin.includes(task[0])) {
                    playAlert.play()
                        .catch(error => {
                            console.error('error:', error);
                        });
                    toast.warn(`¡Atenção! Menos de 15 minutos para vencer o prazo da tarefa:"${task[0]}"`);
                    setNotifiedMin((prev) => [...prev, task[0]]);
                    return;
                }
            }

            if (timeDifference > 900000 && timeDifference < 3600000) {
                if (!notifiedHour.includes(task[0])) {
                    playAlert.play()
                        .catch(error => {
                            console.error('error:', error);
                        });
                    toast.warn(`¡Atenção! Menos de 1 hora para vencer o prazo da tarefa:"${task[0]}"`);
                    setNotifiedHour((prev) => [...prev, task[0]]);
                    return;
                }
            }

            if (timeDifference > 3600000 && timeDifference < 86400000) {
                if (!notifiedDay.includes(task[0])) {
                    playAlert.play()
                        .catch(error => {
                            console.error('error:', error);
                        });
                    toast.warn(`¡Atenção! Menos de 1 dia para vencer o prazo da tarefa:"${task[0]}"`);
                    setNotifiedDay((prev) => [...prev, task[0]]);
                    return;
                }
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

    const resetNotifications = (newTasks, pos = -1) => {
        if(pos === -1) {
            setNotifiedDay([])
            setNotifiedHour([])
            setNotifiedMin([])
            setNotifiedExpired([])
            return;
        }
        if (notifiedDay.indexOf(newTasks[pos][0]) !== -1) {
            setNotifiedDay((prev) => prev.filter(item => item !== newTasks[pos][0]));
        }
        if (notifiedHour.indexOf(newTasks[pos][0]) !== -1) {
            setNotifiedHour((prev) => prev.filter(item => item !== newTasks[pos][0]));
        }
        if (notifiedMin.indexOf(newTasks[pos][0]) !== -1) {
            setNotifiedMin((prev) => prev.filter(item => item !== newTasks[pos][0]));
        }
        if (notifiedExpired.indexOf(newTasks[pos][0]) !== -1) {
            setNotifiedExpired((prev) => prev.filter(item => item !== newTasks[pos][0]));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const currentTasks = tasks;
        const currentIndex = index;
        let currentNewTask = newTask;
        const date = document.getElementsByClassName('calendar');
        currentNewTask[0] = currentNewTask[0].trim();
        if (!currentNewTask[0]) return;
        if (!open && date[0].value !== '') {
            currentNewTask[2] = date[0].value;
        }
        const newTasks = [...currentTasks];
        if (currentIndex !== -1 && currentNewTask[0]) {
            resetNotifications(newTasks, currentIndex)
            newTasks[index] = currentNewTask;
        } else newTasks.unshift(currentNewTask);
        setNewTask(['', 0, '']);
        setTasks(newTasks);
        setIndex(-1);
    }

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
    }

    return (
        <div className='main'>
            <div className='title-auth'>
                <h1>Lista de tarefas</h1>
                <div className="dropdown">
                    <FaExclamationCircle/>
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
