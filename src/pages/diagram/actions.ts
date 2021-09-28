import { postAPI } from '../../apiCalls/functions/index';
import * as actionTypes from './actionTypes';

export function updateCanvasJson(content:any) {
    return {
        type: actionTypes.UPDATE_CANVAS_STATE,
        payload:content,
    };
}

export function updateCanvasRightBar(content:any) {
    return {
        type: actionTypes.UPDATE_RIGHT_BAR,
        payload:content,
    };
}

export function updateCanvasMessage(messageType:string, message:string,  messageTime:string, content:any) {
    return {
        type: actionTypes.CANVAS_MESSAGE_UPDATE,
        messageType: messageType,
        messageTime:messageTime,
        payload:message,
        content:content
    };
}
