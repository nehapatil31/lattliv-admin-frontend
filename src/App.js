
import './App.scss';
import {
  BrowserRouter,
  Switch,
  Routes,
  Link,
  Route
} from "react-router-dom";
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Product from './pages/product/Product';
import { productInputs, userInputs } from "./formSource";
import New from "./pages/newProduct/New";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route index element={<Home />}/>
            <Route path="login" element={<Login />}/>
            <Route path="products">
              <Route index element={<Product/>}/>
              <Route
                path="new"
                element={<New inputs={productInputs} title="Add New Product" />}
              />
              <Route path=":productId" element={<New inputs={productInputs} title="Edit Product" />} />
            </Route>
            <Route path="users">
              <Route index element={<Product/>}/>
              <Route
                path="new"
                element={<New inputs={productInputs} title="Add New Product" />}
              />
              <Route path=":productId" element={<New inputs={productInputs} title="Edit Product" />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
