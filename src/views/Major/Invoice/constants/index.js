import React from "react";
import { Button, Input, InputNumber, Typography } from "antd";
import { DeleteOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

export const PagePath = [{ href: "/", title: "Trang chủ" }, { title: "Hóa đơn bán hàng", }];

export const addProductColunms = [
    {
        type: 'textbox',
        name: 'barcode',
        rules: [
            {
                required: true,
                message: 'không được để trống!',
            },
        ],
        label: 'Barcode',
        placeholder: 'Nhập barcode',
        labelCol: 24, colSpan: 24
    }
];

export const columns = (handleQuantityChange, handleRemoveItem, handleChangeDiscount) => {
    return [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'productid',
            key: 'productid',
            align: 'center',
            render: (productid, record) => (
                <Typography.Text>{record?.productname}</Typography.Text>
            ),
        },
        {
            title: 'Barcode',
            dataIndex: 'barcode',
            key: 'barcode',
            align: 'center',
        },
        {
            title: 'ĐVT',
            dataIndex: 'quantityunitname',
            key: 'quantityunitname',
            align: 'center',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            align: 'center',
            render: (price) => price.toLocaleString(),
        },
        {
            title: 'SL',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            render: (quantity, record) => (
                <InputNumber
                    min={1}
                    max={record.stock}
                    value={quantity}
                    onChange={(value) => handleQuantityChange(record.productid, value)}
                    style={{ width: '40px' }}
                />
            ),
        },
        // {
        //     title: 'Giảm',
        //     dataIndex: 'discount',
        //     key: 'discount',
        //     align: 'center',
        //     render: (discount, record) => (
        //         <Input
        //             value={discount}
        //             onChange={(e) => handleChangeDiscount(record.productid, e.target.value)}
        //             style={{ width: '80px' }}
        //         />
        //     ),
        // },
        {
            title: 'Thành tiền',
            key: 'total',
            align: 'center',
            render: (_, record) => (record.price * record.quantity).toLocaleString(),
        },
        {
            title: '',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Button type="link" danger onClick={() => handleRemoveItem(record.productid)} icon={<DeleteOutlined />} />
            ),
        },
    ]
}