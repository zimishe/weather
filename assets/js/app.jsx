const React = require('react'),
      ReactDOM = require('react-dom');

import { createStore } from 'redux';

class SeedShop extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="data"></div>
        )
    }
}

var xhr = new XMLHttpRequest();

// 2. Конфигурируем его: GET-запрос на URL 'phones.json'
xhr.open('GET', 'http://www.metoffice.gov.uk/pub/data/weather/uk/climate/stationdata/bradforddata.txt', false);

// 3. Отсылаем запрос
xhr.send();

console.log('d', xhr.responseText);

//render all

ReactDOM.render(
    <SeedShop />,
    document.querySelector('.wrapper')
);
