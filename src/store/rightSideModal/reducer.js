import { RIGHT_SIDE_MODAL } from "./actionTypes";

const initialState = {
    rightSideModal: false
}

const rightSideModal = (state = initialState, action) => {
    switch (action.type) {
        case RIGHT_SIDE_MODAL:
            state = {
                ...state,
                rightSideModal: action.payload
            }
            break;
        default:
            state = { ...state };
            break;
    }
    return state;
}

export default rightSideModal;
