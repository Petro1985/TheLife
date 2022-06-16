import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));



root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

GetUserInfo().then();

async function GetUserInfo()
{
    let data = await fetch('https://localhost:7129/WhoAmI', {mode: "cors", credentials: "include"})
    console.log("------1------");
    console.log(data)

    if (data.status === 401)
    {
        data = await  fetch('https://localhost:7129/Registration', {mode: "cors", method:"POST", credentials: "include"})
        console.log("------2-------");
        console.log(data);
    }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
