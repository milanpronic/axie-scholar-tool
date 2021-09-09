import axios from "axios";
import {SET_TABLEDATA} from './type';
export const get_datatable = () => dispatch => {
    axios.get(process.env.REACT_APP_BACKEND_API + '/api/scholars').then(res => {
        const { data } = res;
        dispatch({
            type: SET_TABLEDATA,
            payload: data
        })
    })
}