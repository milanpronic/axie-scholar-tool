import React,{useState, Fragment, useEffect} from 'react';
import { MDBBtn , MDBDataTableV5 , MDBIcon, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from "mdbreact";
import { TextField, Fab } from '@material-ui/core';
import { DestResult, PaymentStatus, ClaimStatus } from './StatusComponent';
import Loader from "react-loader-spinner";
import axios from 'axios';
import { io } from 'socket.io-client';

const Axie = () => {
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const [key, setKey] = useState("");
    const [admin_w, setAdminW] = useState("");
    const [scholar_w, setScholarW] = useState("");
    const [modaltype, setModaltype] = useState("new");
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
          field: "claim_status",
          sort: "asc",
          width: 270
        },
        {
          label: "Account Total",
          field: "total",
          sort: "asc",
          width: 200
        },
        {
          label: "Scholar Share",
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
          field: "pay_status",
          sort: "asc",
          width: 100
        },
        {
          label: "Destination Match",
          field: "destination_match",
          sort: "asc",
          width: 100
        },
        {
          label: "Action",
          field: "action",
          sort: "asc",
          width: 100
        }
      ]
    });
    const [openModal, setOpenModal] = useState(false);
    const [openDelModal, setOpenDelModal] = useState(false);
    const updateTable = () => {
      setLoading(true);
      axios.get(process.env.REACT_APP_BACKEND_API + '/scholars').then(res => {
        const { data } = res;
        let ROW = [];
        data.map(item => {
          let item_row = {};
          for (let key in item) {
            if (key == 'hash') continue ;
            if (key =='claim_status') {
              item_row[key] = (<ClaimStatus status={item[key]}/>);
            }
            else if (key == 'pay_status') {
              item_row[key] = (<PaymentStatus status={item[key]}/>);
            }
            else if (key == 'destination_match') {
              item_row[key] = (<DestResult status={item[key]}/>);
            }
            else item_row[key] = item[key];
          }
          item_row["action"] = <div style={{'display': 'flex'}}><MDBBtn size="sm"  onClick={() => onEdit(item_row)}>edit</MDBBtn><MDBBtn size="sm" color="warning" onClick={() => onDelete(item_row)}>del</MDBBtn></div>
          ROW.push(item_row);
        })
        setTableData({ ...tableData, rows: ROW });
        setLoading(false);
      }).catch(err=>{
        console.log("ERR");
        setLoading(false);
      })
    }

    useEffect(() => {
      const connect = io(process.env.REACT_APP_BACKEND_API, { transports: ["websocket"] });
      connect.emit('message', "OK?");
      connect.on('message', (msg) => {
        console.log(msg);
      });
      updateTable();
      
    },[]);
    useEffect(() => {
      
    },[tableData])

    const onEdit = (row) => {
      setModaltype("edit");
      setName(row.name);
      setAddress(row.address);
      setAdminW(row.admin_w);
      setScholarW(row.scholar_w);
      setKey(row.key);
      setOpenModal(true);
    }
    const onDelete = (row) => {
      setName(row.name);
      setAddress(row.address);
      setOpenDelModal(true);
    }
    const onClick = () => {
      if(modaltype == "new") {
        axios.post(process.env.REACT_APP_BACKEND_API + '/add_scholar', {name, address, private: key, admin_w, scholar_w}).then(res=>{
          updateTable();
          setName("");
          setAddress("");
          setKey("");
          setAdminW("");
          setScholarW("");
        }).catch(err => {
          console.log(err);
        })
      }
      if(modaltype == "edit") {
        axios.post(process.env.REACT_APP_BACKEND_API + '/update_scholar', {name, address, private: key, admin_w, scholar_w}).then(res=>{
          updateTable();
          setName("");
          setAddress("");
          setKey("");
          setAdminW("");
          setScholarW("");
        }).catch(err => {
          console.log(err);
        })
      }
      setOpenModal(false)
    }
    const onDelClick = () => {
      axios.post(process.env.REACT_APP_BACKEND_API + '/del_scholar', {address}).then(res => {
        updateTable();
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
      setOpenDelModal(false);
    }

    const onPayClick = () => {
      console.log("On Pay");
      axios.post(process.env.REACT_APP_BACKEND_API + '/pay', {addresses: ["ronin:a1a7ef2fbb0b075290d1ab646fbca9cc645a93fc"]}).then(res => {

      }).catch(err => {
        console.log(err);
      })
    }
    return (
      <Fragment>
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-6 col-3 align-items-center">
            <Fab
              size="medium"
              variant="round"
              className="btn-facebook mr-3 border-warning text-warning"
              style={{ border: '4px solid', background: 'white'}}
              onClick={() => { setModaltype("new"); setOpenModal(true); }}
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
            <MDBBtn color="warning" style={{borderRadius: '25px', 'border': '4px solid white'}}>
              <MDBIcon fab={false} icon="star" className="mr-1" />CLAIM REWARDS
            </MDBBtn>
            <MDBBtn color="warning" style={{borderRadius: '25px', 'border': '4px solid white'}} onClick={()=>onPayClick()}>
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
          <div style={{marginBottom: '30px'}}>
           <MDBDataTableV5
            hover
            striped
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
            multipleCheckboxes={(e) => {
            }}
          />
          </div>
        }
        <MDBModal isOpen={openModal}>
          <MDBModalHeader>Add Scholar</MDBModalHeader>
          <MDBModalBody>
            <div>
              <TextField id="ronin-address" label="Ronin Address" variant="outlined" fullWidth value={address} onChange={(e) => setAddress(e.target.value)}/>
              <TextField id="scholar" className="mt-4" label="Scholar Name" variant="outlined" fullWidth value={name} onChange={e => setName(e.target.value)}/>
              <TextField id="private" type="password" className="mt-4" label="Private Key" variant="outlined" fullWidth value={key} onChange={e => setKey(e.target.value)}/>
              <p className="mb-0">Please input private key to claim and pay automatically</p>
              <TextField id="admin-wallet" className="mt-4" label="Admin Share Address" variant="outlined" fullWidth value={admin_w} onChange={e => setAdminW(e.target.value)}/>
              <p className="mb-0">Admin Share 70%</p>
              <TextField id="private-wallet" className="mt-4" label="Scholar Share Address" variant="outlined" fullWidth value={scholar_w} onChange={e => setScholarW(e.target.value)}/>
              <p className="mb-0">Scholar Share 30%</p>
            </div>
            {/* <div className="d-flex justify-content-between">
              <TextField id="mananger-share" className="mt-4" label="Manager Share" variant="outlined"  />
              <TextField id="scholar-share" className="mt-4" label="Scholar Share" variant="outlined"  />
            </div> */}
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={() => setOpenModal(false)} style={{ borderRadius: '25px' }}>Close</MDBBtn>
            <MDBBtn color="primary" onClick={() => onClick()} style={{ borderRadius: '25px' }}>Save</MDBBtn>
          </MDBModalFooter>
        </MDBModal>

        <MDBModal isOpen={openDelModal}>
          <MDBModalHeader>Confirm Delete Scholar</MDBModalHeader>
          <MDBModalBody>
            <div>
              
              <p className="mb">Really?</p>
              <TextField id="ronin-address" label="Ronin Address" variant="outlined" fullWidth value={address}/>
              <TextField id="scholar" className="mt-4" label="Scholar Name" variant="outlined" fullWidth value={name}/>
              
            </div>
            {/* <div className="d-flex justify-content-between">
              <TextField id="mananger-share" className="mt-4" label="Manager Share" variant="outlined"  />
              <TextField id="scholar-share" className="mt-4" label="Scholar Share" variant="outlined"  />
            </div> */}
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={() => setOpenDelModal(false)} style={{ borderRadius: '25px' }}>No</MDBBtn>
            <MDBBtn color="primary" onClick={() => onDelClick()} style={{ borderRadius: '25px' }}>Yes</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </div>
      </Fragment>
    )
}

export default Axie;