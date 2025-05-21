import React from "react";
import { Button, Input, InputNumber, Typography } from "antd";
import { DeleteOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { render } from "@testing-library/react";
import dayjs from "dayjs";
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
    // {
    //     type: 'SelectBox',
    //     label: 'Thanh toán',
    //     name: 'paymentmethod',
    //     listOption: [
    //         {
    //             label: 'Tiền mặt',
    //             value: '1'
    //         },
    //         {
    //             label: 'Chuyển khoản',
    //             value: '2'
    //         }
    //     ],
    //     maxTagCount: 'responsive',
    // },
    // {
    //     type: 'SelectBox',
    //     label: 'Giảm giá',
    //     name: 'discounttype',
    //     listOption: [
    //         {
    //             label: 'Theo tiền',
    //             value: '1'
    //         },
    //         {
    //             label: 'Theo phần trăm',
    //             value: '2'
    //         }
    //     ],
    //     maxTagCount: 'responsive',
    // },
    // {
    //     type: 'SelectBox',
    //     label: 'Đơn vị tính',
    //     name: 'quantityunitid',
    //     listOption: [],
    //     maxTagCount: 'responsive',
    //     isLoadData: true,
    //     url: 'api/quantityunit/getCache',
    //     elementValue: 'quantityunitid',
    //     elementName: 'quantityunitname'
    // },
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
        render: (createdat) => {
            return new Date(createdat).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
        },
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
        dataIndex: 'discountamount',
        key: 'discountamount',
        align: 'center',
        width: 100,
        render: (discountamount) => discountamount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
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