import { useState ,useEffect } from "react";
import { MDBBadge } from 'mdbreact';
export const DestResult = ({ status }) => {
    let icon, title;
    switch(status) {
        case 0:
            icon = (<i className="fa fa-check-circle fa-2x text-muted"></i>);
            title = ('Perfect!');
            break;
        case 1:
            icon = (<i className="fa fa-times-circle fa-2x text-warning"></i>);
            title = ('Error.');
            break;
        case 2:
            icon = (<i className="fa fa-minus-circle fa-2x text-info"></i>);
            title = ('Hold on.');
            break;
    }
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
    let text, color;
    switch(status) {
        case 0:
            text = 'PAID';
            color = 'text-muted';
            break;
        case 1:
            text = 'UNPAID';
            color = 'text-warning';
            break;
        case 2:
            text = 'PENDING';
            color = 'text-info';
            break;
    }
    return (
        <label className={`${color} font-weight-bold`}>{text}</label>
    )
}

export const ClaimStatus = ({ status }) => {
    return (
        <MDBBadge color={status ? 'light' : 'warning'}
        pill className="px-4 py-2">
        {status ? 'CLAIMED' : 'NOT YET'}
      </MDBBadge>
    )
}