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
    const [subCategories, setSubCategories] = useState();
    let isToastcalled = false
   
    useEffect(() => {
        
        api.fetchCategories()
            .then(response => {
                let subcategories = response.data.filter((item) => item.parent)
                let categories = response.data.filter((item) => !item.parent)
                setCategories(categories);
                setSubCategories(subcategories);

                if(searchParams.get("products")){
                    setValue("1");
                }else if(searchParams.get("categories")){
                    setValue("2");
                }else if(searchParams.get("subcategories")){
                    setValue("3");
                }
            }).catch(error => {
                console.log(error)
            });
    }, [])
    useEffect(() => {
        if (!isToastcalled && searchParams.get("msg")) {
            isToastcalled = true
            toast.success(searchParams.get("msg"))
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
                                All Products
                            </div>
                            <SeoDatatable categories={categories} />
                        </>
                    }

                </TabPanel>
                <TabPanel value="2" style={{ height: '81%' }}>

                    {!access.category_read && 'No categories read access'}
                    {access.category_read &&
                        <>
                            <div className="datatableTitle">
                                All Categories


                                <Button
                                    disabled={access.category_create ? false : true}
                                    onClick={() => {
                                        window.location.href = '/categories/new';
                                    }}
                                    variant="contained">
                                    Add New Category

                                </Button>
                            </div>
                            <CategoryDatatable categories={categories} />
                        </>
                    }

                </TabPanel>
                <TabPanel value="3" style={{ height: '81%' }}>

                    {!access.subcategory_read && 'No subcategories read access'}
                    {access.subcategory_read &&
                        <>
                            <div className="datatableTitle">
                                All Sub Categories
                                <Button
                                    disabled={access.subcategory_create ? false : true}
                                    onClick={() => {
                                        window.location.href = '/subcategories/new';
                                    }}
                                    variant="contained">
                                    Add New Sub Category
                                </Button>
                            </div>
                            <SubCategoryDatatable categories={categories} subCategories={subCategories} />
                        </>
                    }

                </TabPanel>
            </TabContext>
        </div>
    </div>);
}

export default Seo;