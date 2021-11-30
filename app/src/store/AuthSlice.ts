import { createSlice } from '@reduxjs/toolkit'

export const authSlice =  createSlice({
  name: 'auth',
  initialState: {
    jwtToken: '',
    loggedin: false,
  },
  reducers: {
    setJwtToken: (state, action) => {
      state.jwtToken = action.payload
    },
    setLoggedin: (state, action) => {
      state.loggedin = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setJwtToken, setLoggedin} = authSlice.actions

export default authSlice.reducer

export interface AuthState {
  jwtToken: string,
}