import { all } from 'redux-saga/effects'

//public
import loginSaga from './auth/login/saga';
import LayoutSaga from './layout/saga';


export default function* rootSaga() {
    yield all([
        loginSaga(),
        LayoutSaga(),
    ])
}