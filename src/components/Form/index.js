import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineCalendar } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';

import './Form.css'
import formatDate from '../../services/formatDate';

export default function Form({ handleSubmit, handleChange, novaTarefa, handleOpenCalendar }) {
    const [startDate, setStartDate] = useState(null);

    useEffect(() => {
        if (novaTarefa[2] === '') {
            setStartDate(new Date());
            return;
        }
        setStartDate(formatDate(novaTarefa[2]));
    }, [novaTarefa])

    const handleDateChange = (date) => {
        setStartDate(date);
    };

    return (
        <form onSubmit={handleSubmit} action='#' className='form'>
            <input
                onChange={handleChange}
                type='text'
                value={novaTarefa[0] || ''}
            />

            <button className='calendar-icon' type='button' onClick={handleOpenCalendar}>
                <AiOutlineCalendar size={15} />
            </button>

            <DatePicker
                minDate={new Date()}
                selected={startDate}
                onSelect={handleDateChange}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy HH:mm"
                popperPlacement="right-end"
                peekNextMonth
                showMonthDropdown
                dropdownMode="select"
                showTimeInput
                className='calendar'
            />
            <button type='submit'>
                <FaPlus size={15}/>
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
    novaTarefa: PropTypes.array.isRequired,
    handleOpenCalendar: PropTypes.array.isRequired,
}