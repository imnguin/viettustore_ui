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

export const columns = (handleQuantityChange, handleRemoveItem, handleApplyDiscount) => {
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
            render: (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
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
                    style={{ width: '60px' }}
                />
            ),
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discount',
            key: 'discount',
            align: 'center',
            render: (discount, record) => (
                <Input
                    value={discount}
                    onChange={(e) => handleApplyDiscount(record.productid, e.target.value)}
                    style={{ width: '80px' }}
                />
            ),
        },
        {
            title: 'Thành tiền',
            key: 'total',
            align: 'center',
            render: (_, record) => {
                // record.total = record.price * record.quantity; // Giá trị mặc định
                // if (typeof record.discount === 'string' && record.discount.endsWith('%')) {
                //     const percent = getNumberFromPercent(record.discount);
                //     if (percent !== null) {
                //         record.total = record.total - (percent / 100) * record.total; // Giảm theo phần trăm
                //     }
                // } else if (!isNaN(Number(record.discount))) {
                //     record.total = record.total - Number(record.discount); // Giảm theo số tiền cố định
                // }
                return record.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            },
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