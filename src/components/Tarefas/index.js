import React from "react";
import PropTypes from 'prop-types';

import { FaEdit, FaWindowClose, FaCheckSquare } from 'react-icons/fa';
import './Tarefas.css'

export default function Tarefas({ tarefas, handleEdit, handleDelete, handleCheck }) {
    return (
        <ul className='tarefas'>
            {
                tarefas.map((tarefa, index) => (
                    <li key={index} className="listTarefas">
                        <div className="check-task">
                            <div>
                                <FaCheckSquare onClick={() => handleCheck(index)} className='check button' id="check" />
                            </div>
                            <label id="tarefas">{tarefa[0]}</label>
                        </div>
                        <div className="date-buttons">
                            <label id="taskDate">{tarefa[2]}</label>
                            <div className="buttons">
                                <FaEdit onClick={() => handleEdit(index)} className='edit button' />
                                <FaWindowClose onClick={() => handleDelete(index)} className='delete button' />
                            </div>
                        </div>
                    </li>
                ))
            }
        </ul>
    )
}

Tarefas.prototypes = {
    tarefas: PropTypes.array.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleCheck: PropTypes.func.isRequired,
}