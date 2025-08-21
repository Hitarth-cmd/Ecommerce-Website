import { createSlice } from '@reduxjs/toolkit'

const Cartslice= createSlice({
    name:"cart",
    initialState:{
        flag:true,
        log:false
    },
    reducers:{
        toggle:(state,action)=>{
            state.flag=(!state.flag);
        },
        logoutToggle:(state,action)=>{
            state.log=(!state.log)
        }
    }
})

export const {toggle,logoutToggle} = Cartslice.actions;
export default Cartslice.reducer;