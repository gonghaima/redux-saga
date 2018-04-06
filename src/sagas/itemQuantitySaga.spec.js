import { takeLatest, select, put, call } from 'redux-saga/effects';
import fetch from 'isomorphic-fetch';
import { 
    INCREASE_ITEM_QUANTITY,
    DECREASE_ITEM_QUANTITY,
    setItemQuantityFetchStatus,
    decreaseItemQuantity,
    FETCHING,FETCHED
} from './../actions';
import { itemQuantitySaga, handleIncreaseItemQuantity } from './itemQuantitySaga';

import { fromJS } from 'immutable';
import { currentUserSelector } from '../selectors';

describe("item quantity saga",()=>{
    let item;
    let user;
    beforeEach(()=>{
        item={id: 12345};
        user = fromJS({id:"ABCDE"});
    });

    describe("handle increase item quantity",()=>{
        let gen;
        beforeEach(()=>{
            gen = handleIncreaseItemQuantity(item);
            expect(gen.next().value).toEqual(put(setItemQuantityFetchStatus(FETCHING)));
            expect(gen.next().value).toEqual(select(currentUserSelector));
            expect(gen.next(user).value).toEqual(call(fetch, `http://localhost:8081/cart/add/ABCDE/12345`));
        });

        test("increasing quantity successfully",()=>{
            expect(gen.next({status:200}).value).toEqual(put(setItemQuantityFetchStatus(FETCHED)));
        });

        test("decreasing quantity unsuccessfully",()=>{
            expect(gen.next({status:500}).value).toEqual(put(decreaseItemQuantity(item.id,true)));
            expect(gen.next().value).toEqual(put(setItemQuantityFetchStatus(FETCHED)));
        });
    });
});