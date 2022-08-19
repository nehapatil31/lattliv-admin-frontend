import Tooltip from "@mui/material/Tooltip";
import React from "react";

export const userColumns = [
	{
		field: "serial",
		headerName: "Sr. No.",
		width: 70,
	},
	{ field: "sku", headerName: "SKU", width: 80 },
	{
		field: "name",
		headerName: "Product Name",
		width: 180,
		renderCell: (params) => (
			<Tooltip title={params.row.name}>
				<span className="table-cell-trucate">{params.row.name}</span>
			</Tooltip>
		),
	},
	{
		field: "price",
		headerName: "Price (Rs)",
		width: 120,
	},
	{
		field: "category",
		headerName: "Category",
		width: 160,
		renderCell: (params) => {
			return (
				<Tooltip title={params.row.category.parent?.name}>
					<div className="rowitem">
						{params.row.category.parent?.name}
					</div>
				</Tooltip>
			);
			//return <div className="rowitem">{params.row.category.parent?.name}</div>;
		},
	},
	{
		field: "subcategory",
		headerName: "SubCategory",
		width: 160,
		renderCell: (params) => {
			return (
				<Tooltip title={params.row.category.name}>
					<div className="rowitem">{params.row.category.name}</div>
				</Tooltip>
			); //<div className="rowitem">{params.row.category.name}</div>;
		},
	},
	{
		field: "status",
		headerName: "Status",
		width: 160,
		renderCell: (params) => {
			return (
				<div className={`cellWithStatus ${params.row.state.name}`}>
					{params.row.state.name}
				</div>
			);
		},
	},
	{
		field: "image",
		headerName: "Image",
		width: 120,
		renderCell: (params) => {
			return (
				<>
					{params.row.images.images.length> 0 && params.row.images.images.map((element, index) => {
						if (element.isHeroImg) {
							return (
								<a
									href={element.url}
									rel="noreferrer"
									target="_blank"
								>
									<img
										src={element.url}
										alt={element.alttag}
										style={{
											height: "50px",
											width: "50px",
											border: "1px solid #B1B1B1",
											padding: "3px",
										}}
									/>
								</a>
							);
						}
					})}
				</>
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
