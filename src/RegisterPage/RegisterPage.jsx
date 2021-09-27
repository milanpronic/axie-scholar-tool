import React, { useState, useEffect } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../_actions';
import backImg from '../img/back.jpeg';

function RegisterPage(props) {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const registering = useSelector(state => state.registration.registering);
    const dispatch = useDispatch();

    // reset login status
    useEffect(() => {
        dispatch(userActions.logout());
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setUser(user => ({ ...user, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (user.firstName && user.lastName && user.username && user.password) {
            dispatch(userActions.register(user));
        }
    }

    return (

        // <Router>
        <div style={{ backgroundImage: `url(${backImg})`, position: 'fixed', left: '0', right: '0', top: '0', bottom: '0', backgroundSize: 'cover' }}>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 m-auto">
                        <div className="jumbotron" style={{marginTop: '50px'}}>
                            <div className="">
                                <div className="">
                                    <h2>Register</h2>
                                    <form name="form" onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label>First Name</label>
                                            <input type="text" name="firstName" value={user.firstName} onChange={handleChange} className={'form-control' + (submitted && !user.firstName ? ' is-invalid' : '')} />
                                            {submitted && !user.firstName &&
                                                <div className="invalid-feedback">First Name is required</div>
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label>Last Name</label>
                                            <input type="text" name="lastName" value={user.lastName} onChange={handleChange} className={'form-control' + (submitted && !user.lastName ? ' is-invalid' : '')} />
                                            {submitted && !user.lastName &&
                                                <div className="invalid-feedback">Last Name is required</div>
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label>Username</label>
                                            <input type="text" name="username" value={user.username} onChange={handleChange} className={'form-control' + (submitted && !user.username ? ' is-invalid' : '')} />
                                            {submitted && !user.username &&
                                                <div className="invalid-feedback">Username is required</div>
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input type="password" name="password" value={user.password} onChange={handleChange} className={'form-control' + (submitted && !user.password ? ' is-invalid' : '')} />
                                            {submitted && !user.password &&
                                                <div className="invalid-feedback">Password is required</div>
                                            }
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-primary">
                                                {registering && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                                Register
                                            </button>
                                            <Link to="/login" className="btn btn-link">Cancel</Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // </Router>
    );
}

export { RegisterPage };