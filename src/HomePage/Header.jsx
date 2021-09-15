import {MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBFormInline,
    MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon, MDBBadge } from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';
import img from '../img/avatar.png';
import logo from '../img/logo.png';
import { Link } from 'react-router-dom';
import { history } from '../_helpers';
import { useDispatch, useSelector } from 'react-redux';

const Header  = () => {
  const user = useSelector(state => state.authentication.user);
    return (
        <Router >
          <MDBNavbar style={{background: '#231f20'}}  dark expand="md">
            <MDBNavbarBrand>
              <img src={logo}/>
            </MDBNavbarBrand>
            <MDBNavbarToggler  />
            <MDBCollapse id="navbarCollapse3"  navbar>
              <MDBNavbarNav right>
              
                <MDBDropdown>
                  <MDBDropdownToggle caret color="#FF9000" style={{color: '#FFFFFF'}}>
                    <img src={img} style={{ width: '35px', borderWidth: '2px' }} className="rounded-circle border"/>
                    <span className="ml-1">{user.firstName + ' ' + user.lastName}</span>
                  </MDBDropdownToggle>
                  <MDBDropdownMenu basic>
                    <MDBDropdownItem onClick={()=>{history.push({pathname: '/login'});}}>Logout</MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBNavbar>
        </Router>
    )
}

export default Header;