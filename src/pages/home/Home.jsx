import "./home.scss";
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from "../../components/navbar/Navbar";

function Home() {
    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                Analytics cards
            </div>
        </div>
        );
}

export default Home;