import React,{useState, Fragment, useEffect} from 'react';
import { MDBBtn , MDBDataTableV5 , MDBIcon, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from "mdbreact";
import { TextField, Fab } from '@material-ui/core';
import { DestResult, PaymentStatus, ClaimStatus } from './StatusComponent';
import Loader from "react-loader-spinner";
import axios from 'axios';
import reportWebVitals from '../reportWebVitals';

const Axie = () => {
    const [loading, setLoading] = useState(true);
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
          field: "claim_state",
          sort: "asc",
          width: 270
        },
        {
          label: "Account Total",
          field: "account_total",
          sort: "asc",
          width: 200
        },
        {
          label: "Schola Share",
          field: "scholar_share",
          sort: "asc",
          width: 100
        },
        {
          label: "Manager Share",
          field: "manager_share",
          sort: "asc",
          width: 150
        },
        {
          label: "Payment Status",
          field: "payment_state",
          sort: "asc",
          width: 100
        },
        {
          label: "Destination Match",
          field: "destination_match",
          sort: "asc",
          width: 100
        }
      ]
    });
    const [openModal, setOpenModal] = useState(false);
    
    useEffect(() => {
      axios.get('http://192.168.115.22:3001/scholars?pageno=1&count=3&sortby=manager_share').then(res => {
      const { data } = res;
      let ROW = [];
      data.map(item => {
        let item_row = {};
        for (let key in item) {
          if (key == 'hash') continue ;
          if (key =='claim_state') {
            item_row[key] = (<ClaimStatus status={item[key]}/>);
          }
          else if (key == 'payment_state') {
            item_row[key] = (<PaymentStatus status={item[key]}/>);
          }
          else if (key == 'destination_match') {
            item_row[key] = (<DestResult status={item[key]}/>);
          }
          else item_row[key] = item[key];
        }
        ROW.push(item_row);
      })
      setTableData({ ...tableData, rows: ROW });
      setLoading(false);
    },[]);
    return (
      <Fragment>
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-6 col-3 row align-items-center">
            <Fab
              size="medium"
              variant="round"
              className="btn-facebook mr-3 border-warning text-warning"
              style={{ border: '1px solid', background: 'white'}}
              onClick={() => setOpenModal(true)}
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
          <div className="col-md-6 col-8 text-right">
            <MDBBtn color="warning" style={{borderRadius: '25px'}}>
              <MDBIcon fab={false} icon="star" className="mr-1" />CLAIM REWARDS
            </MDBBtn>
            <MDBBtn color="warning" style={{borderRadius: '25px'}}>
              <MDBIcon fab={false} icon="log-out" className="mr-1" />PAY SCHOLARS
            </MDBBtn>
          </div>
        </div>
        { loading ? 
          <Loader
            type="Oval"
            color="#00BFFF"
            height={100}
            width={100}
            className="text-center"
          />: 
          
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
        }
        <MDBModal isOpen={openModal}>
          <MDBModalHeader>Add Scholar</MDBModalHeader>
          <MDBModalBody>
            <div>
              <TextField id="ronin-address" label="Ronin Address" variant="outlined" fullWidth/>
              <TextField id="scholar" className="mt-4" label="Scholar Name" variant="outlined"  fullWidth/>
            </div>
            <div className="d-flex justify-content-between">
              <TextField id="mananger-share" className="mt-4" label="Manager Share" variant="outlined"  />
              <TextField id="scholar-share" className="mt-4" label="Scholar Share" variant="outlined"  />
            </div>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={() => setOpenModal(false)} style={{ borderRadius: '25px' }}>Close</MDBBtn>
            <MDBBtn color="primary" onClick={() => setOpenModal(false)} style={{ borderRadius: '25px' }}>Save</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </div>
      </Fragment>
    )
}

export default Axie;