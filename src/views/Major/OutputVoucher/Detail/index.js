import React, { useEffect, useState } from 'react';
import { Collapse } from 'antd';
import OutputVoucherInfo from '../components/OutputVoucherInfo';
import OutputVoucherDetail from '../components/OutputVoucherDetail';
import { useParams } from 'react-router-dom';
import { HOSTNAME } from '../../../../utils/constants/systemVars';
import { Notification } from '../../../../utils/Notification';
import { useDispatch } from 'react-redux';
import { _fetchData } from '../../../../utils/CallAPI';

const Detail = () => {
    const { outputvoucherid } = useParams();
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [isLoadComplete, setisLoadComplete] = useState(false);
    const onChange = key => {
        console.log(key);
    };

    useEffect(() => {
        loadData({ outputvoucherid });
    }, []);

    const loadData = async (postData) => {
        setisLoadComplete(false)
        const response = await dispatch(_fetchData(HOSTNAME, 'api/outputvoucher/load', postData));
        if (!response.iserror) {
            console.log(response?.resultObject);
            setData(response?.resultObject);
            setisLoadComplete(true)
        } else {
            Notification('Thông báo', response.message, 'error');
            setisLoadComplete(true)
        }
    }

    const items = [
        {
            key: '1',
            label: <span style={{ fontSize: '16px', fontWeight: 400 }}>Thông tin hóa đơn</span>,
            children: <OutputVoucherInfo dataSource={data} />,
        },
        {
            key: '2',
            label: <span style={{ fontSize: '16px', fontWeight: 400 }}>Chi tiết sản phẩm</span>,
            children: <OutputVoucherDetail dataSource={data} />,
        },
    ];

    return isLoadComplete && <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} />;
};
export default Detail;