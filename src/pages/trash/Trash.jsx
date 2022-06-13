import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
// import './category.scss'
import { Link, useSearchParams } from "react-router-dom";
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import * as api from '../../api';
import TrashDatatable from '../../components/datatable/TrashDatatable';
import * as access from '../../access'


function Trash() {
    const [items, setItems] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    let isToastcalled = false
   
    useEffect(() => {
        
            api.fetchTrashedItems()
            .then(response => {
                setItems(response.data)
            }).catch(error => {
                console.log(error)
            })
    }, [])
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
            {!access.product_read && 'No product read access'}
                    {access.product_read &&
                        <>
                            <div className="datatableTitle">
                                Trashed items
                            </div>
                            <TrashDatatable data={items} />
                        </>
                    }
        </div>
    </div>);
}

export default Trash;