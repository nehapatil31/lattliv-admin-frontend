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
import CategoryDatatable from '../../components/datatable/CategoryDatatable';
import SeoDatatable from '../../components/datatable/SeoDatatable';
import SubCategoryDatatable from '../../components/datatable/SubCategoryDatatable';
import * as access from '../../access'
import Button from '@mui/material/Button';

function Seo() {
    const [value, setValue] = React.useState('1');
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState();
    const [products, setProducts] = useState();
    const [subCategories, setSubCategories] = useState();
    let isToastcalled = false
   
    useEffect(() => {
        

        if(value ==='1'){
            api.fetchProducts()
            .then(response => {
                setProducts(response.data)
            }).catch(error => {
                console.log(error)
                if(error.response.status === 401 ){
                    toast.error("Session Expired. Please Login Again",{
                        autoClose: 9000,
                        pauseOnHover: true,
                    })
                    setTimeout(() => {
                        window.location.href = '/login'
                    }, 1000);
                }
            })
        }else {
            api.fetchCategories()
            .then(response => {
                let subcategories = response.data.filter((item) => item.parent)
                let categories = response.data.filter((item) => !item.parent)
                setCategories(categories);
                setSubCategories(subcategories);
            }).catch(error => {
                console.log(error)
            });
        }
    }, [value])
    useEffect(() => {
        if(searchParams.get("products")){
            setValue("1");
        }else if(searchParams.get("categories")){
            setValue("2");
        }else if(searchParams.get("subcategories")){
            setValue("3");
        }
        if (!isToastcalled && searchParams.get("msg")) {
            isToastcalled = true
            toast.success(searchParams.get("msg"),{
                autoClose: 9000,
                pauseOnHover: true,
            })
        }
    }, [])

    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (<div className='home'>
        <Sidebar />
        <ToastContainer icon={false} limit={1} autoClose={2000} />
        <div className="homeContainer">
            <Navbar />
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Products" value="1" />
                        <Tab label="Categories" value="2" />
                        <Tab label="Sub categories" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1" style={{ height: '81%' }}>

                    {!access.product_read && 'No product read access'}
                    {access.product_read &&
                        <>
                            <div className="datatableTitle">
                            All Product SEO content
                            </div>
                            <SeoDatatable data={products} type='products' />
                        </>
                    }

                </TabPanel>
                <TabPanel value="2" style={{ height: '81%' }}>

                    {!access.category_read && 'No categories read access'}
                    {access.category_read &&
                        <>
                            <div className="datatableTitle">
                                All Categories SEO content
                            </div>
                            <SeoDatatable data={categories}  type='categories'/>
                        </>
                    }

                </TabPanel>
                <TabPanel value="3" style={{ height: '81%' }}>

                    {!access.subcategory_read && 'No subcategories read access'}
                    {access.subcategory_read &&
                        <>
                            <div className="datatableTitle">
                                All Sub Categories SEO content
                            </div>
                            <SeoDatatable data={subCategories}   type='subCategories'/>
                        </>
                    }

                </TabPanel>
            </TabContext>
        </div>
    </div>);
}

export default Seo;