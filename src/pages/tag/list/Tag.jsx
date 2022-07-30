import './tag.scss'
import { Link, useSearchParams } from "react-router-dom";
import Navbar from '../../../components/navbar/Navbar';
import Sidebar from '../../../components/sidebar/Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import * as access from '../../../access'
import React from "react";
import Button from '@mui/material/Button';
import TagDatatable from '../../../components/datatable/TagDatatable';

function TagList() {
    const [searchParams, setSearchParams] = useSearchParams();

    let isToastcalled = false
    useEffect(() => {
        if (!isToastcalled && searchParams.get("msg")) {
            isToastcalled = true
            toast.success(searchParams.get("msg"),{
                autoClose: 9000,
                pauseOnHover: true,
            })
        }
    }, [])

    if (!access.homepage_read) {
        return (<div>No home Page read access</div>)
    }
    return (<div className='home'>
        <Sidebar />
        <ToastContainer icon={false} limit={1} autoClose={2000} />
        <div className="homeContainer">
            <Navbar />
            {!access.homepage_read && 'No homepage read access'}
            {access.homepage_read &&
                (<>
                    <div className="datatableTitle">
                        All Tag

                        <Button
                            disabled={access.homepage_create ? false : true}
                            onClick={() => {
                                window.location.href = '/tag/new';
                            }}
                            variant="contained">
                            Add New Tag
                        </Button>
                    </div>
                    <TagDatatable />
                </>)}

        </div>
    </div>);
}

export default TagList;