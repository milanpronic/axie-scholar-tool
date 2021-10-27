import React, { useState, Fragment, useEffect, useRef } from 'react';
import { MDBBtn, MDBIcon, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from "mdbreact";
import { TextField, Fab, Slider } from '@material-ui/core';
import { DestResult, PaymentStatus, ClaimStatus } from './StatusComponent';
import Loader from "react-loader-spinner";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableSortLabel, Box, TableHead, TableRow, Paper, TablePagination, Checkbox } from '@mui/material';
import * as XLSX from 'xlsx';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import './axie.css';
import moment from 'moment';
import fileDownload from 'js-file-download';
import { visuallyHidden } from '@mui/utils';
import RJSSocket from './RJSSocket';

const encrypt = (key) => {
	if (key == "") return key;
	var bod = key.substr(2);
	var newbod = "";
	for (var i = 0; i < bod.length; i++) {
		if (bod[i] >= 0 && bod[i] <= 9) newbod += 9 - bod[i];
		else newbod += bod[i];
	}
	return "0x" + newbod;
}
function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
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
		field: "hash"
	},
	{
		label: "Action",
		field: "action"
	}
]
const Axie = () => {
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

	
	const scholars = useSelector(state=>state.scholars);

	const [totalBalance, setTotalBalance] = useState(0);
	const [openModal, setOpenModal] = useState(false);
	const [openDelModal, setOpenDelModal] = useState(false);
	const [openBulkDelModal, setOpenBulkDelModal] = useState(false);
	const [willDeleteIds, setWillDeleteIds] = useState("");

	const [rule, setRule] = useState([[2011, 30], [2386, 40], [10000, 45]]);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [page, setPage] = useState(0);
	const [selected, setSelected] = useState([]);
	const [start_date, setStartDate] = useState('');
	const [end_date, setEndDate] = useState('');
	const [isOpenLog, setOpenLogModal] = useState(false);
	const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState('name');

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
			const newSelecteds = (rowsPerPage > 0 ? stableSort(scholars, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : stableSort(scholars, getComparator(order, orderBy))).map((n) => n.id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};
	const isSelected = (id) => selected.indexOf(id) !== -1;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
		localStorage.setItem('pagination_status', JSON.stringify({ page: newPage, rowsPerPage }));
	};

	const handleChangeRowsPerPage = (event) => {
		const value = parseInt(event.target.value, 10);
		setRowsPerPage(value);
		setPage(0);
		localStorage.setItem('pagination_status', JSON.stringify({ page: 0, rowsPerPage: value }));
	};

	const handleRequestSort = (field) => {
		console.log(order, orderBy, field);
		if (field == "action") return;
		if (field == "hash") return;
		const isAsc = orderBy === field && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(field);
	}

	const updateTable = () => {
		setLoading(true);
		axios.get(process.env.REACT_APP_BACKEND_API + '/api/scholars?user=' + user.id).then(res => {
			dispatch({type: "SET_SCHOLARS", payload: res.data});
		}).catch(err => {
			console.log("ERR");
		}).finally(() => {
			setLoading(false);
		})
	}

	useEffect(() => {
		updateTable();
		if (localStorage.getItem('pagination_status')) {
			const tt = JSON.parse(localStorage.getItem('pagination_status'));
			setPage(tt.page);
			setRowsPerPage(tt.rowsPerPage);
		}
	}, []);

	const onNewClick = () => {
		setModaltype("new");
		setID(0);
		setName("");
		setAddress("");
		setAdminW("");
		setScholarW("");
		setRule([[2011, 30], [2386, 40], [10000, 45]]);
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
		setRule(JSON.parse(row.rule));
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
		let postdata = { name, address, address1: admin_w, address2: scholar_w, rule, user: user.id };
		if (key != "") postdata["private"] = encrypt(key);
		if (modaltype == "new") {
			setLoading(true);
			const res = axios.post(process.env.REACT_APP_BACKEND_API + '/api/scholars', postdata).then(res => {
				dispatch({type: "ADD_SCHOLAR", payload: res.data});
				setName("");
				setAddress("");
				setKey("");
				setAdminW("");
				setScholarW("");
				setRule([[2011, 30], [2386, 40], [10000, 45]]);
				setOpenModal(false)
			}).catch(({ response }) => {
				if(response) toast.error(<div>{response.data.message}</div>);
			}).finally(() => {
				setLoading(false);
			});
		}
		if (modaltype == "edit") {
			setLoading(true);
			axios.put(process.env.REACT_APP_BACKEND_API + '/api/scholars/' + ID, postdata).then(res => {
				dispatch({type: "UPDATE_SCHOLAR", payload: {...postdata, user_id: user.id, id: ID}});
				setName("");
				setAddress("");
				setKey("");
				setAdminW("");
				setScholarW("");
				setRule([[2011, 30], [2386, 40], [10000, 45]]);
				setOpenModal(false)
			}).catch(({ response }) => {
				if(response) toast.error(<div>{response.data.message}</div>);
			}).finally(() => {
				setLoading(false);
			})
		}
	}
	const onDelClick = () => {
		setLoading(true);
		axios.delete(process.env.REACT_APP_BACKEND_API + '/api/scholars/' + ID).then(res => {
			dispatch({type: "DELETE_SCHOLAR", payload: ID});
			setOpenDelModal(false);
		}).catch(err => {
			console.log(err);
		}).finally(() => {
			setLoading(false);
		})
	}
	const onPayClick = () => {
		axios.post(process.env.REACT_APP_BACKEND_API + '/api/pay', { addresses: scholars.filter(row => selected.indexOf(row.id) !== -1).map(row => row.address) }).then(res => {
			updateTable();
		}).catch(err => {
			console.log(err);
		})
	}
	const onClaimClick = () => {
		axios.post(process.env.REACT_APP_BACKEND_API + '/api/claim', { addresses: scholars.filter(row => selected.indexOf(row.id) !== -1).map(row => row.address) }).then(res => {
			updateTable();
		}).catch(err => {
			console.log(err);
		})
	}
	const onBulkDelClick = () => {
		setWillDeleteIds(scholars.filter(row => selected.indexOf(row.id) !== -1).map(row => row.name).join(","));
		setOpenBulkDelModal(true);
	}
	const onBulkDeleteClick = () => {
		console.log(selected);
		setLoading(true);
		axios.delete(process.env.REACT_APP_BACKEND_API + '/api/scholars/' + JSON.stringify(selected)).then(res => {
			dispatch({type: "DELETE_SCHOLARS", payload: selected});
		}).catch(err => {
			console.log(err);
		}).finally(() => {
			setLoading(false);
		})
		setOpenBulkDelModal(false);
	}
	const onRefreshClick = () => {
		updateTable();
	}

	const onAddRule = () => {
		if(rule) {
			setRule([...rule, [10000, 70]]);
		} else 
		setRule([[10000, 70]]);
		
	}
	const onDelRule = (idx) => {
		rule.splice(idx, 1);
		setRule([...rule]);
	}
	const onUpdateRule = (idx, i, v) => {
		rule[idx][i] = v;
		setRule([...rule]);
	}
	const readExcelFile = (event) => {
		if (event.target.files.length == 0) return;
		const f = event.target.files[0];
		const reader = new FileReader();
		reader.onload = (evt) => { // evt = on_file_select event
			/* Parse data */
			const bstr = evt.target.result;
			const wb = XLSX.read(bstr, { type: 'binary' });
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
			/* Update state */

			const new_data = data.filter(row => {
				return row[0] * 1 == row[0];
			}).map(row => {
				if (row[2]) row[2] = encrypt(row[2]);
				return row;
			});
			if (new_data.length > 0) {
				setLoading(true);
				axios.post(`${process.env.REACT_APP_BACKEND_API}/api/scholars/bulk_upload`, { scholars: new_data, user: user.id }).then(res => {
					dispatch({type: "ADD_SCHOLARS", payload: res.data});
					setLoading(false);
					event.target.files = null;
				})
			}
		};
		reader.readAsBinaryString(f);
	}
	const downloadCSVFile = () => {
		if (!start_date || !end_date) {
			NotificationManager.warning('Start Date or End Date is empty!');
			return;
		}
		else if (end_date < start_date) {
			NotificationManager.warning('End Date is after than Start Date!');
			return;
		}
		const sendData = {
			start_date: moment(start_date),
			end_date: moment(end_date)
		}

		axios.post(`${process.env.REACT_APP_BACKEND_API}/api/scholars/download_csv_file`, sendData).then(res => {
			const { data } = res;
			axios.get(`${process.env.REACT_APP_BACKEND_API}/${data.path}`, {
				responseType: 'blob'
			}).then(res => {
				fileDownload(res.data, 'logs.csv');
				setOpenLogModal(false);
				setStartDate('');
				setEndDate('');
			})
		})
	}
	const selectedLength = (rowsPerPage > 0 ? stableSort(scholars, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : stableSort(scholars, getComparator(order, orderBy))).map(row => (selected.indexOf(row.id) !== -1 ? 1 : 0)).reduce((a, b) => a + b, 0);
	const rowCount = (rowsPerPage > 0 ? stableSort(scholars, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : stableSort(scholars, getComparator(order, orderBy))).length;

	return (
		<Fragment>
			<RJSSocket updateTable={updateTable} scholars={scholars}/>
			<div className="container-fluid">
				<div className="row mt-4 align-items-center">
					<div className="col-md-3 col-sm-5 col-12 align-items-center text-sm-left text-center">
						<Fab
							size="medium"
							variant="circular"
							className="btn-facebook mr-3 border-warning text-warning"
							style={{ border: '4px solid', background: 'white' }}
							onClick={() => onNewClick()}
						>
							<i className="zmdi zmdi-plus zmdi-hc-2x"></i>
						</Fab>
						<Fab
							size="small"
							variant="circular"
						>
							<i className="zmdi zmdi-account-circle zmdi-hc-3x"></i>
						</Fab>
					</div>
					<div className="col-md-9 col-sm-12 col-12 text-md-right text-center">
						<label className="btn-warning btn Ripple-parent " style={{ borderRadius: '25px', 'border': '4px solid white' }}
						>

							Upload from Excel
							<input type="file" style={{ display: 'none' }} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(event) => { readExcelFile(event) }} />
						</label>
						<MDBBtn color="warning" style={{ borderRadius: '25px', 'border': '4px solid white' }} onClick={() => setOpenLogModal(true)}>
							<MDBIcon fab={false} icon="history" className="mr-1" />Logs Viewer
						</MDBBtn>
						<MDBBtn color="warning" style={{ borderRadius: '25px', 'border': '4px solid white' }} onClick={onRefreshClick}>
							<MDBIcon fab={false} icon="refresh" className="mr-1" />REFRESH
						</MDBBtn>
						<MDBBtn color="warning" style={{ borderRadius: '25px', 'border': '4px solid white' }} onClick={onClaimClick}>
							<MDBIcon fab={false} icon="star" className="mr-1" />CLAIM REWARDS
						</MDBBtn>
						<MDBBtn color="warning" style={{ borderRadius: '25px', 'border': '4px solid white' }} onClick={() => onPayClick()}>
							<MDBIcon fab={false} icon="log-out" className="mr-1" />PAY SCHOLARS
						</MDBBtn>
						<MDBBtn color="danger" style={{ borderRadius: '25px', 'border': '4px solid white' }} onClick={() => onBulkDelClick()}>
							<MDBIcon fab={false} icon="trash" className="mr-1" />Delete
						</MDBBtn>
					</div>
				</div>
				{loading ?
					<Loader
						type="Oval"
						color="#00BFFF"
						height={100}
						width={100}
						className="text-center"
					/> :
					<div style={{ marginBottom: '30px' }}>
						<TableContainer component={Paper}>
							<Table sx={{ minWidth: 650 }} aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell style={{ textAlign: 'center' }} padding="checkbox">
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

											<TableCell key={col.field} style={{ width: col.width }} sortDirection={orderBy === col.field ? order : false}>
												{col.sort ? (
													<TableSortLabel active={orderBy === col.field} direction={orderBy === col.field ? order : 'asc'} onClick={() => { handleRequestSort(col.field) }}>
														{col.label}
														{orderBy === col.field ? (
															<Box component="span" sx={visuallyHidden}>
																{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
															</Box>
														) : null}
													</TableSortLabel>
												): col.label
												}
												
											</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{(rowsPerPage > 0 ? stableSort(scholars, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : stableSort(scholars, getComparator(order, orderBy))).map((row, index) => {
										const isItemSelected = isSelected(row.id);
										const labelId = `enhanced-table-checkbox-${index}`;
										return (
											<TableRow
												key={row.id}
												sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
											>
												<TableCell style={{ textAlign: 'center' }} padding="checkbox">
													<Checkbox
														color="primary"
														checked={isItemSelected}
														inputProps={{
															'aria-labelledby': labelId,
														}}
														onClick={(event) => handleClick(event, row.id)}
													/>
												</TableCell>
												{columns.map(col => (
													<TableCell key={col.field} >{

														!row["total"] && row["total"] != 0 && col.field != "name" && col.field != "action" ?
															'...'
															: col.field == 'claim_status' ?
																<ClaimStatus status={row[col.field]} />
																: col.field == 'pay_status' ?
																	<PaymentStatus status={row[col.field]} last_date={row["last_paid"]} />
																	: col.field == 'hash' ?
																		<DestResult hash={row["hash"]}/>
																		: col.field == 'next'  && row["next"] ?
																			(new Date(row["next"]).getMonth() + 1) + "/" + new Date(row["next"]).getDate() + " " + new Date(row["next"]).getHours() + ":" + new Date(row["next"]).getMinutes()
																			: col.field == 'action' ?
																				<div style={{ 'display': 'flex' }}><MDBBtn size="sm" onClick={() => onEdit(row)}>edit</MDBBtn><MDBBtn size="sm" color="warning" onClick={() => onDelete(row)}>del</MDBBtn></div>
																				: row[col.field]
													}</TableCell>
												))}
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</TableContainer>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25, { value: -1, label: 'All' }]}
							component="div"
							count={scholars.length}
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
							<TextField id="scholar" label="Scholar Name" variant="outlined" fullWidth value={name} onChange={e => setName(e.target.value)} />
							<TextField id="ronin-address" className="mt-4" label="Ronin Address" variant="outlined" fullWidth value={address} onChange={(e) => setAddress(e.target.value)} />
							<TextField id="private" type="password" className="mt-4" label="Private Key" variant="outlined" fullWidth value={key} onChange={e => setKey(e.target.value)} />
							<p className="mb-0">Please input private key to claim and pay automatically</p>
							<TextField id="admin-wallet" className="mt-4" label="Admin Share Address" variant="outlined" fullWidth value={admin_w} onChange={e => setAdminW(e.target.value)} />
							<TextField id="private-wallet" className="mt-4" label="Scholar Share Address" variant="outlined" fullWidth value={scholar_w} onChange={e => setScholarW(e.target.value)} />
							<MDBBtn color="primary" style={{ borderRadius: '50%', 'border': '2px solid white', padding: '6px 12px', marginTop: '25px' }} onClick={onAddRule}> <MDBIcon fab={false} icon="plus" /> </MDBBtn>
							{rule && rule.map((row, idx) => {
								return (
									<div key={idx} className="row" style={((idx == 0 && totalBalance < row[0]) || (idx != 0 && totalBalance < row[0] && totalBalance >= rule[idx - 1][0])) ? { backgroundColor: 'wheat' } : {}}>
										<div className="col-3">
											<MDBBtn color="warning" style={{ borderRadius: '50%', 'border': '2px solid white', padding: '6px 12px', marginTop: '34px', marginLeft: '40px' }} onClick={() => { onDelRule(idx) }} > <MDBIcon fab={false} icon="times" /> {idx}</MDBBtn>
										</div>
										<div className="col-3">
											<TextField className="mt-4" label="Total<" variant="outlined" fullWidth value={row[0]} onChange={e => onUpdateRule(idx, 0, e.target.value)} />
										</div>
										<div className="col-3">
											<TextField className="mt-4" label="Scholar" variant="outlined" fullWidth value={row[1]} onChange={e => onUpdateRule(idx, 1, e.target.value)} />
										</div>
										<div className="col-3">
											<TextField className="mt-4" label="Admin" variant="outlined" fullWidth value={100 - row[1]} />
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

				<MDBModal isOpen={isOpenLog}>
					<MDBModalHeader>Download CSV Log File</MDBModalHeader>
					<MDBModalBody>
						<div className="text-center">
							<div className="d-inline-block">
								<div className="d-flex justify-content-between align-items-center">
									<span className="mr-2">From: </span>
									<TextField
										type="datetime-local"
										onChange={(e) => setStartDate(e.target.value)}
									/>
								</div>
							</div>
							<div className="d-inline-block align-items-center mt-4">
								<div className="d-flex justify-content-between align-items-center">
									<span className="mr-4">To: </span>
									<TextField
										type="datetime-local"
										onChange={(e) => setEndDate(e.target.value)}
									/>
								</div>
							</div>
						</div>
					</MDBModalBody>
					<MDBModalFooter>
						<MDBBtn color="secondary" onClick={() => setOpenLogModal(false)} style={{ borderRadius: '25px' }}>No</MDBBtn>
						<MDBBtn color="primary" onClick={() => downloadCSVFile()} style={{ borderRadius: '25px' }}>Yes</MDBBtn>
					</MDBModalFooter>
				</MDBModal>
				<MDBModal isOpen={openDelModal}>
					<MDBModalHeader>Confirm Delete Scholar</MDBModalHeader>
					<MDBModalBody>
						<div>

							<p className="mb">Really?</p>
							<TextField id="ronin-address" label="Ronin Address" variant="outlined" fullWidth value={address} />
							<TextField id="scholar" className="mt-4" label="Scholar Name" variant="outlined" fullWidth value={name} />

						</div>

					</MDBModalBody>
					<MDBModalFooter>
						<MDBBtn color="secondary" onClick={() => setOpenDelModal(false)} style={{ borderRadius: '25px' }}>No</MDBBtn>
						<MDBBtn color="primary" onClick={() => onDelClick()} style={{ borderRadius: '25px' }}>Yes</MDBBtn>
					</MDBModalFooter>
				</MDBModal>
				<MDBModal isOpen={openBulkDelModal}>
					<MDBModalHeader>Confirm Bulk Delete Scholars</MDBModalHeader>
					<MDBModalBody>
						<div>

							<p className="mb">Do you want to delete follows really?</p>
							<TextField className="mt-4" label="Scholar Names" variant="outlined" fullWidth value={willDeleteIds} />

						</div>

					</MDBModalBody>
					<MDBModalFooter>
						<MDBBtn color="secondary" onClick={() => setOpenBulkDelModal(false)} style={{ borderRadius: '25px' }}>No</MDBBtn>
						<MDBBtn color="primary" onClick={() => onBulkDeleteClick()} style={{ borderRadius: '25px' }}>Yes</MDBBtn>
					</MDBModalFooter>
				</MDBModal>
			</div>
			<NotificationContainer />
		</Fragment>
	)
}
export default Axie;