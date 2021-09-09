import { combineReducers } from "redux";
import summaryReducer from "./summary.reducer";

const reducers = combineReducers({
    summary: summaryReducer
})

export default summaryReducer;