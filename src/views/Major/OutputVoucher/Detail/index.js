import React from 'react';
import { Collapse } from 'antd';
import OutputVoucherInfo from '../components/OutputVoucherInfo';
import OutputVoucherDetail from '../components/OutputVoucherDetail';
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const items = [
    {
        key: '1',
        label: <span style={{ fontSize: '15px', }}>Thông tin hóa đơn</span>,
        children: <OutputVoucherInfo />,
    },
    {
        key: '2',
        label: <span style={{ fontSize: '15px', }}>Chi tiết sản phẩm</span>,
        children: <OutputVoucherDetail />,
    },
];

const Detail = () => {
    const onChange = key => {
        console.log(key);
    };
    return <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} />;
};
export default Detail;