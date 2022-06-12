import "./home.scss";
import Sidebar from '../../components/sidebar/Sidebar';
import React from "react";
import Navbar from "../../components/navbar/Navbar";

function Home() {
    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <h2 style={{marginLeft: "12px"}}>Products</h2>
                <div class="row">
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container">
                            <div className="number">25 </div>
                            <div className="number-text">Published</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container" style={{color:"rgb(255, 193, 7)"}}>
                            <div className="number">121 </div>
                            <div className="number-text">Saved</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container" style={{color:"rgb(244, 67, 54)"}}>
                            <div className="number">97 </div>
                            <div className="number-text">Hidden</div>
                            </div>
                        </div>
                    </div>
                    {/* <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <p id="sub">Maybe a sub-heading</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus quam in libero lacinia interdum. Vivamus sed sem vel dui suscipit volutpat. Maecenas ultricies nibh lacus,</p>
                        </div>
                        <div class="card-footer">
                            <ul class="card-actions">
                                <a href=""> <li>Share</li></a>
                                <a href=""> <li>Read more</li></a>
                                <a href=""> <li>Contact</li></a>
                            </ul>
                        </div>
                    </div> */}
                </div>
                <h2 style={{marginLeft: "12px"}}>Visitors</h2>
                <div class="row">
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container">
                            <div className="number">326</div>
                            <div className="number-text">Now</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container" style={{color:"rgb(255, 193, 7)"}}>
                            <div className="number">1265 </div>
                            <div className="number-text">Yesterday</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container" style={{color:"rgb(244, 67, 54)"}}>
                            <div className="number">1590 </div>
                            <div className="number-text">Last week</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container" style={{color:"rgb(76, 175, 80)"}}>
                            <div className="number">2100 </div>
                            <div className="number-text">Last month</div>
                            </div>
                        </div>
                    </div>
                </div>
                <h2 style={{marginLeft: "12px"}}>Store location page views</h2>
                <div class="row">
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container">
                            <div className="number">326</div>
                            <div className="number-text">Now</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container" style={{color:"rgb(255, 193, 7)"}}>
                            <div className="number">1265 </div>
                            <div className="number-text">Yesterday</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container" style={{color:"rgb(244, 67, 54)"}}>
                            <div className="number">1590 </div>
                            <div className="number-text">Last week</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container" style={{color:"rgb(76, 175, 80)"}}>
                            <div className="number">2100 </div>
                            <div className="number-text">Last month</div>
                            </div>
                        </div>
                    </div>
                </div>
                <h2 style={{marginLeft: "12px"}}>Most viewed products</h2>
                <div class="row">
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container">
                            <div className="number">326</div>
                            <div className="number-text">Now</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container" style={{color:"rgb(255, 193, 7)"}}>
                            <div className="number">1265 </div>
                            <div className="number-text">Yesterday</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container" style={{color:"rgb(244, 67, 54)"}}>
                            <div className="number">1590 </div>
                            <div className="number-text">Last week</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container" style={{color:"rgb(76, 175, 80)"}}>
                            <div className="number">2100 </div>
                            <div className="number-text">Last month</div>
                            </div>
                        </div>
                    </div>
                    {/* <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <p id="sub">Maybe a sub-heading</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus quam in libero lacinia interdum. Vivamus sed sem vel dui suscipit volutpat. Maecenas ultricies nibh lacus,</p>
                        </div>
                        <div class="card-footer">
                            <ul class="card-actions">
                                <a href=""> <li>Share</li></a>
                                <a href=""> <li>Read more</li></a>
                                <a href=""> <li>Contact</li></a>
                            </ul>
                        </div>
                    </div> */}
                </div>
                <h2 style={{marginLeft: "12px"}}>Most viewed blogs</h2>
                <div class="row">
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container">
                            <div className="number">326</div>
                            <div className="number-text">Now</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container" style={{color:"rgb(255, 193, 7)"}}>
                            <div className="number">1265 </div>
                            <div className="number-text">Yesterday</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container" style={{color:"rgb(244, 67, 54)"}}>
                            <div className="number">1590 </div>
                            <div className="number-text">Last week</div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <div className="number-container" style={{color:"rgb(76, 175, 80)"}}>
                            <div className="number">2100 </div>
                            <div className="number-text">Last month</div>
                            </div>
                        </div>
                    </div>
                    {/* <div class="card">
                        <div class="card-top">
                        </div>
                        <div class="card-body">
                            <p id="sub">Maybe a sub-heading</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus quam in libero lacinia interdum. Vivamus sed sem vel dui suscipit volutpat. Maecenas ultricies nibh lacus,</p>
                        </div>
                        <div class="card-footer">
                            <ul class="card-actions">
                                <a href=""> <li>Share</li></a>
                                <a href=""> <li>Read more</li></a>
                                <a href=""> <li>Contact</li></a>
                            </ul>
                        </div>
                    </div> */}
                </div>
                
               
               

            </div>
        </div>
        );
}

export default Home;