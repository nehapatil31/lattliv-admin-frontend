import axios from 'axios';

const API = axios.create({ baseURL: 'https://adminapi.pratapindustries.in' });
// const url = 'http://localhost:5000/posts';
// const url = 'https://impressions01.herokuapp.com/posts';

API.interceptors.request.use((req) => {
    req.headers['Access-Control-Allow-Origin']= "*"
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
})
export const signin = (data) => API.post('/user/login', data);
export const uploadFile = (data) => API.post('/upload', data);

export const fetchProducts = () => API.get('/products');
export const fetchUsers = () => API.get('/user');
export const fetchCategories = () => API.get('/categories');
export const fetchTrashedItems = () => API.get('/trash');

export const fetchUser = (id) => API.get(`/user/${id}`);
export const fetchCategory = (id) => API.get(`/categories/${id}`);
export const fetchProduct = (id) => API.get(`/products/${id}`);

export const createProduct = (newProduct) => API.post('/products/create', newProduct);
export const createUser = (newUser) => API.post('/user/register', newUser);
export const createSubcategory = (newUser) => API.post('/categories/create', newUser);

export const updateProduct = (id, product) => API.post(`/products/update/${id}`, product);
export const updateCategory = (id, category) => API.post(`/categories/update/${id}`, category);
export const updateUser = (id, user) => API.post(`/user/update/${id}`, user);

export const createCategory = (newCategory) => API.post('categories/create', newCategory);
export const updateBulk = (newData) => API.post('/states/update/bulk', newData);


export const restoreItem = (data) => API.patch('/trash', data);
export const deleteItem = (data) => {
    return API.delete('/trash', {data})
};



export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);

export const deletePost = (id) => API.delete(`/posts/${id}`);

export const likePost = (id) => API.patch(`/posts/${id}/likePost`);

export const signup = (data) => API.post('/user/signup', data);
export const googleSignin = (data) => API.post('/user/google', data);

//News api
export const fetchNews = (data) => API.post('/news', data);
export const bookmarkNews = (title) => API.patch(`/news/${title}`);