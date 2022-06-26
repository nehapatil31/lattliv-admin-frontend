import "./sidebar.scss";
import { Link } from "react-router-dom";
import React from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import * as access from '../../access'
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import TakeoutDiningOutlinedIcon from '@mui/icons-material/TakeoutDiningOutlined';
import { ReactComponent as Logo } from './logo.svg';
import StoreMallDirectoryOutlinedIcon from '@mui/icons-material/StoreMallDirectoryOutlined';

function Sidebar() {
    const { dispatch } = useContext(DarkModeContext);

    return (
        <div className="sidebar">
            <div className="top">
                {/* <span className="logo">Lattliv</span> */}
                <Link to="/">

                    <Logo style={{ width: "100px", marginTop: "20px" }} />
                </Link>
            </div>
            <div className="center">
                <ul>
                    <p className="title">MAIN</p>

                    <Link to="/" style={{ textDecoration: "none" }}>
                        <li>
                            <AssessmentOutlinedIcon className="icon" />
                            <span>Dashboard</span>
                        </li>
                    </Link>
                    <p className="title">LISTS</p>
                    <Link to="/users" style={{ textDecoration: "none" }}>
                        <li>
                            <PersonOutlineIcon className="icon" />
                            {
                                access?.user_read ? (
                                    <span>Users</span>
                                )
                                    : <Link to="/" className="disabledCursor" onClick={(event) => event.preventDefault()}><span>Users</span></Link>
                            }

                        </li>
                    </Link>
                    <Link to="/products" style={{ textDecoration: "none" }}>
                        <li>
                            <TakeoutDiningOutlinedIcon className={access?.product_read ? "icon" : "icon disable"} />
                            {
                                access?.product_read ? (
                                    <span>Products</span>
                                )
                                : <Link to="/" className="disabledCursor" onClick={(event) => event.preventDefault()}><span>Products</span></Link>
                            }
                        </li>
                    </Link>
                    <Link to="/categories" style={{ textDecoration: "none" }}>
                        <li>
                            <CategoryOutlinedIcon className={access?.category_read ? "icon" : "icon disable"} />
                            {
                                access?.category_read ? (
                                    <span>Categories</span>
                                )
                                : <Link to="/" className="disabledCursor" onClick={(event) => event.preventDefault()}><span>Categories</span></Link>
                            }
                            
                        </li>
                    </Link>
                    <Link to="/seo" style={{ textDecoration: "none" }}>
                        <li>
                            <ManageSearchIcon className={access?.product_read ? "icon" : "icon disable"} />
                            {
                                access?.product_read ? (
                                    <span>SEO</span>
                                )
                                : <Link to="/" className="disabledCursor" onClick={(event) => event.preventDefault()}><span>SEO</span></Link>
                            }
                            
                        </li>
                    </Link>
                    <Link to="/stores" style={{ textDecoration: "none" }}>
                        <li>
                            <StoreMallDirectoryOutlinedIcon className={access?.store_read ? "icon" : "icon disable"} />
                            {
                                access?.store_read ? (
                                    <span>Store Locator</span>
                                )
                                : <Link to="/" className="disabledCursor" onClick={(event) => event.preventDefault()}><span>Store Locator</span></Link>
                            }
                            
                        </li>
                    </Link>
                    <Link to="/trash" style={{ textDecoration: "none" }}>
                        <li>
                            <DeleteOutlineOutlinedIcon className="icon" />
                            <span>Trash</span>
                        </li>
                    </Link>
                </ul>
            </div>
            <div className="bottom">
                <ul>
                    <p className="title">USER</p>

                    <Link to="/login" style={{ textDecoration: "none" }}>
                        <li>
                            <LogoutOutlinedIcon className="icon" />
                            <span onClick={() => { localStorage.clear(); }}>Logout</span>
                        </li>
                    </Link>
                </ul>

                {/* <div className="user-details">
           <div className="name">{access?.user_name }</div>
            <div className="email">{access?.user_email }</div>
           </div> */}
            </div>

        </div>
    );
}

export default Sidebar;