import React, { Component } from 'react';

import Form from './Form/index'
import Tarefas from './Tarefas';

import './Main.css'
export default class Main extends Component {
    state = {
        novaTarefa: '',
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
      }

    handleChange = (e) => {
        this.setState({
            novaTarefa: e.target.value,
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { tarefas, index } = this.state;
        let { novaTarefa } = this.state;
        novaTarefa = novaTarefa.trim(); //esto es para quitar los espacios sobrantes al comienzo y al final
        if (tarefas.indexOf(novaTarefa) !== -1 || !novaTarefa) return; //se comprueba que no exista dicha tarea
        const novasTarefas = [...tarefas]; //para no modificar el valor del estado, estas solo se modifican por el serState
        if (index !== -1 && novaTarefa) { //se verifica atraves de la bandera index si se esta editando o creando una tarea nueva
            novasTarefas[index] = novaTarefa;
        } else novasTarefas.push(novaTarefa);
        this.setState({
            tarefas: [...novasTarefas],
            novaTarefa: '',
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


    render() {
        const { novaTarefa, tarefas } = this.state;
        return (
            <div className='main'>
                <h1>Lista de tarefas solucionada</h1>
<<<<<<< HEAD
=======
                <p>uma nova linea</p>
>>>>>>> lista-tarefas-colors
                <Form
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    novaTarefa={novaTarefa}
                />

                <Tarefas
                    tarefas={tarefas}
                    handleEdit={this.handleEdit}
                    handleDelete={this.handleDelete}
                />
            </div>
        )
    }
}
