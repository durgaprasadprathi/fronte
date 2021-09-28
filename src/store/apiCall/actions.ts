import { LOADING, MESSAGE, ERROR, LOADING_END } from "./actionTypes";

export function apiLoading() {
    return {
        type: LOADING,
    };
}

export function apiLoadingEnd() {
    return {
        type: LOADING_END,
    };
}

export function apiMessage(content:string) {
    return {
        type: MESSAGE,
        content:content,
    };
}

export function apiErrorMessage(content:string) {
    return {
        type: ERROR,
        content:content,
    };
}