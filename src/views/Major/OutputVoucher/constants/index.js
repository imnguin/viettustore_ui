import React from "react";
import { Button, Input, InputNumber, Typography } from "antd";
import { DeleteOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { render } from "@testing-library/react";
import dayjs from "dayjs";
import { formatDate } from "../../../../utils";
const now = new Date();

// Tạo fromDate là ngày 1 đầu tháng (giờ 00:00:00)
const fromDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);

// Tạo toDate là hôm nay (giờ 23:59:59.999)
const toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
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
            title: 'Thành tiền',
            key: 'totalprice',
            align: 'center',
            render: (_, record) => (record.quantity * record.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: 'Giảm giá',
            dataIndex: 'promotion',
            key: 'promotion',
            align: 'center',
            render: (promotion, record) => (
                <Input
                    value={promotion}
                    onChange={(e) => handleApplyDiscount(record.productid, e.target.value)}
                    style={{ width: '80px' }}
                />
            ),
        },
        {
            title: 'Khách phải trả',
            dataIndex: 'totalamount',
            key: 'totalamount',
            align: 'center',
            render: (_, record) => (record.totalamount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: '',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Button type="link" danger onClick={() => handleRemoveItem(record.productid)} icon={<DeleteOutlined />} />
            ),
            width: 40,
        },
    ]
}

export const SearchElement = [
    {
        type: 'TextBox',
        label: 'Tìm kiếm',
        name: 'keyword',
        placeholder: 'Nhập mã hóa đơn'
    },
    {
        type: 'DatePicker',
        label: 'Từ ngày',
        name: 'fromdate',
        defaultValue: fromDate
    },
    {
        type: 'DatePicker',
        label: 'Đến ngày',
        name: 'todate',
        defaultValue: toDate
    },
];

export const InitParam = {
    fromdate: fromDate,
    todate: toDate
}

export const historyColumns = [
    {
        title: 'Mã hóa đơn',
        dataIndex: 'outputvoucherid',
        key: 'outputvoucherid',
        render: (key, item) => (
            <Link key={key} to={`/OutputVoucher/Detail/${item.outputvoucherid}`}>{item.outputvoucherid}</Link>
        ),
        fixed: 'left',
        width: 100,
        align: 'center',
    },
    {
        title: 'Tiền thu của khách',
        dataIndex: 'totalamount',
        key: 'totalamount',
        render: (totalamount) => {
            return totalamount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        },
        width: 100,
        align: 'center',
    },
    {
        title: 'Tiền giảm giá',
        dataIndex: 'discountamount',
        key: 'discountamount',
        render: (discountamount) => {
            return discountamount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        },
        width: 100,
        align: 'center',
    },
    {
        title: 'Ngày lập hóa đơn',
        dataIndex: 'createdat',
        key: 'createdat',
        render: (text) => (formatDate(text)),
        width: 100,
        align: 'center'
    }
];

export const outputvoucherDetailColumns = [
    {
        title: 'Sản phẩm',
        dataIndex: 'productid',
        key: 'productid',
        render: (key, item) => (
            <>{item.productid} - {item.productname}</>
        ),
        align: 'center',
        width: 150,
    },
    {
        title: 'Barcode',
        dataIndex: 'barcode',
        key: 'barcode',
        align: 'center',
        width: 100,
    },
    {
        title: 'Đơn vị tính',
        dataIndex: 'quantityunitname',
        key: 'quantityunitname',
        width: 100,
        align: 'center',
    },
    {
        title: 'Đơn giá',
        dataIndex: 'price',
        key: 'price',
        render: (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        width: 100,
        align: 'center',
    },
    {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 50,
        align: 'center',
    },
    {
        title: 'Giảm giá',
        dataIndex: 'promotion',
        key: 'promotion',
        align: 'center',
        width: 100,
        render: (promotion) => promotion.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
    },
    {
        title: 'Thành tiền',
        key: 'totalamount',
        dataIndex: 'totalamount',
        align: 'center',
        width: 100,
        render: (totalamount) => totalamount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
    },
]