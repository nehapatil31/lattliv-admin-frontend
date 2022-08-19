import './product.scss'
import { Link, useSearchParams } from "react-router-dom";
import ProductDatatable from '../../../components/datatable/ProductDatatable';
import Navbar from '../../../components/navbar/Navbar';
import Sidebar from '../../../components/sidebar/Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import * as access from '../../../access'
import React from "react";
import Button from '@mui/material/Button';

function ProductList() {
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

    if (!access.product_read) {
        return (<div>No product read access</div>)
    }
    return (<div className='home'>
        <Sidebar />
        {/* <ToastContainer icon={false} limit={1} autoClose={2000} /> */}
        <div className="homeContainer">
            <Navbar />
            {!access.product_read && 'No products read access'}
            {access.product_read &&
                (<>
                    <div className="datatableTitle">
                        All Products

                        <Button
                            disabled={access.product_create ? false : true}
                            onClick={() => {
                                window.location.href = '/products/new';
                            }}
                            variant="contained">
                            Add New Product
                        </Button>
                    </div>
                    <ProductDatatable />
                </>)}

        </div>
    </div>);
}

export default ProductList;