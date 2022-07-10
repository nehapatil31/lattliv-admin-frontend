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
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Kuch b de dena',
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
    const [type, setType] = useState('product');
    const handleChange = (event) => {
        setType(event.target.value);
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
                    <Bar options={options} data={data} />
                    <br />
                    <br />
                    <Grid container spacing={2}>

                        <Grid item xs={4}>
                        </Grid>
                        <Grid item xs={4} style={{textAlign: 'center'}}>
                            <h3>Views</h3>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} style={{float: 'right'}}>
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
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell align="right">Count</TableCell>
                                    {/* <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                    <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                    <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.calories}</TableCell>
                                        {/* <TableCell align="right">{row.fat}</TableCell>
                                        <TableCell align="right">{row.carbs}</TableCell>
                                        <TableCell align="right">{row.protein}</TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>



            </div>
        </div>
    );
}

export default Home;