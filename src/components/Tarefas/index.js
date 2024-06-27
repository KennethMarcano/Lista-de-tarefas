import React from "react";
import PropTypes from 'prop-types';

import { FaEdit, FaWindowClose } from 'react-icons/fa';
import './Tarefas.css'

export default function Tarefas({ tarefas, handleEdit, handleDelete }) {
    return (
        <ul className='tarefas'>
            {tarefas.map((tarefa, index) => (
                <div className="listTarefas">
                    <li key={tarefa}>
                        {tarefa}
                    </li>
                    <div className="buttons">
                        <FaEdit onClick={(e) => handleEdit(e, index)} className='edit' />
                        <FaWindowClose onClick={(e) => handleDelete(e, index)} className='delete' />
                    </div>
                </div>

            ))}
        </ul>
    )
}

Tarefas.prototypes = {
    tarefas: PropTypes.array.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
}