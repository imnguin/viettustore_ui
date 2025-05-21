import React, { useEffect, useState } from "react";
import { HOSTNAME } from "../../../../utils/constants/systemVars";
import { _fetchData } from "../../../../utils/CallAPI";
import { setBreadcrumb } from "../../../../components/Redux/Reducers";
import { Notification } from "../../../../utils/Notification";
import { historyColumns, PagePath, SearchElement } from "../constants";
import SearchForm from "../../../../components/SearchForm";
import { useDispatch } from "react-redux";
import DataGird from "../../../../components/DataGird";

const History = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [isLoadComplete, setisLoadComplete] = useState(false);

    useEffect(() => {
        dispatch(setBreadcrumb(PagePath));
        loadData({});
    }, []);

    const onSubmit = (MLObject) => {
        let postData = {};
        let fromdate = MLObject?.fromdate ? new Date(MLObject?.fromdate) : new Date();
        let todate = MLObject?.todate ? new Date(MLObject?.todate) : new Date();
        fromdate.setHours(0, 0, 0, 0);
        todate.setHours(23, 59, 59, 999);
        if (!!MLObject?.keyword) {
            postData = {
                outputvoucherid: MLObject?.keyword, // Điều kiện outputvoucherid
                createdat: {
                    $gte: fromdate, // Từ ngày
                    $lte: todate,   // Đến ngày
                }
            }
        } else {
            postData = {
                createdat: {
                    $gte: fromdate, // Từ ngày
                    $lte: todate,   // Đến ngày
                }
            }
        }
        loadData(postData);
    }

    const loadData = async (postData) => {
        setisLoadComplete(false);
        const response = await dispatch(_fetchData(HOSTNAME, 'api/outputvoucher/search', postData));
        if (!response.iserror) {
            console.log(response?.resultObject);
            setData(response?.resultObject);
            setisLoadComplete(true)
        } else {
            Notification('Thông báo', response.message, 'error');
            setisLoadComplete(true)
        }
    }

    return (
        <>
            <SearchForm
                listColumn={SearchElement}
                layout='vertical'
                onSubmit={onSubmit}
            />

            <DataGird
                isDisableRowSelect={true}
                pKey='outputvoucherid'
                title='Danh sách hóa đơn'
                listColumn={historyColumns}
                dataSource={data}
                defaultCurrentPage={1}
                defaultPageSize={20}
                size='small'
                bordered='enable'
                showHeader={true}
                showSizeChanger={true}
                pageSizeOptions={['1', '10', '20', '50', '100']}
                scroll={{ y: 1000, x: 1000 }}
                isShowHeaderAction={true}
                isShowButtonAdd={true}
                urlAdd='/outputvoucher'
            />
        </>
    )
}
export default History;