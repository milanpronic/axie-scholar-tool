import axios from 'axios';
import {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import '../rjs.css';
const Banner = () => {
    const total = useSelector(state=>state.summary.total);
    const manager = useSelector(state=>state.summary.manager);
    const scholar = useSelector(state=>state.summary.scholar);
    const accounts = useSelector(state=>state.summary.accounts);
    const latest = useSelector(state=>{
        const dd = new Date(state.summary.latest);
        return {date: dd.getFullYear() + "/" + (dd.getMonth()+1) + "/" + dd.getDate(), time: dd.getHours() + ":" + dd.getMinutes() + ":" + dd.getSeconds()};
    });
    const [rate, setRate] = useState(0);
    useEffect(() => {
        axios.get('https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0xcc8fa225d80b9c7d42f96e9570156c65d6caaa25&vs_currencies=usd').then(res => {
            setRate(res.data["0xcc8fa225d80b9c7d42f96e9570156c65d6caaa25"]["usd"]);
        }).catch(err => {
            console.log(err);
        })
    }, []);
    return (
        <div id="rjs" className="d-flex" style={{minHeight: '235px'}}>
            <div className="container">
                <p className="mt-5 h3">UPDATE</p>
                <div className="row justify-space-between text-white">
                    <div className="col">
                        <p className="m-0 h3">{(total*rate).toFixed(0)} USD</p>
                        <p className="m-0 h6">{total} SLP</p>
                        <p className="m-0 h3">TOTAL</p>
                    </div>
                    <div className="col">
                        <p className="m-0 h3">{(manager*rate).toFixed(0)} USD</p>
                        <p className="m-0 h6">{manager} SLP</p>
                        <p className="m-0 h3">MANAGER</p>
                    </div>
                    <div className="col">
                        <p className="m-0 h3">{(scholar*rate).toFixed(0)} USD</p>
                        <p className="m-0 h6">{scholar} SLP</p>
                        <p className="m-0 h3">SCHOLAR</p>
                    </div>
                    <div className="col">
                        <p className="m-0 h3">{accounts}</p>
                        <p className="m-0 h6">-</p>
                        <p className="m-0 h3">ACCOUNTS</p>
                    </div>
                    <div className="col">
                        <p className="m-0 h3">{latest.date}</p>
                        <p className="m-0 h6">{latest.time}</p>
                        <p className="m-0 h3">LAST PAID</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner;