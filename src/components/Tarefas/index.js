import React from "react";
import PropTypes from 'prop-types';

import { FaEdit, FaWindowClose, FaCheckSquare } from 'react-icons/fa';
import './Tarefas.css'

export default function Tarefas({ tarefas, handleEdit, handleDelete, handleCheck }) {
    return (
        <ul className='tarefas'> 
            {tarefas.map((tarefa, index) => (
                    <li key={tarefa[0]} className="listTarefas">
                        <label id="tarefas">{tarefa[0]}</label>
                        <div className="buttons">
                            <FaEdit onClick={(e) => handleEdit(e, index)} className='edit button' />
                            <FaWindowClose onClick={(e) => handleDelete(e, index)} className='delete button' />
                            <FaCheckSquare onClick={(e) => handleCheck(index) } className="check button"/>
                        </div>

                    </li>

            ))}
        </ul>
    )
}

Tarefas.prototypes = {
    tarefas: PropTypes.array.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleCheck: PropTypes.func.isRequired,
}