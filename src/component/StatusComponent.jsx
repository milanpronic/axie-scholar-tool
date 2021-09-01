import { useState } from "react";
import { useEffect } from "react";

export const DestResult = ({ status }) => {
    const [icon, setIcon] = useState('');
    const [title, setTitle] = useState('');
    useEffect(() => {
        switch(status) {
            case 0:
                setIcon(<i className="fa fa-check-circle fa-2x text-muted"></i>);
                setTitle('Perfect!');
                break;
            case 1:
                setIcon(<i className="fa fa-times-circle fa-2x text-warning"></i>);
                setTitle('Error.');
                break;
            case 2:
                setIcon(<i className="fa fa-minus-circle fa-2x text-info"></i>);
                setTitle('Hold on.');
                break;
        }
    })
    return (
        <label className="d-flex align-items-center">
            <span>
                {icon}
            </span>
            <span className="ml-1">
            <span className="d-block font-weight-bold">{title}</span>
            <small className="d-block">See Details</small>
            </span>
        </label>
    )
}

export const PaymentStatus = ({ status }) => {
    const [text, setText] = useState('');
    const [color, setColor] = useState('');
    useEffect(() => {
        switch(status) {
            case 0:
                setText('PAID');
                setColor('text-muted');
                break;
            case 1:
                setText('UNPAID');
                setColor('text-warning');
                break;
            case 2:
                setText('PENDING');
                setColor('text-info');
                break;
        }
    })
    return (
        <label className={`${color} font-weight-bold`}>{text}</label>
    )
}