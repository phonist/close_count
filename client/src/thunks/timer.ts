import { 
    timers,
    createTimer,
    storeTimer,
    showTimer,
    editTimer,
    updateTimer,
    destroyTimer,
    errorTimer
} from "../actions/timer";
import { Dispatch } from "redux";
import { 
    GetTimersTypes, 
    CreateTimerTypes,
    StoreTimerTypes,
    ShowTimerTypes,
    EditTimerTypes,
    UpdateTimerTypes,
    DestroyTimerTypes,
    ErrorTimerTypes
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

export const attemptGetTimers = (params:any) => async (dispatch: Dispatch<GetTimersTypes>) => {
    const auth = await getTimers(params)
        .then(response => response.data)
        .catch(error => error);

    dispatch(timers(auth));
}

export const attemptCreateTimer = (params:any) => async (dispatch: Dispatch<CreateTimerTypes>) => {
    const auth = await create(params)
        .then(response => response.data)
        .catch(error => error);

    dispatch(createTimer(auth));
}

export const attemptStoreTimer = (params:any) => async (dispatch: Dispatch<StoreTimerTypes>) => {
    const auth = await store(params)
        .then(response => response.data)
        .catch(error => error);

    dispatch(storeTimer(auth));
}

export const attemptShowTimer = (params:any) => async (dispatch: Dispatch<ShowTimerTypes>) => {
    const auth = await show(params)
        .then(response => response.data)
        .catch(error => error);

    dispatch(showTimer(auth));
}

export const attemptEditTimer = (params:any) => async (dispatch: Dispatch<EditTimerTypes>) => {
    const auth = await edit(params)
        .then(response => response.data)
        .catch(error => error);

    dispatch(editTimer(auth));
}

export const attemptUpdateTimer = (params:any) => async (dispatch: Dispatch<UpdateTimerTypes>) => {
    const auth = await update(params)
        .then(response => response.data)
        .catch(error => error);

    dispatch(updateTimer(auth));
}

export const attemptDestroyTimer = (params:any) => async (dispatch: Dispatch<DestroyTimerTypes>) => {
    const auth = await destroy(params)
        .then(response => response.data)
        .catch(error => error);

    dispatch(destroyTimer(auth));
}

export const attemptErrorTimer = (params:any) => async (dispatch: Dispatch<ErrorTimerTypes>) => {
    const auth = await error(params)
        .then(response => response.data)
        .catch(error => error);

    dispatch(errorTimer(auth));
}



