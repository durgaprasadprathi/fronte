import { LOADING, MESSAGE, ERROR, LOADING_END } from "./actionTypes";

export type InfluencerDetail = {
    error: string;
    message: string;
    loading: boolean;
};
const initialState = {
    error: "",
    message: "",
    loading: false
}

const login = (state = initialState, action: any) => {
    switch (action.type) {
        case LOADING:
            state = {
                ...state,
                loading: true,
                message: "",
                error: ""
            }
            break;
        case LOADING_END:
            state = {
                ...state,
                loading: false,
                message: "",
                error: ""
            }
            break;
        case MESSAGE:
            state = {
                ...state,
                loading: false,
                message: action.content,
                error: ""
            }
            break;

        case ERROR:
            state = {
                ...state,
                loading: false,
                error: action.content,
                message: ""
            }
            break;

        default:
            state = { ...state };
            break;
    }
    return state;
}

export default login;