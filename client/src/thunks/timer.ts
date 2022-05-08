import { 
    timers,
    createTimer,
    storeTimer,
    showTimer,
    editTimer,
    updateTimer,
    destroyTimer,
} from "../actions/timer";
import { Dispatch } from "redux";
import { 
    GetTimersType, 
    CreateTimerType,
    StoreTimerType,
    ShowTimerType,
    EditTimerType,
    UpdateTimerType,
    DestroyTimerType,
 } from "../types/TimerTypes";
import {
    getTimers,
    create,
    store,
    show,
    edit,
    update,
    destroy
} from "../api/timer";
import timerApi from '../api/appwrite/timer';
import authApi from "../api/appwrite/auth";

export const attemptGetTimers = (params:any) => async (dispatch: Dispatch<GetTimersType>) => {
    // const auth = await getTimers(params)
    //     .then(response => {
    //         dispatch(timers(response));
    //     })
    //     .catch(error => error);
    
    /* when using appwrite as backend */
    await timerApi.listDocuments('').then(response => {
        dispatch(timers(response.documents));
    }).catch(error => error);
    /* when using appwrite as backend */
    
}

export const attemptCreateTimer = (params:any) => async (dispatch: Dispatch<CreateTimerType>) => {
    const auth = await create(params)
        .then(response => response.data)
        .catch(error => error);

    dispatch(createTimer(auth));
}

export const attemptStoreTimer = (params:any) => async (dispatch: Dispatch<StoreTimerType>) => {
    // const auth = await store(params)
    //     .then(response => {
    //         dispatch(storeTimer(response));
    //     })
    //     .catch(error => error);

    /* when using appwrite as backend */
    const user = await authApi.loadUser(params).then(response => {
        return response;
    }).catch(error => error);

    params.user = user["$id"];

    const timer = await timerApi.createDocument('',params, [`user:${user["$id"]}`],[`user:${user["$id"]}`]).then(response => {
        console.log('store', response);
        dispatch(storeTimer(response));
    }).catch(error => error);
    /* when using appwrite as backend */

}

export const attemptShowTimer = (params:any) => async (dispatch: Dispatch<ShowTimerType>) => {
    const auth = await show(params)
        .then(response => response.data)
        .catch(error => error);

    dispatch(showTimer(auth));
}

export const attemptEditTimer = (params:any) => async (dispatch: Dispatch<EditTimerType>) => {
    const auth = await edit(params)
        .then(response => response.data)
        .catch(error => error);

    dispatch(editTimer(auth));
}

export const attemptUpdateTimer = (params:any) => async (dispatch: Dispatch<UpdateTimerType>) => {
    const auth = await update(params)
        .then(response => response.data)
        .catch(error => error);

    dispatch(updateTimer(auth));
}

export const attemptDestroyTimer = (params:any) => async (dispatch: Dispatch<DestroyTimerType>) => {
    const auth = await destroy(params)
        .then(response => {
            dispatch(destroyTimer(params));
        })
        .catch(error => error);
}



