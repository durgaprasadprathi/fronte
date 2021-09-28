import { takeEvery, fork, put, all, call } from 'redux-saga/effects';


// Login Redux States
import { CHECK_LOGIN, LOGOUT_USER } from './actionTypes';
import { apiError, loginUserSuccessful, logoutUserSuccess } from './actions';

import { postAPINoToken } from "../../../apiCalls/functions/index"
import { LOGIN_API } from "../../../apiCalls/urls/executionModule/login"


// AUTH related methods
const postLogin = async(data) => {

    let result = await postAPINoToken(LOGIN_API, data)
    console.log(result)
    if(result){
        return result
    }
}

//If user is login then dispatch redux action's are directly from here.
function* loginUser({ payload: { user, history } }) {
        try {

            const response = yield call(postLogin, {username: user.username, password: user.password});
            console.log(response)
            if(response.status){
                localStorage.setItem("authUser", JSON.stringify(response));
                yield put(loginUserSuccessful(response));
                history.push('/organization');
            }
            else{

            } 
            

        } catch (error) {
            yield put(apiError(error));
        }
}


function* logoutUser({ payload: { history } }) {
    try {
        localStorage.removeItem("authUser");

        history.push('/login');
    } catch (error) {
        yield put(apiError(error));
    }
}

export function* watchUserLogin() {
    yield takeEvery(CHECK_LOGIN, loginUser)
}

export function* watchUserLogout() {
    yield takeEvery(LOGOUT_USER, logoutUser)
}

function* loginSaga() {
    yield all([
        fork(watchUserLogin),
        fork(watchUserLogout),
    ]);
}

export default loginSaga;