import React,{useState, Fragment, useEffect, useRef} from 'react';
import { MDBBtn , MDBDataTableV5 , MDBIcon, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from "mdbreact";
import { TextField, Fab } from '@material-ui/core';
import { DestResult, PaymentStatus, ClaimStatus } from './StatusComponent';
import Loader from "react-loader-spinner";
import axios from 'axios';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox';
import './axie.css';
const encrypt = (key) => {
	if(key == "") return key;
  	var bod = key.substr(2);
  	var newbod = "";
  	for(var i = 0; i < bod.length; i ++) {
		if(bod[i] >= 0 && bod[i] <= 9) newbod += 9 - bod[i];
  	  	else newbod += bod[i];
  	}
  	return "0x" + newbod;
}
const columns = [
  {
	label: "Name",
	field: "name",
	sort: "asc",
  },
  {
	label: "Next Claim",
	field: "next",
	sort: "asc",
	width: 120
  },
  {
	label: "Claim Status",
	field: "claim_status",
	sort: "asc",
  },
  {
	label: "Account Total",
	field: "total",
	sort: "asc",
  },
  {
	label: "Scholar Share",
	field: "scholar",
	sort: "asc",
  },
  {
	label: "Manager Share",
	field: "manager",
	sort: "asc",
  },
  {
	label: "Payment Status",
	field: "pay_status",
	sort: "asc",
  },
  {
	label: "Destination Match",
	field: "hash",
	sort: "asc",
  },
  {
	label: "Action",
	field: "action",
	sort: "asc",
  }
]
const Axie = (props) => {
	const user = useSelector(state => state.authentication.user);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [ID, setID] = useState(0);
	const [address, setAddress] = useState("");
	const [name, setName] = useState("");
	const [key, setKey] = useState("");
	const [admin_w, setAdminW] = useState("");
	const [scholar_w, setScholarW] = useState("");
	const [modaltype, setModaltype] = useState("new");
	const [tableData, setTableData] = useState({
		columns
	});
	const [rows, setRows] = useState([]);
	const [totalBalance, setTotalBalance] = useState(0);
	const [openModal, setOpenModal] = useState(false);
	const [openDelModal, setOpenDelModal] = useState(false);
	const [checkboxes, setCheckboxes] = useState([]);

	const [rule, setRule] = useState([[10000, 30]]);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [page, setPage] = useState(0);
	const [numSelected, setNumSelected] = useState(0);
	const [selected, setSelected] = React.useState([]);

	const onSelectAllClick = () => {

	}
	const handleClick = (event, id) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];
	
		if (selectedIndex === -1) {
		  newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
		  newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
		  newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
		  newSelected = newSelected.concat(
			selected.slice(0, selectedIndex),
			selected.slice(selectedIndex + 1),
		  );
		}
	
		setSelected(newSelected);
	};
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
		  const newSelecteds = (rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((n) => n.id);
		  setSelected(newSelecteds);
		  return;
		}
		setSelected([]);
	};
	const isSelected = (id) => selected.indexOf(id) !== -1;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
		localStorage.setItem('pagination_status', JSON.stringify({page: newPage, rowsPerPage}));
	};

	const handleChangeRowsPerPage = (event) => {
		const value = parseInt(event.target.value, 10);
		setRowsPerPage(value);
		setPage(0);
		localStorage.setItem('pagination_status', JSON.stringify({page: 0, rowsPerPage: value}));
	};
	const updateTable = () => {
	  	setLoading(true);
	  	axios.get(process.env.REACT_APP_BACKEND_API + '/api/scholars').then(res => {
			const { data } = res;
			let ROW = [];
			let total = 0, manager = 0, scholar = 0, latest = 0;
			data.map(item => {
		  		let item_row = {};
				if(item["total"] > 0 && item["claim_status"] == 0) item["pay_status"] = 0;
		  		for (let key in item) {
					if (key =='claim_status') {
						item_row[key] = (<ClaimStatus status={item[key]}/>);
					}
					else if (key == 'pay_status') {
						item_row[key] = (<PaymentStatus status={item[key]}/>);
					}
					else if (key == 'hash') {
						item_row[key] = (<DestResult status={item[key]}/>);
					}
					else item_row[key] = item[key];
				}
				item_row["rule"] = JSON.parse(item_row["rule"]);
				
				for(var i = item_row["rule"].length - 1; i >= 0; i --) {
					if(item_row["rule"][i][0] > item_row["total"]) {
						item_row["scholar"] = (item_row["total"] * item_row["rule"][i][1] / 100).toFixed(0);
						item_row["manager"] = item_row["total"] - item_row["scholar"];
					}
				}
				
				item_row["hash"] = <DestResult hash={item_row["claim_result"]} hash1={item_row["pay_result1"]} hash2={item_row["pay_result2"]}/>
				let last_time = new Date(item_row["last_time"]);
				let next_time = new Date(last_time.getTime() + 14*24*3600*1000);
				item_row["next"] = (next_time.getMonth() + 1) + "/" + next_time.getDate() + " " + next_time.getHours() + ":" + next_time.getMinutes();
				item_row["action"] = <div style={{'display': 'flex'}}><MDBBtn size="sm" disabled={user.scholar != true} onClick={() => onEdit(item_row)}>edit</MDBBtn><MDBBtn size="sm" color="warning" disabled={user.scholar != true} onClick={() => onDelete(item_row)}>del</MDBBtn></div>
				if(item_row["total"]) total += item_row["total"]*1;
				if(item_row["manager"]) manager += item_row["manager"]*1;
				if(item_row["scholar"]) scholar += item_row["scholar"]*1;
				if(item_row["last_paid_date"] && latest < item_row["last_paid_date"]) latest = item_row["last_paid_date"]; 
		  		ROW.push(item_row);
				
			})
			dispatch({type: "SET_SUMMARY", payload: {total, manager, scholar, accounts: ROW.length, latest}});
			setTableData({ ...tableData, rows: ROW });
			setRows(ROW);
			setCheckboxes([]);
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
			if(typeof msg == 'object') {
		  		if(msg.type == "success") toast.success(<div>Name: {msg.name}<br/>Description: {msg.message}</div>);
		  		else toast.warn(<div>Name: {msg.name}<br/>Description: {msg.message}</div>);
			}
			else if(msg=="refresh") updateTable();
	  	});
	  	updateTable();
		if(localStorage.getItem('pagination_status')) {
			const tt = JSON.parse(localStorage.getItem('pagination_status'));
			setPage(tt.page);
			setRowsPerPage(tt.rowsPerPage);
		}
	},[]);

	const onNewClick = () => {
		setModaltype("new"); 
		setID(0); 
		setName("");
		setAddress("");
		setAdminW("");
		setScholarW("");
		setRule([[10000, 30]]);
		setKey("");
		setTotalBalance(0);
		setOpenModal(true);
	}
	const onEdit = (row) => {
	  	setModaltype("edit");
		setID(row.id);
		setName(row.name);
		setAddress(row.address);
		setAdminW(row.address1);
		setScholarW(row.address2);
		setRule(row.rule);
		setKey(row.private);
		setTotalBalance(row.total);
		setOpenModal(true);
	}
	const onDelete = (row) => {
		setName(row.name);
		setID(row.id);
		setAddress(row.address);
		setOpenDelModal(true);
	}
	const onSaveClick = () => {
		let postdata = {name, address, address1: admin_w, address2: scholar_w, rule};
		if(key != "") postdata["private"] = encrypt(key);
	  	if(modaltype == "new") {
			const res = axios.post(process.env.REACT_APP_BACKEND_API + '/api/scholars', postdata).then(res=>{
				updateTable();
				setName("");
				setAddress("");
				setKey("");
				setAdminW("");
				setScholarW("");
				setRule([[10000, 30]]);
			}).catch(({response }) => {
		  		toast.error(<div>{response.data.message}</div>);
			});
			console.log(res);
	  	}
	  	if(modaltype == "edit") {
			axios.put(process.env.REACT_APP_BACKEND_API + '/api/scholars/' + ID, postdata).then(res=>{
				updateTable();
				setName("");
				setAddress("");
				setKey("");
				setAdminW("");
				setScholarW("");
				setRule([[10000, 30]]);
			}).catch(({response}) => {
		  		toast.error(<div>{response.data.message}</div>);
			})
	  	}
	  	setOpenModal(false)
	}
	const onDelClick = () => {
	  	axios.delete(process.env.REACT_APP_BACKEND_API + '/api/scholars/' + ID).then(res => {
			updateTable();
	  	}).catch(err => {
			console.log(err);
	  	})
	  	setOpenDelModal(false);
	}
	const onPayClick = () => {
		axios.post(process.env.REACT_APP_BACKEND_API + '/api/pay', {addresses: rows.filter(row=>selected.indexOf(row.id) !== -1).map(row=>row.address)}).then(res => {
			updateTable();
	  	}).catch(err => {
			console.log(err);
	  	})
	}
	const onClaimClick = () => {
	  	axios.post(process.env.REACT_APP_BACKEND_API + '/api/claim', {addresses: rows.filter(row=>selected.indexOf(row.id) !== -1).map(row=>row.address)}).then(res=> {
			updateTable();
	  	}).catch(err=>{
			console.log(err);
	  	})
	}
	const onRefreshClick = () => {
		updateTable();
	}

	const onAddRule = () => {
		setRule([...rule, [10000, 70]]);
	}
	const onDelRule = (idx) => {
		rule.splice(idx, 1);
		setRule([...rule]);
	}
	const onUpdateRule = (idx, i, v) => {
		rule[idx][i] = v;
		setRule([...rule]);
	}
	const selectedLength = (rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(row=>(selected.indexOf(row.id) !== -1 ? 1: 0)).reduce((a, b)=> a + b, 0);
	const rowCount = (rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).length;
	return (
	  <Fragment>
		<ToastContainer autoClose={2000} />
	  <div className="container">
		<div className="row mt-4">
		  <div className="col-md-6 col-3 align-items-center">
			<Fab
			  size="medium"
			  variant="round"
			  className="btn-facebook mr-3 border-warning text-warning"
			  style={{ border: '4px solid', background: 'white'}}
			  disabled={user.scholar != true}
			  onClick={onNewClick}
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
		  	<MDBBtn color="warning" style={{borderRadius: '25px', 'border': '4px solid white'}} onClick={onRefreshClick}>
			  <MDBIcon fab={false} icon="log-out" className="mr-1" />REFRESH
			</MDBBtn>
			<MDBBtn color="warning" style={{borderRadius: '25px', 'border': '4px solid white'}} onClick={onClaimClick} disabled={user.scholar != true}>
			  <MDBIcon fab={false} icon="star" className="mr-1" />CLAIM REWARDS
			</MDBBtn>
			<MDBBtn color="warning" style={{borderRadius: '25px', 'border': '4px solid white'}} onClick={()=>onPayClick()} disabled={user.scholar != true}>
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
		   {/* <MDBDataTableV5
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
				if(e.checked) {
				  const cb = [...checkboxes];
				  cb.push(e.address);
				  setCheckboxes(cb);
				} else {
				  const cb = checkboxes.filter(addr => addr != e.address);
				  setCheckboxes(cb);
				}
			}}
			getValueAllCheckBoxes={(e) => {
			  if(e.length && e[0].checked) {
				const cb = e.map(row=>row.address);
				setCheckboxes(cb);
			  } else {
				setCheckboxes([]);
			  }
			}}
			multipleCheckboxes
			
		  /> */}
		  	{/* <DataGrid
				rows={rows}
				columns={columns}
				pageSize={5}
				rowsPerPageOptions={[5]}
				checkboxSelection
				/>
				 */}
				 
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
					<TableRow>
						<TableCell padding="checkbox">
							<Checkbox
								color="primary"
								indeterminate={selectedLength > 0 && selectedLength < rowCount}
								checked={rowCount > 0 && selectedLength >= rowCount}
								onChange={handleSelectAllClick}
								inputProps={{
								'aria-label': 'select all desserts',
								}}
							/>
						</TableCell>
						{columns.map(col => (
							<TableCell key={col.field} style={{ width: col.width }}>{col.label}</TableCell>
						))}
					</TableRow>
					</TableHead>
					<TableBody>
					{(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row, index) => {
						const isItemSelected = isSelected(row.id);
						const labelId = `enhanced-table-checkbox-${index}`;
						return (
						<TableRow
						key={row.id}
						sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell padding="checkbox">
								<Checkbox
								color="primary"
								checked={isItemSelected}
								inputProps={{
									'aria-labelledby': labelId,
								}}
								onClick={(event) => handleClick(event, row.id)}
								/>
							</TableCell>
						{columns.map(col=>(
							<TableCell  key={col.field} >{row[col.field]}</TableCell>
						))}
						</TableRow>
					)})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5, 10, 25, { value: -1, label: 'All' }]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		  </div>
		}
		
		<MDBModal isOpen={openModal}>
		  <MDBModalHeader>Add Scholar</MDBModalHeader>
		  <MDBModalBody>
			<div>
			  <TextField id="scholar" label="Scholar Name" variant="outlined" fullWidth value={name} onChange={e => setName(e.target.value)}/>
			  <TextField id="ronin-address" className="mt-4" label="Ronin Address" variant="outlined" fullWidth value={address} onChange={(e) => setAddress(e.target.value)}/>
			  <TextField id="private" type="password" className="mt-4" label="Private Key" variant="outlined" fullWidth value={key} onChange={e => setKey(e.target.value)}/>
			  <p className="mb-0">Please input private key to claim and pay automatically</p>
			  <TextField id="admin-wallet" className="mt-4" label="Admin Share Address" variant="outlined" fullWidth value={admin_w} onChange={e => setAdminW(e.target.value)}/>
			  <TextField id="private-wallet" className="mt-4" label="Scholar Share Address" variant="outlined" fullWidth value={scholar_w} onChange={e => setScholarW(e.target.value)}/>
			  <MDBBtn color="primary" style={{borderRadius: '50%', 'border': '2px solid white', padding: '6px 12px', marginTop: '25px'}} onClick={onAddRule}> <MDBIcon fab={false} icon="plus"/> </MDBBtn>
			  {rule.map((row, idx) => {
				  return (
				<div key={idx} class="row" style={((idx == 0 && totalBalance < row[0]) || (idx != 0 && totalBalance < row[0] && totalBalance >= rule[idx-1][0])) ? {backgroundColor: 'wheat'}: {}}>
					<div class="col-3">
						<MDBBtn color="warning" style={{borderRadius: '50%', 'border': '2px solid white', padding: '6px 12px', marginTop: '34px', marginLeft: '40px'}} onClick={()=>{onDelRule(idx)}} > <MDBIcon fab={false} icon="times"/> {idx}</MDBBtn>
					</div>
					<div class="col-3">
						<TextField className="mt-4" label="Total<" variant="outlined" fullWidth value={row[0]} onChange={e => onUpdateRule(idx, 0, e.target.value)}/>
					</div>
					<div class="col-3">
						<TextField className="mt-4" label="Scholar" variant="outlined" fullWidth value={row[1]} onChange={e => onUpdateRule(idx, 1, e.target.value)}/>
					</div>
					<div class="col-3">
						<TextField className="mt-4" label="Admin" variant="outlined" fullWidth value={100-row[1]} />
					</div>
				</div>	
				  );
			  })}
						  
			</div>
	
		  </MDBModalBody>
		  <MDBModalFooter>
			<MDBBtn color="secondary" onClick={() => setOpenModal(false)} style={{ borderRadius: '25px' }}>Close</MDBBtn>
			<MDBBtn color="primary" onClick={() => onSaveClick()} style={{ borderRadius: '25px' }}>Save</MDBBtn>
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