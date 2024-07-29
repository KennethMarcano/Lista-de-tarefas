import React, { Component } from 'react';

import Form from './Form/index'
import Tarefas from './Tarefas';

import './Main.css'
export default class Main extends Component {
    state = {
        novaTarefa: ['', 0],
        tarefas: [],
        index: -1,
    };

    componentDidMount() {
        const tarefas = JSON.parse(localStorage.getItem('tarefas'));
        if(tarefas === null) return;
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
            novaTarefa: [e.target.value, false],
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { tarefas, index } = this.state;
        let novaTarefa = this.state.novaTarefa;
        novaTarefa[0] = novaTarefa[0].trim();
        if (tarefas.indexOf(novaTarefa[0]) !== -1 || !novaTarefa[0]) return;
        const novasTarefas = [...tarefas];
        if (index !== -1 && novaTarefa[0]) {
            novasTarefas[index] = novaTarefa;
        } else novasTarefas.push(novaTarefa);
        this.setState({
            novaTarefa: ['', 0],
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
        for (let i = 0; i < totalTarefas; i++){
            if(tarefas[i][1]) {
                listTarefas[i].classList.add('tarefa-check')
                continue;
            }
            listTarefas[i].classList.remove('tarefa-check')
        }
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
