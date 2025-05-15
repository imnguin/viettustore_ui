import {
    HomeOutlined,
    OrderedListOutlined,
    SettingOutlined
} from '@ant-design/icons';

const AppMenu = [
    {
        name: 'Home',
        icon: HomeOutlined,
        label: 'Trang chủ',
        path: '/'
    },
    {
        name: 'Declaration',
        icon: SettingOutlined,
        label: 'Khai báo',
        path: '',
        subItem: [
            {
                name: 'User',
                label: 'Nhân viên',
                path: '/User',
                subItem: []
            },
            {
                name: 'Area',
                label: 'Khu vực',
                path: '/Area',
                subItem: []
            },
            {
                name: 'Brand',
                label: 'Nhà sản xuất',
                path: '/Brand',
                subItem: []
            },
            {
                name: 'Branch',
                label: 'Thương hiệu',
                path: '/Branch',
                subItem: []
            },
            {
                name: 'QuantityUnit',
                label: 'Đơn vị tính',
                path: '/QuantityUnit',
                subItem: []
            },
            {
                name: 'Product',
                label: 'Sản phẩm',
                path: '/Product',
                subItem: []
            },
        ]
    },
    {
        name: 'Major',
        icon: OrderedListOutlined,
        label: 'Nghiệp vụ',
        path: '',
        subItem: [
            {
                name: 'Invoice',
                label: 'Hóa đơn',
                path: '/Invoice',
                subItem: []
            },
        ]
    }
];

export default AppMenu;