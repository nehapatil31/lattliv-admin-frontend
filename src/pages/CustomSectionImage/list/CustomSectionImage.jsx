import './customsectionimage.scss'
import { Link, useSearchParams } from "react-router-dom";
import CustomSectionImageDatatable from '../../../components/datatable/CustomSectionImageDatatable';
import Navbar from '../../../components/navbar/Navbar';
import Sidebar from '../../../components/sidebar/Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import * as access from '../../../access'
import React from "react";
import Button from '@mui/material/Button';

function CustomSectionImagesList() {
    const [searchParams, setSearchParams] = useSearchParams();

    let isToastcalled = false
    useEffect(() => {
        if (!isToastcalled && searchParams.get("msg")) {
            isToastcalled = true
            toast.success(searchParams.get("msg"),{
                autoClose: 9000,
                pauseOnHover: true,
            })
            window.history.pushState({}, '', window.location.pathname);
        }
    }, [])

    if (!access.homepage_read) {
        return (<div>No custom Section image read access</div>)
    }
    return (<div className='home'>
        <Sidebar />
        {/* <ToastContainer icon={false} limit={1} autoClose={2000} /> */}
        <div className="homeContainer">
            <Navbar />
            {!access.homepage_read && 'No custom Section Image read access'}
            {access.homepage_read &&
                (<>
                    <div className="datatableTitle">
                        All Custom Section Image

                        <Button
                            disabled={access.homepage_create ? false : true}
                            onClick={() => {
                                window.location.href = '/custom-section-image/new';
                            }}
                            variant="contained">
                            Add New Custom Section Image
                        </Button>
                    </div>
                    <CustomSectionImageDatatable />
                </>)}

        </div>
    </div>);
}

export default CustomSectionImagesList;