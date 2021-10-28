import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const RJSSocket = (props) => {

    const dispatch = useDispatch();

    useEffect(() => {
        const connect = io(process.env.REACT_APP_BACKEND_API, { transports: ["websocket"] });

        connect.emit('message', "OK?");
        connect.on('message', (msg) => {
            if (typeof msg == 'object') {
                if (msg.type == "success") toast.success(<div>Name: {msg.name}<br />Description: {msg.message}</div>);
                else toast.warn(<div>Name: {msg.name}<br />Description: {msg.message}</div>);
            }
            else if (msg == "refresh") props.updateTable();
        });
        connect.on("update_scholar", (msg) => {
            dispatch({ type: "UPDATE_SCHOLAR", payload: msg});
        })

        // return () => {
        //     connect.off();
        //     connect.disconnect();
        // }
    }, []); //props.scholars
    return (<>
    </>);
};

export default RJSSocket;