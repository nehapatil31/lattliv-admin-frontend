import './userList.scss'
import { Link, useSearchParams } from "react-router-dom";
import Navbar from '../../../components/navbar/Navbar';
import Sidebar from '../../../components/sidebar/Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import UserDatatable from '../../../components/datatable/UserDatatable';
import * as access from '../../../access'
import React from "react";

function UserList() {
    const [searchParams, setSearchParams] = useSearchParams();
    let isToastcalled = false
    useEffect(() => {
        if (!isToastcalled && searchParams.get("msg")) {
            isToastcalled = true
            toast.success(searchParams.get("msg"))
        }
    }, [])

    return (<div className='home'>
        <Sidebar />
        <ToastContainer icon={false} limit={1} autoClose={2000} />
        <div className="homeContainer">
            <Navbar />

            {!access.user_read && 'No users read access'}
            {access.user_read &&
                <>
                    <div className="datatableTitle">
                        All Users
                        <Link to="/users/new" className="link">
                            Add New User
                        </Link>
                    </div>
                    <UserDatatable />
                </>
            }

        </div>
    </div>);
}

export default UserList;