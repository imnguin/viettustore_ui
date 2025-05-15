import React from "react";
import { Button, InputNumber, Typography } from "antd";
import { DeleteOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

export const PagePath = [{ href: "/", title: "Trang chủ" }, { title: "Hóa đơn bán hàng", }];

export const addProductColunms = [
    {
        type: 'textbox',
        name: 'productid',
        rules: [
            {
                required: true,
                message: 'không được để trống!',
            },
        ],
        label: 'Nhập mã sản phẩm',
        placeholder: 'Nhập mã sản phẩm',
        labelCol: 24, colSpan: 24
    }
];

export const columns = (handleQuantityChange, handleRemoveItem) => {
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
                <Typography.Text>{productid} - {record?.productname}</Typography.Text>
            ),
        },
        {
            title: 'Đơn vị',
            dataIndex: 'quantityunitname',
            key: 'quantityunitname',
            align: 'center',
        },
        {
            title: 'Đơn giá (VNĐ)',
            dataIndex: 'price',
            key: 'price',
            align: 'center',
            render: (price) => price.toLocaleString(),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            render: (quantity, record) => (
                <InputNumber
                    min={1}
                    max={record.stock}
                    value={quantity}
                    onChange={(value) => handleQuantityChange(record._id, value)}
                    style={{ width: '80px' }}
                />
            ),
        },
        {
            title: 'Thành tiền (VNĐ)',
            key: 'total',
            align: 'center',
            render: (_, record) => (record.price * record.quantity).toLocaleString(),
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Button type="link" danger onClick={() => handleRemoveItem(record.productid)} icon={<DeleteOutlined />} />
            ),
        },
    ]
}