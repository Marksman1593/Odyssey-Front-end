import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {},
  tabs:[]
}

export const counterSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    removeTab: (state, action) => {
      state.tabs = action.payload
    },
    removeTabNew: (state, action) => {
      const keyToRemove = action.payload; // just pass the tab key
      state.tabs = state.tabs.filter(tab => tab.key !== keyToRemove);
    },
    incrementTab: (state, action) => {
      state.value = action.payload
    },
    setTab: (state, action) => {
      state.tabs = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { incrementTab, setTab, removeTab, removeTabNew } = counterSlice.actions

export default counterSlice.reducer