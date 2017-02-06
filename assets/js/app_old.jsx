const React = require('react'),
      ReactDOM = require('react-dom');

import { createStore } from 'redux';

const CARDS = [
    {
        id: 1,
        image: 'assets/img/card1.jpg',
        discount: '',
        special: '',
        name: 'Маленька пачка',
        priceOld: 9999,
        priceNew: 5000
    }, {
        id: 2,
        image: 'assets/img/card2.jpg',
        discount: 15,
        special: 'Хіт продаж',
        name: 'Середня пачка',
        priceOld: 9119,
        priceNew: 6000
    }, {
        id: 3,
        image: 'assets/img/card3.jpg',
        discount: 1,
        special: 'Хіт продаж',
        name: 'Велика пачка',
        priceOld: 100,
        priceNew: 60
    },
    {
        id: 4,
        image: 'assets/img/card2.jpg',
        discount: 11,
        special: 'Хіт',
        name: 'Міні пачка',
        priceOld: 2200,
        priceNew: 1500
    }, {
        id: 5,
        image: 'assets/img/card3.jpg',
        discount: 1,
        special: 'розпродаж',
        name: 'Екстра пачка',
        priceOld: 10,
        priceNew: 9
    }, {
        id: 6,
        image: 'assets/img/card1.jpg',
        discount: '',
        special: '',
        name: 'Маленька пачка',
        priceOld: 9999,
        priceNew: 5000
    }, {
        id: 7,
        image: 'assets/img/card2.jpg',
        discount: 15,
        special: 'Хіт продаж',
        name: 'Середня пачка',
        priceOld: 9119,
        priceNew: 6000
    }, {
        id: 8,
        image: 'assets/img/card3.jpg',
        discount: 1,
        special: 'Хіт продаж',
        name: 'Велика пачка',
        priceOld: 100,
        priceNew: 60
    },
    {
        id: 9,
        image: 'assets/img/card1.jpg',
        discount: '',
        special: '',
        name: 'Мега пачка',
        priceOld: 666,
        priceNew: 500
    }, {
        id: 10,
        image: 'assets/img/card2.jpg',
        discount: 11,
        special: 'Хіт',
        name: 'Міні пачка',
        priceOld: 2200,
        priceNew: 1500
    }, {
        id: 11,
        image: 'assets/img/card3.jpg',
        discount: 1,
        special: 'розпродаж',
        name: 'Екстра пачка',
        priceOld: 10,
        priceNew: 9
    }, {
        id: 12,
        image: 'assets/img/card3.jpg',
        discount: 1,
        special: 'новинка',
        name: 'пачка',
        priceOld: 228,
        priceNew: 10
    }
];

const initialState = {
    count: 0,
    addedOnTop: [],
    cardInfo: CARDS
};

function reducer(state = { count: 0, addedOnTop: []}, action) {
    switch (action.type) {
        case 'ADD' : return { count: state.count + action.amount, addedOnTop: action.addedItem};

        default : return state;
    }
}

function incrementAction(storeState, curAddedItem) {
    storeState.push(curAddedItem);
    
    return {
        type: 'ADD', amount: 1, addedItem : storeState
    }
}

function searchAction(updatedState) {

}

const store = createStore(reducer, initialState);

class SeedShop extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardInfo: CARDS
        };
        
        this.handleSearch = this.handleSearch.bind(this);
        this.showAdded = this.showAdded.bind(this);
    }

    componentDidMount() {
        store.subscribe(() => this.forceUpdate());
    }

    handleSearch(event) {
        // console.log('cards', store)

        let searchQuery = event.target.value.toLowerCase();

        let cardInfo = CARDS.filter(function(el) {
            let searchValue = el.name.toLowerCase();
            return searchValue.indexOf(searchQuery) !== -1;  // return element if function returns true
        });

        this.setState({
            cardInfo: cardInfo
        });
    }


    showAdded(e) {
        let data = parseInt(e.target.parentNode.getAttribute('data-counter'));
        let cart = document.querySelector('.cart__added');

        if (data > 0) {
            cart.classList.toggle('active');
        }
    }


    render() {
        let addedItemsCounter = store.getState().count;

        return (
            <div className="shop">
                <div className="header">
                    <HeaderLogo/>
                    <div className="cart">
                        <a className="cart--toggle" data-counter={addedItemsCounter} onClick={this.showAdded}>
                            <img src="assets/img/cart.png" alt="Cart"/>
                        </a>
                        <div className="cart__added">
                            {/*{console.log('sss', store.getState().addedOnTop)}*/}

                            {
                                store.getState().addedOnTop.map(function(el, i) {
                                    return <AddedItem
                                        key={el.key}
                                        id={el.key}
                                        name={el.name}
                                        priceNew={el.price}
                                    />;
                                })
                            }
                            <div className="cart__added__checkout">
                                <button className="cart-checkout">Оформити замовлення</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <SideMenu />
                    <div className="cards">
                        <div className="cards__controls">
                            <SearchForm handleSearch={this.handleSearch} />
                            <Switcher />
                        </div>

                        <div className="cards__items__list">
                            {
                                this.state.cardInfo.map(function(el) {
                                    return <CardItem
                                        key={el.id}
                                        id={el.id}
                                        name={el.name}
                                        discount={el.discount}
                                        special={el.special}
                                        priceOld={el.priceOld}
                                        priceNew={el.priceNew}
                                    />;
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class SearchForm extends React.Component {
    render() {
        return (
            <form className="search">
                <input type="search" placeholder="Search.." className="search__field" onChange={this.props.handleSearch} />
                <button className="search__submit">
                    <img src="assets/img/icon-search.png" alt="Search" />
                </button>
            </form>
        )
    }
}

class AddedItem extends React.Component {
    constructor(props) {
        super(props);

        this.removeItem = this.removeItem.bind(this);
    }

    removeItem(idToRemove) {
        console.log('got', idToRemove);
    }

    render() {
        const id = this.props.id;
        // console.log('id', id);

        return (
            <div className="cards__item">
                <div className="cards__item__info">
                    <div className="cards__item__name">
                        <a>{this.props.name}</a>
                    </div>
                    <div className="cards__item__bottom">
                        <div className="cards__item__price">
                            <div className="cards__item__price--new">
                                <p><strong>{this.props.priceNew}</strong> грн</p>
                            </div>
                        </div>
                        <button className="remove-from-cart" onClick={this.removeItem.bind(this, id)}>
                            Видалити
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

class CardItem extends React.Component {
    constructor(props) {
        super(props);

        this.addToCart = this.addToCart.bind(this);
    }

    addToCart(key, name, price, event) {
        let target = event.target;
        
        function setCounter() {
            if (!target.classList.contains('disabled')) {
                target.classList.add('disabled');
                target.setAttribute('disabled', 'disabled');
                
                store.dispatch(incrementAction(store.getState().addedOnTop, {key: key, name: name, price: price}));
                // console.log('store upd', store.getState().addedOnTop);
            }
        }
        
        setCounter();
    }
    
    render() {
        const photoStyle = {
            backgroundImage: "url('assets/img/card1.jpg')"
        };
        
        const key = this.props.id;
        const name = this.props.name;
        const price = this.props.priceNew;

        const discount = this.props.discount,
              special = this.props.special;

        function checkDiscount() {
            if (discount !== '') {
                return (
                    <div className="cards__item__discount">
                        <p>{discount}%</p>
                    </div>

                )
            }   else {
                return false
            }
        }

        function checkSpecial() {
            if (special !== '') {
                return (
                    <div className="cards__item__mark">
                        <p>{special}</p>
                    </div>

                )
            }   else {
                return false
            }
        }

        return (
            <div className="cards__item">
                <div className="cards__item__photo" style = {photoStyle}>
                    {checkDiscount()}
                    {checkSpecial()}
                </div>
                <div className="cards__item__info">
                    <div className="cards__item__name">
                        <a>{this.props.name}</a>
                    </div>
                    <label>
                        <input type="checkbox" />
                        <span className="checkbox" />
                        додати до порівняння
                    </label>
                    <div className="cards__item__bottom">
                        <div className="cards__item__price">
                            <div className="cards__item__price--old">
                                <p><strong>{this.props.priceOld}</strong></p>
                            </div>
                            <div className="cards__item__price--new">
                                <p><strong>{this.props.priceNew}</strong> грн</p>
                            </div>
                        </div>
                        <button className="add-to-cart" onClick={this.addToCart.bind(this, key, name, price)}>
                            Купить
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

class HeaderLogo extends React.Component {
    render() {
        return (
            <div className="header__logo">
                <img src="assets/img/logo.jpg" width="60" height="60" />
            </div>
        );
    }
}

class SideMenu extends React.Component {
    render() {
        return (
            <nav className="menu">
                <ul>
                    <SideMenuItem />
                    <SideMenuItem />
                    <SideMenuItem />
                    <SideMenuItem />
                </ul>
            </nav>
        )
    }
}

class SideMenuItem extends React.Component {
    render() {
        return (
            <li className="menu__item">
                <a href="#">Menu Item</a>
            </li>
        )
    }
}

class Switcher extends React.Component {
    toggleList() {
        const switcher = document.querySelector('.switcher'),
            container = document.querySelector('.cards__items__list');

        if ((typeof switcher != 'undefined') && (typeof switcher != 'undefined')) {
            container.classList.add('list');
        }
    }

    toggleGrid() {
        const switcher = document.querySelector('.switcher'),
            container = document.querySelector('.cards__items__list');

        if ((typeof switcher != 'undefined') && (typeof switcher != 'undefined')) {
            container.classList.remove('list');
        }
    }

    render() {
        return (
            <ul className="switcher">
                <li>
                    <a className="switcher__list" onClick={this.toggleList}>
                        <img src="assets/img/list.png" width="30" height="30" alt="List View" />
                    </a>
                </li>
                <li>
                    <a className="switcher__grid" onClick={this.toggleGrid}>
                        <img src="assets/img/grid.png" width="30" height="30" alt="Grid View" />
                    </a>
                </li>
            </ul>
        )
    }
}

//render all

ReactDOM.render(
    <SeedShop />,
    document.querySelector('.wrapper')
);
