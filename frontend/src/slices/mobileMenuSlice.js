import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'mobileMenu',
  initialState: false,
  reducers: {
    toggleMenu: (state) => {
      state = !state;
      return state;
    },
  },
});

export const { toggleMenu } = slice.actions;

export default slice.reducer;

export const selectMobileMenuState = (state) => state.mobileMenu;
