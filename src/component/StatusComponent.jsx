import { useState ,useEffect } from "react";
import { MDBBadge } from 'mdbreact';
export const DestResult = ({ status }) => {
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
    if(status)
    return (
        
        <a href={"https://explorer.roninchain.com/tx/" + status} target="_blank">{status.substr(0,6) + "..." + status.substr(-4)}</a>
    )
    else{
        return '';
    }
}

export const PaymentStatus = ({ status }) => {
    console.log(status);
    if(status == undefined) return '';
    const vv = {
        paid: ['PAID', 'text-muted'],
        not_paid: ['UNPAID', 'text-warning'],
        pending: ['PENDING', 'text-warning']
    }
    
        // case 2:
        //     text = 'PENDING';
        //     color = 'text-info';
    
    return (
        <label className={`${vv[status][1]} font-weight-bold`}>{vv[status][0]}</label>
    )
}

export const ClaimStatus = ({ status }) => {
    if(status == undefined) return '';
    const vv = {
        "claimed": ["CLAIMED", 'light'],
        "not_yet": ["NOT YET", 'warning']
    }
    return (
        <MDBBadge color={vv[status][1]}
        pill className="px-4 py-2">
        {vv[status][0]}
      </MDBBadge>
    )
}