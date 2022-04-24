export const userColumns = [
  { field: "id", headerName: "SKU", width: 70 },
  {
    field: "productName",
    headerName: "Product Name",
    width: 230,
    // renderCell: (params) => {
    //   return (
    //     <div className="cellWithImg">
    //       {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
    //       {params.row.productName}
    //     </div>
    //   );
    // },
  },
  {
    field: "price",
    headerName: "Price",
    width: 230,
  },
  {
    field: "category",
    headerName: "Category",
    width: 230,
  },

  // {
  //   field: "age",
  //   headerName: "Age",
  //   width: 100,
  // },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];

//temporary data
export const userRows = [
  {
    id: 1,
    price: 100,
    productName: "Snow",
    status: "published",
  },
  {
    id: 2,
    price: 100,
    productName: "Jamie Lannister",
    status: "review",
  },
  {
    id: 3,
    price: 100,
    productName: "Lannister",
    email: "3snow@gmail.com",
    status: "saved",
    age: 45,
  },
  {
    id: 4,
    price: 100,
    productName: "Stark",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "4snow@gmail.com",
    status: "published",
    age: 16,
  },
  {
    id: 5,
    price: 100,
    productName: "Targaryen",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "5snow@gmail.com",
    status: "review",
    age: 22,
  },
  {
    id: 6,
    price: 100,
    productName: "Melisandre",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "6snow@gmail.com",
    status: "published",
    age: 15,
  },
  {
    id: 7,
    price: 100,
    productName: "Clifford",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "7snow@gmail.com",
    status: "review",
    age: 44,
  },
  {
    id: 8,
    price: 100,
    productName: "Frances",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "8snow@gmail.com",
    status: "published",
    age: 36,
  },
  {
    id: 9,
    price: 100,
    productName: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "snow@gmail.com",
    status: "hidden",
    age: 65,
  },
  {
    id: 10,
    price: 100,
    productName: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "snow@gmail.com",
    status: "published",
    age: 65,
  },
];
