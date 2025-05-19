import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumb } from '../../../../components/Redux/Reducers';
import { ElementList, PagePath, SearchElement, columns } from '../constants';
import DataGird from '../../../../components/DataGird';
import { _fetchData } from '../../../../utils/CallAPI';
import { HOSTNAME } from '../../../../utils/constants/systemVars';
import { Notification } from '../../../../utils/Notification';
import SearchForm from '../../../../components/SearchForm';

const Search = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [isLoadComplete, setisLoadComplete] = useState(false);
    useEffect(() => {
        dispatch(setBreadcrumb(PagePath));
        loadData({});
    }, []);

    const handleSelectRow = (selectedRows) => {
        console.log("selectedRows", selectedRows)
    }

    const loadData = async (postData) => {
        setisLoadComplete(false);
        const response = await dispatch(_fetchData(HOSTNAME, 'api/brand/search', postData));
        if (!response.iserror) {
            console.log(response?.resultObject);
            setData(response?.resultObject);
            setisLoadComplete(true)
        } else {
            Notification('Thông báo', response.message, 'error');
            setisLoadComplete(true)
        }
    }

    const onSubmit = (MLObject) => {
        let postData = {
            $or: [
                {
                    brandid: MLObject.keyword
                },
                {
                    brandname: MLObject.keyword
                }
            ]
        }
        loadData(postData);
    }

    return (
        <>
            <SearchForm listColumn={SearchElement} layout='vertical' onSubmit={onSubmit} />
            {
                isLoadComplete &&
                <DataGird
                    pKey='brandid'
                    title='Danh sách nhà sản xuất'
                    listColumn={columns}
                    dataSource={data}
                    defaultCurrentPage={1}
                    defaultPageSize={10}
                    size='small'
                    bordered='enable'
                    showHeader={true}
                    showSizeChanger={true}
                    pageSizeOptions={['1', '10', '20', '50', '100']}
                    scroll={{ y: 1000, x: 1000 }}
                    isShowHeaderAction={true}
                    isShowButtonAdd={true}
                    isShowModalBtn={true}
                    TitleModal="nhà sản xuất"
                    listColumnModal={ElementList}
                    onSubmitModel={(values, action) => onSubmit({})}
                    hostName={HOSTNAME}
                    apiAdd='api/brand/add'
                    apiUpdate='api/brand/update'
                    apiDelete='api/brand/delete'
                    onSelectRowItem={(values) => onSubmit({})}
                />
            }
        </>
    );
}
export default Search;