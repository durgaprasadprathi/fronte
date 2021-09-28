import * as actionTypes from './actionTypes';

export type Diagram = {
    canvasProperties: Array<any>;
    rightBarProperty: any;
    message: Array<any>,
};

const initialState: Diagram = {
    canvasProperties: [],
    rightBarProperty: {},
    message: [] as Array<any>,

}

const diagram = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.UPDATE_CANVAS_STATE:
            state = {
                ...state,
                canvasProperties: action.payload
            }
            break;
        case actionTypes.UPDATE_RIGHT_BAR:
            state = {
                ...state,
                rightBarProperty: action.payload
            }
            break;
        case actionTypes.CANVAS_MESSAGE_UPDATE:
            state = {
                ...state,
                message:[...state.message, {
                    type:action.messageType,
                    text:action.payload,
                    time:action.messageTime,
                    content:action.content
                }]
            }
            break;
        default:
            state = { ...state };
            break;

    }
    return state;
}

export default diagram;