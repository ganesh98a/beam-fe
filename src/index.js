import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import './index.css';
import App from './App/App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'font-awesome/css/font-awesome.min.css'
import './_style/styles.scss'
import './_style/layout/_toaster.scss';
import 'react-input-range/lib/css/index.css';
import 'react-day-picker/lib/style.css';
import 'video-react/dist/video-react.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
// To include the default styles
import 'react-rangeslider/lib/index.css';
import 'react-phone-input-2/lib/style.css';
// Import Swiper styles
import 'swiper/swiper.min.css';
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/navigation/navigation.min.css";

import { BrowserRouter as Router} from 'react-router-dom';
import jQuery from 'jquery';
// setup fake backend
//import { configureFakeBackend } from './_helpers';
//configureFakeBackend();

const store = createStore(reducers,applyMiddleware(thunk))

ReactDOM.render(
    <Provider store={store}>
      <Router>
      <App />
      </Router>
    </Provider> , document.querySelector('#root')
    );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
