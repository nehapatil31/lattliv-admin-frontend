import "./sidebar.scss";
import { NavLink } from "react-router-dom";
import React from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import * as access from "../../access";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import TakeoutDiningOutlinedIcon from "@mui/icons-material/TakeoutDiningOutlined";
import { ReactComponent as Logo } from "./logo.svg";
import StoreMallDirectoryOutlinedIcon from "@mui/icons-material/StoreMallDirectoryOutlined";
import HomeIcon from "@mui/icons-material/Home";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import ImageIcon from "@mui/icons-material/Image";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import CollectionsIcon from "@mui/icons-material/Collections";
function Sidebar() {
	const { dispatch } = useContext(DarkModeContext);
	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
		setOpen(!open);
	};
	return (
		<div className="sidebar">
			<div className="top">
				{/* <span className="logo">Lattliv</span> */}
				<NavLink
					to="/"
					className={({ isActive }) => (isActive ? "active" : "")}
				>
					<Logo style={{ width: "100px", marginTop: "20px" }} />
				</NavLink>
			</div>
			<div className="center">
				<ul>
					<p className="title">MAIN</p>

					<NavLink
						to="/"
						style={{ textDecoration: "none" }}
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						<li>
							<AssessmentOutlinedIcon className="icon" />
							<span>Dashboard</span>
						</li>
					</NavLink>
					<p className="title">LISTS</p>
					<NavLink
						to="/users"
						style={{ textDecoration: "none" }}
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						<li>
							<PersonOutlineIcon className="icon" />
							{access?.user_read ? (
								<span>Users</span>
							) : (
								<NavLink
									to="/"
									className="disabledCursor"
									onClick={(event) => event.preventDefault()}
								>
									<span>Users</span>
								</NavLink>
							)}
						</li>
					</NavLink>
					<NavLink
						to="/products"
						style={{ textDecoration: "none" }}
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						<li>
							<TakeoutDiningOutlinedIcon
								className={
									access?.product_read
										? "icon"
										: "icon disable"
								}
							/>
							{access?.product_read ? (
								<span>Products</span>
							) : (
								<NavLink
									to="/"
									className="disabledCursor"
									onClick={(event) => event.preventDefault()}
								>
									<span>Products</span>
								</NavLink>
							)}
						</li>
					</NavLink>
					<NavLink
						to="/categories"
						style={{ textDecoration: "none" }}
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						<li>
							<CategoryOutlinedIcon
								className={
									access?.category_read
										? "icon"
										: "icon disable"
								}
							/>
							{access?.category_read ? (
								<span>Categories</span>
							) : (
								<NavLink
									to="/"
									className="disabledCursor"
									onClick={(event) => event.preventDefault()}
								>
									<span>Categories</span>
								</NavLink>
							)}
						</li>
					</NavLink>
					<NavLink
						to="/seo"
						style={{ textDecoration: "none" }}
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						<li>
							<ManageSearchIcon
								className={
									access?.product_read
										? "icon"
										: "icon disable"
								}
							/>
							{access?.product_read ? (
								<span>SEO</span>
							) : (
								<NavLink
									to="/"
									className="disabledCursor"
									onClick={(event) => event.preventDefault()}
								>
									<span>SEO</span>
								</NavLink>
							)}
						</li>
					</NavLink>
					<NavLink
						to="/stores"
						style={{ textDecoration: "none" }}
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						<li>
							<StoreMallDirectoryOutlinedIcon
								className={
									access?.store_read ? "icon" : "icon disable"
								}
							/>
							{access?.store_read ? (
								<span>Store Locator</span>
							) : (
								<NavLink
									to="/"
									className="disabledCursor"
									onClick={(event) => event.preventDefault()}
								>
									<span>Store Locator</span>
								</NavLink>
							)}
						</li>
					</NavLink>
					<NavLink
						to="/trash"
						style={{ textDecoration: "none" }}
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						<li>
							<DeleteOutlineOutlinedIcon className="icon" />
							<span>Trash</span>
						</li>
					</NavLink>
					{access.homepage_create &&
						access.homepage_delete &&
						access.homepage_edit &&
						access.homepage_read && (
							<div onClick={handleClick}>
								<li>
									<HomeIcon className="icon" />
									<span> Manage Home</span>
									{open ? (
										<ExpandLess className="icon" />
									) : (
										<ExpandMore className="icon" />
									)}
								</li>
							</div>
						)}
					<Collapse
						in={open}
						timeout="auto"
						unmountOnExit
						style={{ paddingLeft: "20px" }}
					>
						<NavLink
							to="/banner-image"
							style={{ textDecoration: "none" }}
							className={({ isActive }) =>
								isActive ? "active" : ""
							}
						>
							<li>
								<ImageIcon className="icon" />
								<span>Banner Image</span>
							</li>
						</NavLink>
						<NavLink
							to="/tag"
							style={{ textDecoration: "none" }}
							className={({ isActive }) =>
								isActive ? "active" : ""
							}
						>
							<li>
								<LocalOfferIcon className="icon" />
								<span>Tag</span>
							</li>
						</NavLink>
						<NavLink
							to="/custom-section"
							style={{ textDecoration: "none" }}
							className={({ isActive }) =>
								isActive ? "active" : ""
							}
						>
							<li>
								<DashboardCustomizeIcon className="icon" />
								<span>Custom Section</span>
							</li>
						</NavLink>
						<NavLink
							to="/custom-section-image"
							style={{ textDecoration: "none" }}
							className={({ isActive }) =>
								isActive ? "active" : ""
							}
						>
							<li>
								<ImageIcon className="icon" />
								<span>Custom Collection</span>
							</li>
						</NavLink>
						<NavLink
							to="/comic"
							style={{ textDecoration: "none" }}
							className={({ isActive }) =>
								isActive ? "active" : ""
							}
						>
							<li>
								<CollectionsIcon className="icon" />
								<span>Comic/Catalogue</span>
							</li>
						</NavLink>
					</Collapse>
					{access.leadmanagement_create &&
						access.leadmanagement_delete &&
						access.leadmanagement_edit &&
						access.leadmanagement_read && (
							<NavLink
								to="/leade-generation"
								style={{ textDecoration: "none" }}
								className={({ isActive }) =>
									isActive ? "active" : ""
								}
							>
								<li>
									<DeleteOutlineOutlinedIcon className="icon" />
									<span>Franchise Lead</span>
								</li>
							</NavLink>
						)}
				</ul>
			</div>
			<div className="bottom">
				<ul>
					<p className="title">USER</p>

					{/* <NavLink to="/login" style={{ textDecoration: "none" }}> */}
					<li>
						<LogoutOutlinedIcon className="icon" />
						<span
							onClick={() => {
								localStorage.clear("profile");
								window.location.reload();
							}}
						>
							Logout
						</span>
					</li>
					{/* </NavLink> */}
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
