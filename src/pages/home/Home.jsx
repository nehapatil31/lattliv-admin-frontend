import "./home.scss";
import Sidebar from '../../components/sidebar/Sidebar';
import React from "react";
import Navbar from "../../components/navbar/Navbar";
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

  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' ,
      },
      title: {
        display: true,
        text: 'Kuch b de dena',
      },
    },
  };
  
  const labels = ['Saved', 'Published', 'Hidden', 'Review', 'Trashed'];
  
  export const data = {
    labels,
    datasets: [
      {
        label: 'Products',
        data: [10,45,21,33,7],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Categories',
        data: [21,54,33,27,10],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  
function Home() {
    const user = JSON.parse(localStorage.getItem('profile'));
    if(!user && window.location.pathname !='/login'){
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
                </div>
               
               

            </div>
        </div>
        );
}

export default Home;