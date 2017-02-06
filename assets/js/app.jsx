const React = require('react'),
      ReactDOM = require('react-dom');

import { createStore } from 'redux';
import { connect } from 'react-redux';

function getData(cityId) {
    // let cityId = '702550';
    console.log('sss', cityId);
    
    const xhr = new XMLHttpRequest(),
        host = 'http://api.openweathermap.org/data/2.5/forecast/city?id='+cityId+'&units=metric&APPID=23722e5a294348674ba0d24c7f6a1497';

    // const sessionData = sessionStorage.getItem('weather');
    const sessionData = localStorage.getItem('weather');
    
   
    xhr.open('GET', host, true);
    
    let dataParsed;
    
    if (sessionData == null || cityId !== undefined) {
        xhr.send();

        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                console.log('status', xhr.status);
            }   else {
                let response = JSON.parse(xhr.response);
                
                if (response.cod == '200') {
                    console.log('Data received');
                    // sessionStorage.setItem('weather', JSON.stringify(response));
                    localStorage.setItem('weather', JSON.stringify(response));
                    
                    console.log('Data set to sessionStorage');
                }   else {
                    console.log('Error: ', response.cod);
                }
            }
        };
        
    }   else {
        // return dataParsed = JSON.parse(sessionStorage.getItem('weather'));
        return dataParsed = JSON.parse(localStorage.getItem('weather'));
    }
}

const toShowArr = [4, 10, 15];

const citiesList = [
    {
        city: 'Lviv',
        code: 702550
    },
    {
        city: 'Kyiv',
        code: 703448
    },
    {
        city: 'Zhytomyr',
        code: 686967
    }
];

const initialState = {
    weatherData: getData(),
    cityToShow: 702550,
    itemsToShow: 10,
    itemsShow: toShowArr,
    citiesList: citiesList
};


function reducer(state = {cityToShow: 702550, itemsToShow: 10, weatherData: getData(), itemsShow: toShowArr}, action) {
    switch (action.type) {
        case 'CHANGE_CITY' : return {
            itemsToShow: state.itemsToShow,
            weatherData: state.weatherData,
            itemsShow: state.itemsShow,
            cityToShow: action.receivedCity,
            citiesList: state.citiesList
        };
        case 'SET_ITEMS_TO_SHOW' : return { 
            itemsToShow: action.receivedItems, 
            weatherData: state.weatherData,
            itemsShow: state.itemsShow,
            cityToShow: state.cityToShow,
            citiesList: state.citiesList
        };
        
        default : return state
    }
}

function setItemsToShow(receivedItems) {
    return {
        type: 'SET_ITEMS_TO_SHOW', receivedItems : receivedItems
    }
}

function setCityToShow(receivedCity) {
    return {
        type: 'CHANGE_CITY', receivedCity : receivedCity
    }
}

const store = createStore(reducer, initialState);

class ChooseCity extends React.Component {
    constructor(props) {
        super(props);
        
        this.setCity = this.setCity.bind(this)
    }
    
    setCity(event) {
        let receivedCity = event.target.value.toString();
        
        store.dispatch(setCityToShow(receivedCity));
        getData(receivedCity);
    }
    
    render() {
        let currentCity = store.getState().cityToShow;
        
        return (
            <select className="city-select" value={currentCity} onChange={this.setCity.bind(this)}>
                {
                    store.getState().citiesList.map(
                        (el, i) => 
                        <option key={i} value={el.code}>
                            {el.city}
                        </option>
                    )
                }
            </select>
        )
    }
}


class Weather extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        getData();
        
        store.subscribe(() => this.forceUpdate());
    }
    
    render() {
        const
            itemsToShow = store.getState().itemsToShow,
            weatherInfoDetailed = store.getState().weatherData.list.filter(
            (el, i) => i < itemsToShow
            );
        
        return (
            <div className="data">
                <Header />
                <div className="weather-info">
                    {
                        weatherInfoDetailed.map(
                            (el, i) => <DayInfo
                                key={i}
                                date={el.dt_txt}
                                temp_min={el.main.temp_min}
                                temp_max={el.main.temp_max}
                                humidity={el.main.humidity}
                            />
                        )
                    }
                    
                </div>
                <ItemsToShow />
                <ChooseCity />
            </div>
        )
    }
}


class DayInfo extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        
        return (
            <div className="weather-info__item">
                <div className="weather-info__item__date">
                    <p>
                        {this.props.date}
                    </p>
                </div>
                <div className="weather-info__item__temps">
                    <p>Temperatures:</p>
                    <div className="temp--min">
                        <p>min:</p>
                        <p>{this.props.temp_min} &deg;C</p>
                    </div>
                    <div className="temp--max">
                        <p>max:</p>
                        <p>{this.props.temp_max} &deg;C</p>
                    </div>
                </div>
                <div className="weather-info__item__humidity">
                    <p>Humidity:</p>
                    <div className="humidity">
                        <p>{this.props.humidity} %</p>
                    </div>
                </div>
            </div>
        )
    }
}

class ItemsToShow extends React.Component {
    constructor(props) {
        super(props);

        this.setItemsNumber = this.setItemsNumber.bind(this);
    }

    setItemsNumber(event) {

        let dataReceived = parseInt(event.target.getAttribute('data-items'));

        store.dispatch(setItemsToShow(dataReceived));
    }

    render()   {
        return (
            <ul className="items-to-show">
                {store.getState().itemsShow.map(
                    (el, i) =>
                        <li key={i}>
                            <a onClick={this.setItemsNumber.bind(this)}
                               data-items={el}>
                                {el}
                            </a>
                        </li>
                )}
            </ul>
        )
    }
}

class Header extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        console.log('data', store.getState().weatherData);
        
        const cityName = store.getState().weatherData.city.name,
              countryCode = store.getState().weatherData.city.country;
        
        return (
            <div className="header">
                <p>Displaying weather in {cityName}, {countryCode}</p>
            </div>
        )
    }
}

//render all

ReactDOM.render(
    <Weather />,
    document.querySelector('.wrapper')
);


