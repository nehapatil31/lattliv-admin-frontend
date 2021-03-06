const user = JSON.parse(localStorage.getItem('profile'));

//if user acces chnages then update local storage
export const user_id = user?.data?.id;
export const user_name = user?.data?.name;
export const user_email = user?.data?.email;

export const product_read = user?.data?.access?.products?.view;
export const product_create = user?.data?.access?.products?.create;
export const product_delete = user?.data?.access?.products?.delete;
export const product_edit = user?.data?.access?.products?.edit;
export const product_publish = user?.data?.access?.products?.publish;
export const product_hide = user?.data?.access?.products?.hide;


export const category_read = user?.data?.access?.categories?.view;
export const category_create = user?.data?.access?.categories?.create;
export const category_delete = user?.data?.access?.categories?.delete;
export const category_edit = user?.data?.access?.categories?.edit;
export const category_publish = user?.data?.access?.categories?.publish;
export const category_hide = user?.data?.access?.categories?.hide;

export const subcategory_read = user?.data?.access?.subcategories?.view;
export const subcategory_create = user?.data?.access?.subcategories?.create;
export const subcategory_delete = user?.data?.access?.subcategories?.delete;
export const subcategory_edit = user?.data?.access?.subcategories?.edit;
export const subcategory_publish = user?.data?.access?.subcategories?.publish;
export const subcategory_hide = user?.data?.access?.subcategories?.hide;


export const user_read = user?.data?.access?.users?.view;
export const user_create = user?.data?.access?.users?.create;
export const user_delete = user?.data?.access?.users?.delete;
export const user_edit = user?.data?.access?.users?.edit;

export const store_read = user?.data?.access?.stores?.view;
export const store_create = user?.data?.access?.stores?.create;
export const store_delete = user?.data?.access?.stores?.delete;
export const store_edit = user?.data?.access?.stores?.edit;


export const homepage_read = user?.data?.access?.homepage?.view;
export const homepage_create = user?.data?.access?.homepage?.create;
export const homepage_delete = user?.data?.access?.homepage?.delete;
export const homepage_edit = user?.data?.access?.homepage?.edit;

export const leadmanagement_read = user?.data?.access?.leadmanagement?.view;
export const leadmanagement_create = user?.data?.access?.leadmanagement?.create;
export const leadmanagement_delete = user?.data?.access?.leadmanagement?.delete;
export const leadmanagement_edit = user?.data?.access?.leadmanagement?.edit;