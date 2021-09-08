import { combineReducers } from "redux";
import datatableReducer from "./datatable.reducer";

const reducers = combineReducers({
    datatable: datatableReducer
})

export default reducers;