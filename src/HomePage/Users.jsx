import React,{useState, Fragment, useEffect, useRef} from 'react';
import { TextField, Fab, Checkbox, FormControlLabel } from '@material-ui/core';
import { MDBBtn , MDBDataTableV5 , MDBIcon, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter, MDBInput } from "mdbreact";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const Users  = () => {
    const [loading, setLoading] = useState(false);
    const [openDelModal, setOpenDelModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [ID, setID] = useState(0);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [tableData, setTableData] = useState({
        columns: [
            {
              label: "Name",
              field: "username",
              sort: "asc",
            },
            {
                label: "FirstName",
                field: "firstName",
            },
            {
                label: "LastName",
                field: "lastName",
            },
            {
                label: "Scholar Permission",
                field: "scholarp",
            },
            {
              label: "Action",
              field: "action",
            }
        ]
    });

    const updateTable = () => {
        setLoading(true);
        axios.get(process.env.REACT_APP_BACKEND_API + '/api/users').then(res => {
          const { data } = res;
          let ROW = [];
          data.map(item => {
              
              item["scholarp"] = item["scholar"] ? <Checkbox name="checkboxes" defaultChecked onChange={(e)=>onChange(item, e.target)}/> : <Checkbox name="checkboxes" onChange={(e)=>onChange(item, e.target)}/>
              item["action"] = <div style={{'display': 'flex'}}><MDBBtn size="sm" color="warning" onClick={() => onDelete(item)}>del</MDBBtn></div>
              ROW.push(item);
          })         
          setTableData({ ...tableData, rows: ROW });
          console.log(ROW);
          setLoading(false);
        }).catch(err=>{
          console.log(err);
          setLoading(false);
        })
    }

    useEffect(() => {
        updateTable();
    },[]);
    const onChange = (row, target) => {
      console.log(row.id, target.checked);
      axios.put(process.env.REACT_APP_BACKEND_API + '/api/users/' + row.id, {scholar: target.checked}).then(res=>{
        console.log(res);
      }).catch(err=>{
        console.log(err);
      })
    }
    const onEdit = (row) => {
        setID(row.id);
        setName(row.name);
        setPassword(row.password);
        setOpenModal(true);
    }
    const onDelete = (row) => {
        setID(row.id);
        setName(row.username);
        setOpenDelModal(true);
    }

    const onSaveClick = () => {

        
        if(ID == 0) {
          const res = axios.post(process.env.REACT_APP_BACKEND_API + '/api/users', {name, password}).then(res=>{
              updateTable();
              setName("");
              setPassword("");
          }).catch(({response }) => {
                toast.error(<div>{response.data.message}</div>);
          });
        } else {
          axios.put(process.env.REACT_APP_BACKEND_API + '/api/users/' + ID, {name, password}).then(res=>{
              updateTable();
              setName("");
              setPassword("");
          }).catch(({response}) => {
                toast.error(<div>{response.data.message}</div>);
          })
        }
        setOpenModal(false)
    }
    const onDelClick = () => {
        axios.delete(process.env.REACT_APP_BACKEND_API + '/api/users/' + ID).then(res => {
          updateTable();
        }).catch(err => {
          console.log(err);
        })
        setOpenDelModal(false);
    }

    return (<>
        <div className="container">
            <div className="row mt-4">
                
            </div>
            <div style={{marginBottom: '30px'}}>
                <MDBDataTableV5
                    hover
                    striped
                    entriesOptions={[5, 20, 25]}
                    entries={5}
                    pagesAmount={4}
                    data={tableData}
                />
		  
		    </div>
        </div>
        <MDBModal isOpen={openModal}>
		  <MDBModalHeader>Add Admin</MDBModalHeader>
		  <MDBModalBody>
			<div>
			  <TextField id="admin" label="Admin Name" variant="outlined" fullWidth value={name} onChange={e => setName(e.target.value)}/>
			  <TextField id="password" type="password" className="mt-4" label="Admin Password" variant="outlined" fullWidth value={password} onChange={e => setPassword(e.target.value)}/>
              <FormControlLabel control={<Checkbox name="checkboxes" defaultChecked/>} label="Admin Permission" />
              <FormControlLabel control={<Checkbox name="checkboxes"/>} label="Scholar Permission" />
              {/* <Checkbox id="checkbox-2" name="checkboxes" label="Scholar Permission" /> */}
              {/* <MDBInput label="Admin Permission" type="checkbox" id="checkbox1" /> */}
              {/* <div class="custom-control custom-checkbox">
                   <input type="checkbox" class="custom-control-input" id="defaultUnchecked"/> 
              <Checkbox id="defaultUnchecked" name="checkboxes" label="Admin Permission" />
                    <label class="custom-control-label" for="defaultUnchecked">Default unchecked</label>
                </div> */}
			</div>
		  </MDBModalBody>
		  <MDBModalFooter>
			<MDBBtn color="secondary" onClick={() => setOpenModal(false)} style={{ borderRadius: '25px' }}>Close</MDBBtn>
			<MDBBtn color="primary" onClick={() => onSaveClick()} style={{ borderRadius: '25px' }}>Save</MDBBtn>
		  </MDBModalFooter>
		</MDBModal>

        <MDBModal isOpen={openDelModal}>
		  <MDBModalHeader>Confirm Delete Admin</MDBModalHeader>
		  <MDBModalBody>
			<div>
			  
			  <p className="mb">Really?</p>
			  
			  <TextField id="user" className="mt-4" disabled label="Admin Name" variant="outlined" fullWidth value={name}/>
			  
			</div>
			
		  </MDBModalBody>
		  <MDBModalFooter>
			<MDBBtn color="secondary" onClick={() => setOpenDelModal(false)} style={{ borderRadius: '25px' }}>No</MDBBtn>
			<MDBBtn color="primary" onClick={() => onDelClick()} style={{ borderRadius: '25px' }}>Yes</MDBBtn>
		  </MDBModalFooter>
		</MDBModal>
    </>);
}

export default Users;