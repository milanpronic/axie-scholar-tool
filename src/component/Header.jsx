import {MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBFormInline,
    MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon, MDBBadge } from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';
import img from '../img/avatar.png';
import logo from '../img/logo.png';
const Header  = () => {
    return (
        <Router>
          <MDBNavbar color="indigo" dark expand="md">
            <MDBNavbarBrand>
              <img src={logo}/>
            </MDBNavbarBrand>
            <MDBNavbarToggler  />
            <MDBCollapse id="navbarCollapse3"  navbar>
              <MDBNavbarNav right>
                <MDBNavItem>
                  <MDBNavLink className="waves-effect waves-light" to="#!">
                    <MDBIcon fab={false} icon="cog" size="2x"/>
                  </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBNavLink className="waves-effect waves-light " style={{position: 'relative'}} to="#!">
                    <MDBIcon fab={false} icon="bell" size="2x"/>
                    <MDBBadge
                      color="warning"
                      pill
                      style={{
                        position: 'absolute',
                        right: '1px',
                        fontSize: '9px',
                        border: '1px solid black'
                      }}
                      size="xs"
                    >1</MDBBadge>
                  </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBNavLink className="waves-effect waves-light " style={{position: 'relative'}} to="#!">
                    <img src={img} style={{ width: '35px', borderWidth: '2px' }} className="rounded-circle border"/>
                    <span className="ml-1">Tom Wong</span>
                  </MDBNavLink>
                </MDBNavItem>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBNavbar>
        </Router>
    )
}

export default Header;