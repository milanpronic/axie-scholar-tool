import React,{useState, useEffect, Fragment} from 'react';
import { MDBBtn, MDBSelect , MDBDataTableV5 , MDBIcon, MDBInput } from "mdbreact";
import { FormControl, InputLabel,OutlinedInput,InputAdornment, NativeSelect, Fab } from '@material-ui/core';
const Axie = () => {
    const [tableData, setTableData] = useState({
      columns: [
        {
          label: "Name",
          field: "name",
          sort: "asc",
          width: 150
        },
        {
          label: "Claim Status",
          field: "claim",
          sort: "asc",
          width: 270
        },
        {
          label: "Account Total",
          field: "account",
          sort: "asc",
          width: 200
        },
        {
          label: "Schola Share",
          field: "scholar",
          sort: "asc",
          width: 100
        },
        {
          label: "Manager Share",
          field: "manager",
          sort: "asc",
          width: 150
        },
        {
          label: "Payment Status",
          field: "payment",
          sort: "asc",
          width: 100
        },
        {
          label: "Destination Match",
          field: "dest",
          sort: "asc",
          width: 100
        }
      ],
      rows: [
        {
          name: "Tiger Nixon",
          claim: "System Architect",
          account: "Edinburgh",
          scholar: "61",
          manager: "2011/04/25",
          payment: <label className="h6 text-muted">PAID</label>,
          dest: (
            <label className="d-flex align-items-center">
              <span>
                <i className="fa fa-check-circle fa-2x text-muted"></i>
              </span>
              <span className="ml-1">
                <span className="d-block font-weight-bold">Error.</span>
                <small className="d-block">See Details</small>
              </span>
              
            </label>
          )
        },
        {
          name: "Tiger Nixon",
          claim: "System Architect",
          account: "Edinburgh",
          scholar: "61",
          manager: "2011/04/25",
          payment: <label className="text-warning h6">UNPAID</label>,
          dest: (
            <label className="d-flex align-items-center">
              <span>
                <i className="fa fa-times-circle fa-2x text-warning"></i>
              </span>
              <span className="ml-1">
                <span className="d-block font-weight-bold">Error.</span>
                <small className="d-block">See Details</small>
              </span>
              
            </label>
          )
        },
        {
          name: "Tiger Nixon",
          claim: "System Architect",
          account: "Edinburgh",
          scholar: "61",
          manager: "2011/04/25",
          payment: <label className="text-info h6">PENDING</label>,
          dest: (
            <label className="d-flex align-items-center">
              <span>
                <i className="fa fa-minus-circle fa-2x text-info"></i>
              </span>
              <span className="ml-1">
                <span className="d-block font-weight-bold">Error.</span>
                <small className="d-block">See Details</small>
              </span>
              
            </label>
          )
        }
      ]
      });
    return (
      <Fragment>
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-6 row align-items-center">
            <Fab
              size="medium"
              variant="round"
              className="btn-facebook mr-3 border-warning text-warning"
              style={{ border: '1px solid', background: 'white'}}
            >
              <i className="zmdi zmdi-plus zmdi-hc-2x"></i>
            </Fab>
            <Fab
              size="small"
              variant="round"
            >
              <i className="zmdi zmdi-account-circle zmdi-hc-3x"></i>
            </Fab>
          </div>
          <div className="col-md-6 text-right">
            <MDBBtn color="warning" style={{borderRadius: '25px'}}>
              <MDBIcon fab={false} icon="star" className="mr-1" />CLAIM REWARDS
            </MDBBtn>
            <MDBBtn color="warning" style={{borderRadius: '25px'}}>
              <MDBIcon fab={false} icon="log-out" className="mr-1" />PAY SCHOLARS
            </MDBBtn>
          </div>
        </div>
        <MDBDataTableV5
          hover
          entriesOptions={[5, 20, 25]}
          entries={5}
          pagesAmount={4}
          data={tableData}
          checkbox
          headCheckboxID='id6'
          bodyCheckboxID='checkboxes6'
          getValueCheckBox={(e) => {
          }}
          getValueAllCheckBoxes={(e) => {
          }}
          multipleCheckboxes
        />
      </div>
      </Fragment>
    )
}

export default Axie;