import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumb } from '../../../../components/Redux/Reducers';
import { PagePath, addProductColunms, columns } from '../constants';
import { _fetchData } from '../../../../utils/CallAPI';
import { HOSTNAME } from '../../../../utils/constants/systemVars';
import { Notification } from '../../../../utils/Notification';
import { Row, Col, Card, Table, Button, Input, Form, Typography, message, Select, Tooltip, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormContainer from '../../../../components/FormContainer';
const { Option } = Select;
const { Text } = Typography;

const Search = (props) => {
    const [modal, contextHolder] = Modal.useModal();
    let objjd = null;
    const onCloseModal = () => {
        objjd.destroy();
    }
    
    const dispatch = useDispatch();
    const [cart, setCart] = useState([]);
    const [discountCode, setDiscountCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');

    useEffect(() => {
        dispatch(setBreadcrumb(PagePath));
    }, []);

    // Tính tổng số lượng và tổng tiền
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPriceBeforeDiscount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalPrice = totalPriceBeforeDiscount - discountAmount;

    const loadData = async (postData) => {
        const response = await dispatch(_fetchData(HOSTNAME, 'api/product/load', postData));
        if (!response.iserror) {
            if (!response.resultObject) {
                Notification('Thông báo', 'Không tìm thấy sản phẩm!', 'error');
                return;
            }
            setCart(pre => {
                const index = pre.findIndex(item => item.productid === response.resultObject.productid);
                if (index !== -1) {
                    const updatedCart = [...pre];
                    updatedCart[index] = {
                        ...updatedCart[index],
                        quantity: updatedCart[index].quantity + 1
                    };
                    return updatedCart;
                }
                return [...pre, { ...response.resultObject, quantity: 1, price: 5000 }];
            });
            return;
        }
        Notification('Thông báo', response.message, 'error');
    }

    // Cập nhật số lượng sản phẩm
    const handleQuantityChange = (productid, value) => {
        if (value < 1) {
            Notification('Thông báo', 'Số lượng phải lớn hơn 0', 'error');
            return;
        }

        setCart(
            cart.map((item) =>
                item.productid === productid ? { ...item, quantity: value } : item
            )
        );
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
        // Giả định mã DISCOUNT10 giảm 10%
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
    const handleCheckout = async () => { };

    const handleAddToCart = () => {
        const config = {
            icon: null,
            closable: false,
            className: "modal-ant-custom",
            width: 300,
            footer: null,
            content: (
                <FormContainer
                    layout='vertical'
                    listColumn={addProductColunms}
                    onCloseModal={onCloseModal}
                    onSubmit={(values) => loadData(values)}
                />
            )
        };

        objjd = modal.confirm(config);
    }

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14} xl={16} xxl={18}>
                    <Card
                        title="Danh sách sản phẩm"
                        style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    >
                        <Row type='flex' justify={'end'} align='middle' style={{ marginBottom: 5, }}>
                            <Tooltip title="Thêm sản phẩm">
                                <Button
                                    size='small'
                                    htmlType='button'
                                    icon={<PlusOutlined />}
                                    onClick={handleAddToCart}
                                >
                                    Thêm
                                </Button>
                            </Tooltip>
                        </Row>
                        <Table
                            size="small"
                            columns={columns(handleQuantityChange, handleRemoveItem)}
                            dataSource={cart}
                            rowKey="_id"
                            pagination={false}
                            bordered
                            scroll={{ x: true }}
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
                                            <Option value="Tiền mặt">Tiền mặt</Option>
                                            <Option value="Thẻ tín dụng">Thẻ tín dụng</Option>
                                            <Option value="Chuyển khoản">Chuyển khoản</Option>
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
}
export default Search;