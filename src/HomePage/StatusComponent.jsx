import { useState ,useEffect } from "react";
import { MDBBadge } from 'mdbreact';
export const DestResult = ({ hash }) => {
    return (
        <div>
        {hash && hash[0] ? <div><a href={"https://explorer.roninchain.com/tx/" + hash[0]} target="_blank">{hash[0].substr(0,6) + "..." + hash[0].substr(-4)}</a><br/></div> : ""}
        {hash && hash[1] ? <div><a href={"https://explorer.roninchain.com/tx/" + hash[1]} target="_blank">{hash[1].substr(0,6) + "..." + hash[1].substr(-4)}</a><br/></div> : ""}
        {hash && hash[2] ? <div><a href={"https://explorer.roninchain.com/tx/" + hash[2]} target="_blank">{hash[2].substr(0,6) + "..." + hash[2].substr(-4)}</a></div> : ""}
        </div>
    )
}

export const PaymentStatus = ({ status, last_date }) => {
    if(status == undefined) return '';
    const vv = {
        0: ['UNPAID', 'text-warning'],
        1: ['PAID', 'text-muted'],
        2: ['PENDING', 'text-info'],
        3: ['PENDING PAYMENT', 'text-success'],
        4: ['FAILED', 'text-danger']
    }
    return (
        <label className={`${vv[status][1]} font-weight-bold`}>{vv[status][0]} {
            last_date && (status == 0 || status == 3) ? 
                <small><br />Last paid on <br/>{last_date.substr(0, 10)}</small>
            : last_date && (status == 1) ?
                <small><br />Paid on <br/>{last_date.substr(0, 10)}</small>
            :
                ""}</label>
    )
}

export const ClaimStatus = ({ status }) => {
    if(status == undefined) return '';
    const vv = {
        0: ["NOT AVAILABLE", 'warning'],
        1: ["CLAIMED", 'light'],
        2: ["PENDING", 'info'],
        3: ["CLAIMABLE", "success"],
        4: ['FAILED', 'danger']
    }
    return (
        <MDBBadge color={vv[status][1]} pill className="px-4 py-2">
            {vv[status][0]}
        </MDBBadge>
    )
}