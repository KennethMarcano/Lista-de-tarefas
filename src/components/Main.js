import React, { useEffect } from 'react';
import { useInterval } from 'react-use';
import { FaExclamationCircle } from 'react-icons/fa';

import { useTaskNotification } from '../hooks/useTaskNotification';
import { useTask } from '../hooks/useTask';
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
    const { taskNotificationsTime, resetNotifications, showNotifications, updateShowNotifications } = useTaskNotification();
    const { newTask, tasks, addCheck, updateTaskCurrent, addTask, deleteTask, editTask, checkTask, openCloseCalendar } = useTask();

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addCheck();
        // eslint-disable-next-line
    }, [tasks]);

    useInterval(() => {
        (showNotifications && taskNotificationsTime(tasks, NOTIFICATION_TIMING_IN_MILLISECONDS));
    }, showNotifications ? 1000 : null);

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
                handleSubmit={(e) => addTask(e, resetNotifications)}
                handleChange={updateTaskCurrent}
                novaTarefa={newTask}
                handleOpenCalendar={openCloseCalendar}
            />
            <Tarefas
                tarefas={tasks}
                handleEdit={(index) => editTask(index)}
                handleDelete={(index) => deleteTask(index)}
                handleCheck={(index) => checkTask(index)}
            />
        </div>
    )
}
