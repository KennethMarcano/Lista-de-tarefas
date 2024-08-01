import React from "react";
import PropTypes from 'prop-types';
import { FaWindowClose, FaCheckSquare } from 'react-icons/fa';

import './AuthNotifications.css'

export default function AuthNotifications({ handleShowNotifications }) {
    return (
        <div className="div">
            <h3>Permitir notificações?</h3>
            <div>
                <FaCheckSquare className="button auth" onClick={() => { handleShowNotifications(true) }} />
                <FaWindowClose className="button noauth" onClick={() => { handleShowNotifications(false) }} />
            </div>
        </div>
    )
}

AuthNotifications.prototypes = {
    handleShowNotifications: PropTypes.func.isRequired,
}