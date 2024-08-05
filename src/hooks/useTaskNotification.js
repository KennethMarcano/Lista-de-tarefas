import { useState } from 'react';
import { toast } from 'react-toastify';

import formatDate from '../services/formatDate';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const son = require('../sounds/sound_alert.mp3');
const playAlert = new Audio(son);

export function useTaskNotification() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState({
        day: [],
        hour: [],
        min: [],
        expired: [],
    });

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

    const taskNotificationsTime = (tasks, NOTIFICATION_TIMING_IN_MILLISECONDS) => {
        const now = new Date();
        tasks.forEach((task) => {
            if (task[1] || task[2] === '') return;
            const dueDate = new Date(formatDate(task[2]));
            const timeDifference = dueDate.getTime() - now.getTime();
            if (timeDifference < 0) {
                checkNotification('expired', task[0], '¡Atenção! Já expirou o prazo da tarefa', 'error');
                return;
            }

            if (timeDifference > 0 && timeDifference < NOTIFICATION_TIMING_IN_MILLISECONDS.FIFTEEN_MINUTES) {
                checkNotification('min', task[0], '¡Atenção! Menos de 15 minutos para vencer o prazo da tarefa', 'warn');
                return;
            }

            if (timeDifference > NOTIFICATION_TIMING_IN_MILLISECONDS.FIFTEEN_MINUTES && timeDifference < NOTIFICATION_TIMING_IN_MILLISECONDS.ONE_HOUR) {
                checkNotification('hour', task[0], '¡Atenção! Menos de 1 hora para vencer o prazo da tarefa', 'warn');
                return;
            }

            if (timeDifference > NOTIFICATION_TIMING_IN_MILLISECONDS.ONE_HOUR && timeDifference < NOTIFICATION_TIMING_IN_MILLISECONDS.ONE_DAY) {
                checkNotification('day', task[0], '¡Atenção! Menos de 1 dia para vencer o prazo da tarefa', 'warn');
                return;
            }
        });
    }

    const resetNotifications = (newTasks, index = -1) => {
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

    const updateShowNotifications = (show, tasks, NOTIFICATION_TIMING_IN_MILLISECONDS) => {
        if (!show) {
            setShowNotifications(show);
            return;
        }
        const currentTasks = tasks;
        const newTasks = [...currentTasks];
        resetNotifications(newTasks);
        setShowNotifications(show);
        taskNotificationsTime(tasks, NOTIFICATION_TIMING_IN_MILLISECONDS);
    }


    return { taskNotificationsTime, resetNotifications, showNotifications, updateShowNotifications }
}