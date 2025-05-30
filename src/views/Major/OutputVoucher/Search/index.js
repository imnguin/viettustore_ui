import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumb } from '../../../../components/Redux/Reducers';
import { PagePath, addProductColunms, columns } from '../constants';
import { _fetchData } from '../../../../utils/CallAPI';
import { HOSTNAME } from '../../../../utils/constants/systemVars';
import { Notification } from '../../../../utils/Notification';
import { Row, Col, Card, Table, Button, Input, Form, Typography, Modal, Select, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormContainer from '../../../../components/FormContainer';
import ColumnGroup from 'antd/es/table/ColumnGroup';

const { Option } = Select;
const { Text } = Typography;

const Search = () => {
    const user = JSON.parse(localStorage.getItem('logininfo'))
    const [modal, contextHolder] = Modal.useModal();
    let objjd = null;
    const onCloseModal = () => {
        objjd.destroy();
    };

    const dispatch = useDispatch();
    const [cart, setCart] = useState([]);
    const [discountCode, setDiscountCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('1');
    const [barcode, setBarcode] = useState('');
    const [loading, setLoading] = useState(false);
    const [weight, setWeight] = useState('0.00');
    const [status, setStatus] = useState('Ngắt kết nối');

    useEffect(() => {
        dispatch(setBreadcrumb(PagePath));
    }, []);

    // useEffect(() => {
    //     // Kết nối với WebSocket server
    //     const ws = new WebSocket('ws://localhost:8080');

    //     ws.onopen = () => {
    //         setStatus('Đã kết nối');
    //         Notification('Thông báo', 'Kết nối WebSocket thành công', 'success');
    //     };

    //     ws.onmessage = (event) => {
    //         const data = JSON.parse(event.data);
    //         setWeight(data.weight);
    //     };

    //     ws.onclose = () => {
    //         setStatus('Ngắt kết nối');
    //         Notification('Thông báo', 'Kết nối WebSocket đã bị ngắt', 'warning');
    //     };

    //     ws.onerror = (error) => {
    //         Notification('Thông báo', 'Lỗi kết nối WebSocket', 'error');
    //         setStatus('Lỗi');
    //     };

    //     // Dọn dẹp kết nối khi component unmount
    //     return () => {
    //         ws.close();
    //     };
    // }, []);

    // Tính tổng số lượng và tổng tiền
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPriceBeforeDiscount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.totalamount, 0);
    const promotionDefault = (item) => {
        if (item.quantity >= item.salequantity && !item.inputpromotion && item.applydatefrom != null && item.applydateto != null) {
            // Ngày hiện tại ở Việt Nam (30/05/2025)
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Chuẩn hóa để bỏ qua giờ

            // Giả sử ngày bắt đầu và ngày kết thúc
            const startDate = new Date(item.applydatefrom); // Ví dụ: 01/05/2025
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(item.applydateto);   // Ví dụ: 15/06/2025
            endDate.setHours(0, 0, 0, 0);

            // So sánh
            if (currentDate >= startDate && currentDate <= endDate) {
                return parseFloat(item.promotionquantity) * Math.floor(parseFloat(item.quantity) / (item.salequantity)) * parseFloat(item.price); // Tính theo số lượng khuyến mãi
            }
        }
        return 0;
    }

    // Hàm loadData chung cho cả quét barcode và submit form
    const loadData = async (postData) => {
        setLoading(true);
        const response = await dispatch(_fetchData(HOSTNAME, 'api/product/load', postData));
        if (!response.iserror) {
            if (!response.resultObject) {
                Notification('Thông báo', 'Không tìm thấy sản phẩm!', 'error');
                setLoading(false);
                return;
            }
            setCart((prev) => {
                let promotionValue = 0;
                const index = prev.findIndex((item) => item.productid === response.resultObject.productid);
                if (index !== -1) {
                    const updatedCart = [...prev];
                    let itemUpdate = {
                        ...response.resultObject,
                        quantity: updatedCart[index].quantity + 1,
                        inputpromotion: updatedCart[index].inputpromotion,
                    };

                    itemUpdate.promotion = promotionDefault(itemUpdate);
                    itemUpdate.totalamount = discountValue(itemUpdate);
                    updatedCart[index] = itemUpdate;
                    return updatedCart;
                }

                let itemUpdate = { ...response.resultObject, quantity: 1, promotion: promotionValue, inputpromotion: false };
                itemUpdate.totalamount = discountValue(itemUpdate);
                itemUpdate.promotion = promotionDefault(itemUpdate);
                return [...prev, itemUpdate];
            });
        } else {
            Notification('Thông báo', response.message, 'error');
        }
        setLoading(false);
    };

    // Xử lý quét barcode
    useEffect(() => {
        let buffer = '';
        let lastKeyTime = Date.now();

        const handleKeyDown = (event) => {
            if (loading) return; // Ngăn quét mới khi đang xử lý

            const currentTime = Date.now();
            if (currentTime - lastKeyTime > 50) {
                buffer = '';
            }
            lastKeyTime = currentTime;

            if (event.key?.length === 1) {
                buffer += event.key;
            }

            if (event.key === 'Enter' && buffer) {
                setBarcode(buffer);
                buffer = '';
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [loading]);

    // Gọi API khi barcode thay đổi
    useEffect(() => {
        if (barcode) {
            loadData({ barcode });
            setBarcode(''); // Reset barcode sau khi gọi API
        }
    }, [barcode]);

    const isValidValue = (input) => {
        if (typeof input !== 'string') return false;

        // Kiểm tra nếu kết thúc bằng %
        if (input.endsWith('%')) {
            // Loại bỏ % và kiểm tra phần còn lại là số
            const numberPart = input.slice(0, -1);
            return /^\d*\.?\d*$/.test(numberPart) && numberPart !== '' && !isNaN(Number(numberPart));
        }

        // Kiểm tra nếu là số (số nguyên hoặc thập phân)
        return /^\d*\.?\d*$/.test(input) && input !== '' && !isNaN(Number(input));
    };

    const getNumberFromPercent = (input) => {
        if (typeof input !== 'string' || !input.endsWith('%')) return null;
        const numberPart = input.slice(0, -1); // Loại bỏ %
        return /^\d*\.?\d*$/.test(numberPart) ? Number(numberPart) : null;
    };

    const discountValue = (record) => {
        let totalamount = record.price * record.quantity;
        if (typeof record.promotion === 'string' && record.promotion.endsWith('%')) {
            const percent = getNumberFromPercent(record.promotion);
            if (percent !== null) {
                totalamount = totalamount - (percent / 100) * totalamount; // Giảm theo phần trăm
            }
        } else if (!isNaN(Number(record.promotion))) {
            totalamount = totalamount - Number(record.promotion); // Giảm theo số tiền cố định
        }
        return totalamount;
    }

    const handleApplyDiscount = (productid, value) => {
        console.log(productid, value)
        if (isValidValue(value) || !value) {
            if (!!productid) {
                const data = cart.map((item, index) => {
                    if (item.productid === productid) {
                        item.inputpromotion = true; // Đánh dấu đã nhập giảm giá
                        item.promotion = value;
                        item.totalamount = discountValue(item);
                    }
                    return item;
                })
                setCart(data);
                return
            }
            const data = cart.map((item, index) => {
                item.promotion = value;
                item.totalamount = discountValue(item);
                return item;
            })
            setCart(data);
            Notification('Thông báo', `Áp dụng mã ${discountCode} thành công!`, 'success');
            return
        }
        Notification('Thông báo', 'Giá trị giảm giá không hợp lệ', 'error');
    }

    // Cập nhật số lượng sản phẩm
    const handleQuantityChange = (productid, value) => {
        if (value < 1) {
            Notification('Thông báo', 'Số lượng phải lớn hơn 0', 'error');
            return;
        }
        if (!!productid) {
            const data = cart.map((item, index) => {
                if (item.productid === productid) {
                    item.quantity = value;
                    item.promotion = promotionDefault(item);
                    item.totalamount = discountValue(item);
                }
                return item;
            })
            setCart(data);
            return
        }
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const handleRemoveItem = (productid) => {
        setCart(cart.filter((item) => item.productid !== productid));
        Notification('Thông báo', 'Đã xóa sản phẩm khỏi giỏ hàng', 'success');
    };

    // Gửi yêu cầu in hóa đơn
    const handleCheckout = async () => {
        setLoading(true);
        const postData = cart.map((item, index) => {
            return {
                createduser: user?.username,
                productid: item.productid,
                productname: item.productname,
                quantityunitid: item.quantityunitid,
                quantityunitname: item.quantityunitname,
                barcode: item.barcode,
                price: item.price,
                quantity: item.quantity,
                totalamount: item.totalamount,
                paymentmethod: paymentMethod,
                promotion: (item.price * item.quantity) - item.totalamount,
                discounttype: !getNumberFromPercent(item.promotion) ? '1' : '2', //1: tiền ; 2: phần trắm
            }
        })
        console.log('postData', postData)
        // Thêm logic thanh toán nếu cần

        const response = await dispatch(_fetchData(HOSTNAME, 'api/outputvoucher/add', postData));
        Notification('Thông báo', response.message, response.iserror ? 'error' : 'success');
        setLoading(false);
        if (!response.iserror) {
            setCart([]);
            setDiscountCode('');
            setPaymentMethod('1');
            return
        }
    };

    // Thêm sản phẩm qua modal
    const handleAddToCart = () => {
        const config = {
            icon: null,
            closable: false,
            className: 'modal-ant-custom',
            width: 300,
            footer: null,
            content: (
                <FormContainer
                    layout="vertical"
                    listColumn={addProductColunms}
                    onCloseModal={onCloseModal}
                    onSubmit={(values) => loadData(values)} // Sử dụng loadData cho submit
                />
            ),
        };
        objjd = modal.confirm(config);
    };

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16} xl={18} xxl={20}>
                    <Card
                        title="Danh sách sản phẩm (click vào vùng trống khi quét mã)"
                        style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    >
                        <Row type="flex" justify="end" align="middle" style={{ marginBottom: 5 }}>
                            {/* <Tooltip title="Nhạp mã barcode">
                                <Button size="medium" htmlType="button" icon={<PlusOutlined />} onClick={handleAddToCart}>
                                    Nhập mã barcode
                                </Button>
                            </Tooltip> */}
                            <Form
                                name='input-barcode'
                                layout="inline"
                                style={{ marginRight: 10 }}
                                onFinish={(values) => { setBarcode(values.barcode) }}
                            >
                                <Form.Item name="barcode" style={{ marginBottom: 5 }}>
                                    <Input
                                        placeholder="Nhập mã barcode"
                                        value={barcode}
                                    />
                                </Form.Item>
                                <Form.Item style={{ marginBottom: 5 }}>
                                    <Button type="primary" htmlType="submit">Thêm</Button>
                                </Form.Item>
                            </Form>
                        </Row>
                        <Table
                            size="small"
                            columns={columns(handleQuantityChange, handleRemoveItem, handleApplyDiscount)}
                            dataSource={cart}
                            rowKey="_id"
                            pagination={false}
                            bordered
                            scroll={{ x: true }}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={10} xl={6} xxl={4}>
                    <Card
                        title="Thông Tin Thanh Toán"
                        style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    >
                        <Form layout="vertical">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={24}>
                                    <Form.Item label="Nhập giảm giá" style={{ margin: 0 }}>
                                        <Row gutter={[8, 0]} style={{ width: '100%' }}>
                                            <Col xs={14} sm={14}>
                                                <Input
                                                    value={discountCode}
                                                    onChange={(e) => setDiscountCode(e.target.value)}
                                                    placeholder="Số tiền hoặc phần trăm"
                                                    style={{ width: '100%' }}
                                                />
                                            </Col>
                                            <Col xs={10} sm={10}>
                                                <Button type="primary" onClick={() => handleApplyDiscount(null, discountCode)} block style={{ width: '100%' }}>
                                                    Áp dụng
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24}>
                                    <Form.Item label="Hình Thức Thanh Toán" required>
                                        <Select
                                            value={paymentMethod}
                                            onChange={(value) => setPaymentMethod(value)}
                                            style={{ width: '100%' }}
                                        >
                                            <Option value="1">Tiền mặt</Option>
                                            <Option value="2">Chuyển khoản</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div style={{ marginTop: '24px' }}>
                                <Text strong>Tổng {`(${totalQuantity} sản phẩm)`}: </Text>
                                <Text>{totalPriceBeforeDiscount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                                <br />
                                <Text strong>Giảm: </Text>
                                <Text type="success">{(totalPriceBeforeDiscount - totalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                                <br />
                                <Text strong>KH phải trả: </Text>
                                <Text type="danger" style={{ fontSize: '18px' }}>
                                    {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </Text>
                            </div>
                            <Row gutter={[8, 8]} style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
                                <Col xs={24} sm={12}>
                                    <Button
                                        type="primary"
                                        size="medium"
                                        onClick={handleCheckout}
                                        block
                                        style={{ width: '100%', borderRadius: '4px' }}
                                        disabled={loading || !cart || cart.length == 0}
                                    >
                                        Thanh Toán
                                    </Button>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Button
                                        size="medium"
                                        onClick={() => {
                                            setCart([]);
                                            setDiscountCode('');
                                            setPaymentMethod('1');
                                            Notification('Thông báo', 'Đã hủy thanh toán', 'info');
                                        }}
                                        block
                                        style={{ width: '100%', borderRadius: '4px' }}
                                        disabled={loading || !cart || cart.length == 0}
                                    >
                                        Hủy
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </Row>
            {contextHolder}
        </>
    );
};

export default Search;