import {
    SET_ERRORS,
    LOADING_UI,
    CLEAR_ERRORS,
    GetUIStateType,
    SetErrorsActionType,
    LoadingUIActionType,
    ClearErrorsActionType
} from '../types/AuthTypes';

const initialState: GetUIStateType = {
    loading: false,
    errors: ''
}
export const uiReducer = (
    state = initialState, 
    action: SetErrorsActionType | LoadingUIActionType | ClearErrorsActionType,
) : GetUIStateType => {

    switch (action.type) {
        case SET_ERRORS:
            return {
                ...state,
                loading: false,
                errors: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                loading: false,
                errors: ''
            };
        case LOADING_UI:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}

