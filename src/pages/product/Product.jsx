import './product.scss'
import { Link } from "react-router-dom";
import Datatable from '../../components/datatable/Datatable';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';

function Product() {
    return (<div className='home'>
        <Sidebar />
        <div className="homeContainer">
            <Navbar />
            <div className="datatableTitle">
                All products
                <Link to="/products/new" className="link">
                    Add New Product
                </Link>
            </div>
            <Datatable />
        </div>
    </div>);
}

export default Product;