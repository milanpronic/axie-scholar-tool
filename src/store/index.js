import { applyMiddleware, compose, createStore } from "redux";
import thunk from  "redux-thunk";
import reducers from "./reducers";
import { get_datatable } from "./actions/datatable.action";
const middleware = [thunk];

const store = createStore(reducers, compose(
    applyMiddleware(...middleware)
));
store.dispatch(get_datatable());
export default store;