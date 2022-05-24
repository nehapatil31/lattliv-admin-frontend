const user = JSON.parse(localStorage.getItem('profile'));

export const product_read = user?.data?.access?.products?.view;
export const product_create = user?.data?.access?.products?.create;
export const product_delete = user?.data?.access?.products?.delete;