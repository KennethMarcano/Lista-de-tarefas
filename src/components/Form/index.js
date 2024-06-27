import React from 'react';
import PropTypes from 'prop-types';

import { FaPlus } from 'react-icons/fa';
import './Form.css'

export default function Form({ handleSubmit, handleChange, novaTarefa }) {
    return (
        <form onSubmit={handleSubmit} action='#' className='form'>
            <input
                onChange={handleChange}
                type='text'
                value={novaTarefa}
            />
            <button type='submit'>
                <FaPlus />
            </button>
        </form>
    )
}

//aqui atraves del modulo prototypes se establecen el tipo de dato
//que tienen que ser las variables para poder identificar mas rapido
//los errores y tambien se indica que son obligatorios
//y si se coloca que no es obligatoria cierta variable se le tiene que
// establecer un valor por defecto.
//Este proceso es recomendable y siempre se tiene que hacer cuando se trabaja 
//con componentes con React
Form.prototypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    novaTarefa: PropTypes.string.isRequired,
}