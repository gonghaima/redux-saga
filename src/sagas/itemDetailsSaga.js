import { take, fork, put } from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';

import { SET_CART_ITEMS, setItemDetails } from './../actions';

export function * loadItemDetails(item) {
    console.info("Items?", item);
    const {id} = item;
    const response = yield fetch(`http://localhost:8081/items/${id}`);
    const data = yield response.json();
    const info = data[0];
    yield put(setItemDetails(info));
}

export function* itemDetailsSaga(params) {
    const {items} = yield take(SET_CART_ITEMS);
    yield items.map(item=>fork(loadItemDetails, item));
}