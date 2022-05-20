
import './App.scss';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import ProductList from './pages/product/list/Product';
import UserList from './pages/user/list/userList';
import { productInputs } from "./formSource";
import NewProduct from "./pages/product/create/New";
import Category from './pages/category/Category';
import NewUser from './pages/user/create/New';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route index element={<Home />}/>
            <Route path="login" element={<Login />}/>
            <Route path="products">
              <Route index element={<ProductList/>}/>
              <Route
                path="new"
                element={<NewProduct inputs={productInputs} title="Add New Product" />}
              />
              <Route path=":productId" element={<NewProduct inputs={productInputs} title="Edit Product" />} />
            </Route>
            <Route path="users">
              <Route index element={<UserList/>}/>
              <Route
                path="new"
                element={<NewUser inputs={productInputs} title="Add New User" />}
              />
            </Route>
            <Route path="categories">
              <Route index element={<Category/>}/>
              {/* <Route
                path="new"
                element={<New inputs={productInputs} title="Add New Product" />}
              />
              <Route path=":productId" element={<New inputs={productInputs} title="Edit Product" />} /> */}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
