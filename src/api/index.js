import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:1337' });
// const url = 'http://localhost:5000/posts';
// const url = 'https://impressions01.herokuapp.com/posts';

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
})
export const signin = (data) => API.post('/user/login', data);

export const fetchProducts = () => API.get('/products');
export const fetchUsers = () => API.get('/user');
export const fetchUser = (id) => API.get(`/user/${id}`);

export const createUser = (newUser) => API.post('/user/register', newUser);

export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);

export const deletePost = (id) => API.delete(`/posts/${id}`);

export const likePost = (id) => API.patch(`/posts/${id}/likePost`);

export const signup = (data) => API.post('/user/signup', data);
export const googleSignin = (data) => API.post('/user/google', data);

//News api
export const fetchNews = (data) => API.post('/news', data);
export const bookmarkNews = (title) => API.patch(`/news/${title}`);