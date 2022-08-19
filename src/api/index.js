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
export const fetchStores = () => API.get('/store');

export const fetchUser = (id) => API.get(`/user/${id}`);
export const fetchCategory = (id) => API.get(`/categories/${id}`);
export const fetchProduct = (id) => API.get(`/products/${id}`);
export const fetchStore = (id) => API.get(`/store/${id}`);

export const createProduct = (newProduct) => API.post('/products/create', newProduct);
export const createUser = (newUser) => API.post('/user/register', newUser);
export const createSubcategory = (newUser) => API.post('/categories/create', newUser);
export const createStore = (newStore) => API.post('/store', newStore);

export const updateProduct = (id, product) => API.post(`/products/update/${id}`, product);
export const updateCategory = (id, category) => API.post(`/categories/update/${id}`, category);
export const updateUser = (id, user) => API.post(`/user/update/${id}`, user);
export const updateStore = (id,store) => API.patch(`/store/${id}`, store);

export const createCategory = (newCategory) => API.post('categories/create', newCategory);
export const updateBulk = (newData) => API.post('/states/update/bulk', newData);


export const createBanner = (data) => API.post('/banner', data);
export const fetchBanners = () => API.get('/banner');

//tag
export const createTag = (data) => API.post('/tag', data);
export const fetchTags = () => API.get(`/tag`);
export const fetchTag = (id) => API.get(`/tag/${id}`);
export const updateTag = (id,data) => API.patch(`/tag/${id}`, data);
export const deleteTag = (data) => API.delete(`/tag/`, {data:data});


//section
export const section = (data) => API.post('/section', data);
export const updateSection= (id,data) => API.patch(`/section/${id}`, data);
export const deleteSection = (data) => API.delete(`/section/`, {data:data});

export const fetchSectionImage = (id) => API.get(`/section/image/${id}`);
export const fetchSectionImages = () => API.get(`/section/image/`);

export const fetchSection = (id) => API.get(`/section/noimage/${id}`);
export const fetchSections = () => API.get(`/section/noimage/`);
//comic
export const createComic = (data) => API.post('/comic', data);
export const fetchComics = () => API.get('/comic');
export const fetchComic = (id) => API.get(`/comic/${id}`);
export const updateComic = (id,data) => API.patch(`/comic/${id}`, data);
export const deleteComic = (data) => API.delete(`/comic/`, {data:data});

export const restoreItem = (data) => API.patch('/trash', data);
export const deleteItem = (data) => {
    return API.delete('/trash', {data})
};
export const deleteStore = (data) => {
    return API.delete('/store', {data:data});
};

export const fetchLeads = () => API.get(`/lead/`);
export const updateLeads = (id,data) => API.patch(`/lead/${id}`,data);