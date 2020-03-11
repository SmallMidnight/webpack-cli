import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './index.less';
ReactDOM.render(<App />, document.getElementById('root'));

if(module && module.hot) {
    module.hot.accept()
}