import { useState ,useEffect } from "react";
import { MDBBadge } from 'mdbreact';
export const DestResult = ({ hash, hash1, hash2 }) => {
    // let icon, title;
    // switch(status) {
    //     case 0:
    //         icon = (<i className="fa fa-check-circle fa-2x text-muted"></i>);
    //         title = ('Perfect!');
    //         break;
    //     case 1:
    //         icon = (<i className="fa fa-times-circle fa-2x text-warning"></i>);
    //         title = ('Error.');
    //         break;
    //     case 2:
    //         icon = (<i className="fa fa-minus-circle fa-2x text-info"></i>);
    //         title = ('Hold on.');
    //         break;
    // }
    // return (
    //     <label className="d-flex align-items-center">
    //         <span>
    //             {icon}
    //         </span>
    //         <span className="ml-1">
    //         <span className="d-block font-weight-bold">{title}</span>
    //         <small className="d-block">See Details</small>
    //         </span>
    //     </label>
    // )
    
    return (
        <div>
        {hash ? <div><a href={"https://explorer.roninchain.com/tx/" + hash} target="_blank">{hash.substr(0,6) + "..." + hash.substr(-4)}</a><br/></div> : ""}
        {hash1 ? <div><a href={"https://explorer.roninchain.com/tx/" + hash1} target="_blank">{hash1.substr(0,6) + "..." + hash1.substr(-4)}</a><br/></div> : ""}
        {hash2 ? <div><a href={"https://explorer.roninchain.com/tx/" + hash2} target="_blank">{hash2.substr(0,6) + "..." + hash2.substr(-4)}</a></div> : ""}
        </div>
    )
    
}

export const PaymentStatus = ({ status }) => {
    if(status == undefined) return '';
    const vv = {
        0: ['UNPAID', 'text-warning'],
        1: ['PAID', 'text-muted'],
        2: ['PENDING', 'text-info']
    }
    return (
        <label className={`${vv[status][1]} font-weight-bold`}>{vv[status][0]}</label>
    )
}

export const ClaimStatus = ({ status }) => {
    if(status == undefined) return '';
    const vv = {
        0: ["NOT YET", 'warning'],
        1: ["CLAIMED", 'light'],
        2: ["PENDING", 'info']
    }
    return (
        <MDBBadge color={vv[status][1]} pill className="px-4 py-2">
            {vv[status][0]}
        </MDBBadge>
    )
}