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

const { Option } = Select;
const { Text } = Typography;

const Search = () => {
    const [modal, contextHolder] = Modal.useModal();
    let objjd = null;
    const onCloseModal = () => {
        objjd.destroy();
    };

    const dispatch = useDispatch();
    const [cart, setCart] = useState([]);
    const [discountCode, setDiscountCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');
    const [barcode, setBarcode] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(setBreadcrumb(PagePath));
    }, []);

    // Tính tổng số lượng và tổng tiền
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPriceBeforeDiscount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalPrice = totalPriceBeforeDiscount - discountAmount;

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
                const index = prev.findIndex((item) => item.productid === response.resultObject.productid);
                if (index !== -1) {
                    const updatedCart = [...prev];
                    updatedCart[index] = {
                        ...updatedCart[index],
                        quantity: updatedCart[index].quantity + 1,
                    };
                    return updatedCart;
                }
                return [...prev, { ...response.resultObject, quantity: 1, discount: 0 }];
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

    const handleChangeDiscount = (productid, value) => {
        if (isValidValue(value) || !value) {
            const data = cart.map((item, index) => {
                if (item.productid === productid) {
                    item.discount = value;
                    if (value.endsWith('%')) {
                        item.total = ((item.price * item.quantity) * parseInt(value.split('%')[0])) / 100
                    }
                    else {
                        item.total = (item.price * item.quantity) - parseInt(value)
                    }
                }
                return item;
            })
            setCart(data);
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
        setCart(cart.map((item) => (item.productid === productid ? { ...item, quantity: value } : item)));
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const handleRemoveItem = (productid) => {
        setCart(cart.filter((item) => item.productid !== productid));
        Notification('Thông báo', 'Đã xóa sản phẩm khỏi giỏ hàng', 'success');
    };

    // Áp dụng mã giảm giá
    const handleApplyDiscount = () => {
        if (!discountCode) {
            Notification('Thông báo', 'Vui lòng nhập mã giảm giá', 'error');
            return;
        }
        if (discountCode === 'DISCOUNT10') {
            const discount = totalPriceBeforeDiscount * 0.1;
            setDiscountAmount(discount);
            Notification('Thông báo', `Áp dụng mã ${discountCode} thành công! Giảm ${discount.toLocaleString()} VNĐ`, 'success');
        } else {
            setDiscountAmount(0);
            Notification('Thông báo', 'Mã giảm giá không hợp lệ', 'error');
        }
    };

    // Gửi yêu cầu in hóa đơn
    const handleCheckout = async () => {
        // Thêm logic thanh toán nếu cần
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
                <Col xs={24} lg={14} xl={16} xxl={18}>
                    <Card
                        title="Danh sách sản phẩm"
                        style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    >
                        <Row type="flex" justify="end" align="middle" style={{ marginBottom: 5 }}>
                            <Tooltip title="Nhạp mã barcode">
                                <Button size="small" htmlType="button" icon={<PlusOutlined />} onClick={handleAddToCart}>
                                    Nhập mã barcode
                                </Button>
                            </Tooltip>
                        </Row>
                        <Table
                            size="small"
                            columns={columns(handleQuantityChange, handleRemoveItem, handleChangeDiscount)}
                            dataSource={cart}
                            rowKey="_id"
                            pagination={false}
                            bordered
                            scroll={{ x: true }}
                            loading={loading}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={10} xl={8} xxl={6}>
                    <Card
                        title="Thông Tin Thanh Toán"
                        style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    >
                        <Form layout="vertical">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={24}>
                                    <Form.Item label="Mã Giảm Giá" style={{ margin: 0 }}>
                                        <Row gutter={[8, 0]} style={{ width: '100%' }}>
                                            <Col xs={16} sm={18}>
                                                <Input
                                                    value={discountCode}
                                                    onChange={(e) => setDiscountCode(e.target.value)}
                                                    placeholder="Nhập mã giảm giá"
                                                    style={{ width: '100%' }}
                                                />
                                            </Col>
                                            <Col xs={8} sm={6}>
                                                <Button type="primary" onClick={handleApplyDiscount} block style={{ width: '100%' }}>
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
                                <Text strong>Tổng tiền hàng {`(${totalQuantity} sản phẩm)`}: </Text>
                                <Text>{totalPriceBeforeDiscount.toLocaleString()} VNĐ</Text>
                                <br />
                                <Text strong>Giảm Giá: </Text>
                                <Text type="success">{discountAmount.toLocaleString()} VNĐ</Text>
                                <br />
                                <Text strong>Khách phải trả: </Text>
                                <Text type="danger" style={{ fontSize: '18px' }}>
                                    {totalPrice.toLocaleString()} VNĐ
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
                                        disabled={loading}
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
                                            setDiscountAmount(0);
                                            setPaymentMethod('Tiền mặt');
                                            Notification('Thông báo', 'Đã hủy thanh toán', 'info');
                                        }}
                                        block
                                        style={{ width: '100%', borderRadius: '4px' }}
                                        disabled={loading}
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