import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// 반드시 App(=각 페이지 CSS) 다음에 와야 동일 우선순위 규칙에서 이 레이어가 이긴다.
import './polish.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

