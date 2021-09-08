import { SET_TABLEDATA } from "../actions/type";

const data = {
    list: [],
    loading: true
};

export default function(state = data, action) {
    console.log(action);
    switch(action.type) {
        case SET_TABLEDATA:
            return {...state, list: action.payload, loading: false};
            break;
        default:
            return {...state};
            break;
    }
}