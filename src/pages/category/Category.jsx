import './category.scss'
import { Link, useSearchParams } from "react-router-dom";
import ProductDatatable from '../../components/datatable/ProductDatatable';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { Grid } from '@mui/material';

function Category() {
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
            <div className="datatableTitle">
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        All Categories
                    </Grid>
                    <Grid item xs={2}>
                        <Link to="/categories/new" className="link">
                            Add New Category
                        </Link>
                    </Grid>
                    <Grid item xs={2}>
                        <Link to="/subcategories/new" className="link">
                            Add New Sub Category
                        </Link>
                    </Grid>
                </Grid>
            </div>
            <ProductDatatable />
        </div>
    </div>);
}

export default Category;