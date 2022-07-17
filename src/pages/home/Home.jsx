import "./home.scss";
import Sidebar from '../../components/sidebar/Sidebar';
import React, { useState } from 'react';
import Navbar from "../../components/navbar/Navbar";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    {name:'NifluxLed Light Bulb', count:159},
    {name:'The Slim Wallet for Men', count:237},
    {name:'Smart Clock', count:262},
    {name:'Home Decorative Metal Cycle', count:305},
    {name:'Artificial Plant with Pot ', count:356}
];
const rows_category =[
    {name:'Books', count:159},
    {name:'Fashion', count:237},
    {name:'Electronics', count:262},
    {name:'Baby', count:305},
    {name:'Gift cards ', count:356}
]
const rows_blog =[
    {name:'Affordable shopping for all', count:159},
    {name:'#LattlivWrapped2021', count:237},
    {name:'Everything you need to know about fast fashion', count:262},
    {name:'Fast Home Decoration Types', count:305},
    {name:'', count:''}
]

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Quantity',
            color: "#000000",
            font: {
                size: 18
            }
        },
    },
};

const labels = ['Saved', 'Published', 'Hidden', 'Review', 'Trashed'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Products',
            data: [10, 45, 21, 33, 7],
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
        },
        {
            label: 'Categories',
            data: [21, 54, 33, 27, 10],
            backgroundColor: 'rgba(53, 162, 235, 0.8)',
        },
    ],
};

function Home() {
    let getData = function(type){
        if(type=='product'){
            return rows;
        }else if(type=='category'){
            return rows_category
        }else if(type=='blog'){
            return rows_blog;
        }else if(type=='visitor'){
            return rows
        }
    }
    let [tableData, setTableData] = useState(rows)
    const [type, setType] = useState('product');
    const handleChange = (event) => {
        setType(event.target.value);
        let data = getData(event.target.value);
        setTableData(data)
    };
    const user = JSON.parse(localStorage.getItem('profile'));
    if (!user && window.location.pathname != '/login') {
        window.location.href = '/login';
        return null
    }
    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />

                <div className="bar-chart">
                    <Grid container spacing={2}>

                        <Grid item xs={8}>
                            <div className="bar-container">
                            <Bar options={options} data={data} />
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <Grid container spacing={2}>

                                {/* <Grid item xs={4}>
                                </Grid> */}
                                <Grid item xs={8} style={{ textAlign: 'left' }}>
                                    <h3>Views</h3>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} style={{ float: 'right' }}>
                                        <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={type}
                                            onChange={handleChange}
                                            label="Type"
                                        >
                                            <MenuItem value='product'>Products</MenuItem>
                                            <MenuItem value='category'>Categories</MenuItem>
                                            <MenuItem value='blog'>Blogs</MenuItem>
                                            <MenuItem value='visitor'>Visitors</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>



                            <br />
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{fontWeight:"600"}}>Title</TableCell>
                                            <TableCell style={{fontWeight:"600"}} align="right">Count</TableCell>
                                            {/* <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tableData.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="right">{row.count}</TableCell>
                                                {/* <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell> */}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>

                    <br />
                    <br />

                </div>



            </div>
        </div>
    );
}

export default Home;