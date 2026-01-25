import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  loading: boolean;
  errors: string;
}

const initialState: UiState = {
  loading: false,
  errors: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setErrors: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errors = action.payload;
    },
    clearErrors: (state) => {
      state.loading = false;
      state.errors = '';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setErrors, clearErrors, setLoading } = uiSlice.actions;
export default uiSlice.reducer;
