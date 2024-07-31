import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Main from './components/Main';
import './App.css';

function App() {
  return <>
    <Main />
    <ToastContainer />  
  </>
}

export default App;
