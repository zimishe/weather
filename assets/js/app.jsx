const React = require('react'),
      ReactDOM = require('react-dom');

import { createStore } from 'redux';

function getData() {
    const xhr = new XMLHttpRequest(),
        host = 'http://api.openweathermap.org/data/2.5/forecast/city?id=702550&units=metric&APPID=23722e5a294348674ba0d24c7f6a1497';

    const sessionData = sessionStorage.getItem('weather');
   
    xhr.open('GET', host, true);
    
    let dataParsed;
    
    if (sessionData == null) {
        xhr.send();

        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                console.log('status', xhr.status);
            }   else {
                let response = JSON.parse(xhr.response);
                
                if (response.cod == '200') {
                    console.log('Data received');
                    sessionStorage.setItem('weather', JSON.stringify(response));
                    
                    console.log('Data set to sessionStorage');
                }   else {
                    console.log('Error: ', response.cod);
                }
            }
        };
        
    }   else {
        return dataParsed = JSON.parse(sessionStorage.getItem('weather'));
    }
}

const initialState = {
    weatherData: getData(),
    cityToShow: 702550
};

function reducer(state = {cityToShow: 702550}, action) {
    switch (action.type) {
        case 'CHANGE_CITY' : return { cityToShow: 702550 };
        
        default : return state
    }
}

const store = createStore(reducer, initialState);

class SeedShop extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const weatherInfoDetailed = store.getState().weatherData.list;
        
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
            </div>
        )
    }
    
    componentDidMount() {
        getData();
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
                Displaying weather in {cityName}, {countryCode}
            </div>
        )
    }
}


//render all

ReactDOM.render(
    <SeedShop />,
    document.querySelector('.wrapper')
);

