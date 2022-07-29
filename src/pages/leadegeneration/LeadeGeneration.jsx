
import { Link, useSearchParams } from "react-router-dom";
import LeadeGenerationDatatable from '../../components/datatable/LeadeGenerationDatatable';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import * as access from '../../access'
import React from "react";
import Button from '@mui/material/Button';

function LeadeGeneration() {
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

    if (!access.product_read) {
        return (<div>No product read access</div>)
    }
    return (<div className='home'>
        <Sidebar />
        <ToastContainer icon={false} limit={1} autoClose={2000} />
        <div className="homeContainer">
            <Navbar />
            {!access.product_read && 'No products read access'}
            {access.product_read &&
                (<>
                      <LeadeGenerationDatatable />
                  
                </>)}

        </div>
    </div>);
}

export default LeadeGeneration;