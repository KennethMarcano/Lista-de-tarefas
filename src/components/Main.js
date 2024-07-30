import React, { Component } from 'react';

import Form from './Form/index'
import Tarefas from './Tarefas';
import './Main.css'

export default class Main extends Component {
    state = {
        novaTarefa: ['', 0, ''],
        tarefas: [],
        index: -1,
        open: true,
    };

    componentDidMount() {
        const tarefas = JSON.parse(localStorage.getItem('tarefas'));
        if (tarefas === null) return;
        this.setState({ tarefas });
    }

    componentDidUpdate(prevProps, prevState) {
        const { tarefas } = this.state;
        if (tarefas === prevState.tarefas) return;
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
        this.addCheck(tarefas);
    }

    handleChange = (e) => {
        this.setState({
            novaTarefa: [e.target.value, false, this.state.novaTarefa[2]],
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { tarefas, index } = this.state;
        let novaTarefa = this.state.novaTarefa;
        const date = document.getElementsByClassName('calendar')
        novaTarefa[0] = novaTarefa[0].trim();
        if (!novaTarefa[0]) return;
        if (!this.state.open && date[0].value !== '') {
            novaTarefa[2] = date[0].value; 
        }
        const novasTarefas = [...tarefas];
        if (index !== -1 && novaTarefa[0]) {
            novasTarefas[index] = novaTarefa;
        } else novasTarefas.unshift(novaTarefa);
        this.setState({
            novaTarefa: ['', 0, ''],
            tarefas: [...novasTarefas],
            index: -1,
        })
    }

    handleDelete = (e, index) => {
        const { tarefas } = this.state;
        let novasTarefas = [...tarefas];
        novasTarefas.splice(index, 1)
        this.setState({
            tarefas: [...novasTarefas],
        })
    }

    handleEdit = (e, index) => {
        const { tarefas } = this.state;
        const novasTarefas = [...tarefas]
        const calendar = document.getElementsByClassName('calendar');
        if(novasTarefas[index][2] !== '') {
                calendar[0].style.display = 'block';
                this.setState({open: false});
        }
        else{
            calendar[0].style.display = 'none';
            this.setState({open: true});}
        this.setState({
            novaTarefa: novasTarefas[index],
            index,
        })
    }

    handleCheck = (index) => {
        const { tarefas } = this.state;
        let novasTarefas = [...tarefas];
        novasTarefas[index][1] = !novasTarefas[index][1];
        this.setState({
            tarefas: [...novasTarefas],
        })
    }

    addCheck = (tarefas) => {
        const listTarefas = document.querySelectorAll('label#tarefas');
        const totalTarefas = listTarefas.length;
        for (let i = 0; i < totalTarefas; i++) {
            if (tarefas[i][1]) {
                listTarefas[i].classList.add('tarefa-check')
                continue;
            }
            listTarefas[i].classList.remove('tarefa-check')
        }
    }

    handleOpenCalendar = () => {
        const calendar = document.getElementsByClassName('calendar');
        if (this.state.open) calendar[0].style.display = 'block';
        else calendar[0].style.display = 'none';
        this.setState({
            open: !this.state.open,
        })
    }

    render() {
        const { novaTarefa, tarefas } = this.state;
        return (
            <div className='main'>
                <h1>Lista de tarefas</h1>
                <Form
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    novaTarefa={novaTarefa}
                    getDate={this.getDate}
                    handleOpenCalendar={this.handleOpenCalendar}
                />
                <Tarefas
                    tarefas={tarefas}
                    handleEdit={this.handleEdit}
                    handleDelete={this.handleDelete}
                    handleCheck={this.handleCheck}
                    addCheck={this.addCheck}
                />
            </div>
        )
    }
}
