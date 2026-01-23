import { 
    timers,
    storeTimer,
    updateTimer,
    destroyTimer,
} from "../actions/timer";
import { Dispatch } from "redux";
import { 
    GetTimersType, 
    StoreTimerType,
    UpdateTimerType,
    DestroyTimerType,
 } from "../types/TimerTypes";
import {
    getTimers,
    store,
    update,
    destroy
} from "../api/timer";

export const attemptGetTimers = () => async (dispatch: Dispatch<GetTimersType>) => {
    await getTimers()
        .then(response => {
            dispatch(timers(response));
        })
        .catch(error => error);
    
    /* when using appwrite as backend */
    // await timerApi.listDocuments('').then(response => {
    //     dispatch(timers(response.documents));
    // }).catch(error => error);
    /* when using appwrite as backend */
    
}

export const attemptStoreTimer = (params: { title: string; description: string; timer: string }) => async (dispatch: Dispatch<StoreTimerType>) => {
    await store(params)
        .then(response => {
            dispatch(storeTimer(response));
        })
        .catch(error => error);

    /* when using appwrite as backend */
    // const user = await authApi.loadUser(params).then(response => {
    //     return response;
    // }).catch(error => error);

    // params.user = user["$id"];

    // const timer = await timerApi.createDocument('',params, [`user:${user["$id"]}`],[`user:${user["$id"]}`]).then(response => {
    //     dispatch(storeTimer(response));
    // }).catch(error => error);
    /* when using appwrite as backend */

}

export const attemptUpdateTimer = (params: { id: string; [key: string]: unknown }) => async (dispatch: Dispatch<UpdateTimerType>) => {
    await update(params)
        .then(response => {
            dispatch(updateTimer(response));
        })
        .catch(error => error);
}

export const attemptDestroyTimer = (params: string) => async (dispatch: Dispatch<DestroyTimerType>) => {
    await destroy(params)
        .then(() => {
            dispatch(destroyTimer(params));
        })
        .catch(error => error);
}

