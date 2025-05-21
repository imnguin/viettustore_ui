import { Col, Row, Typography } from 'antd';
import React from 'react';
const OutputVoucherInfo = () => {
    return (
        <>
            <Row gutter={[16, 16]} style={{ marginBottom: 16, marginTop: 16 }}>
                <Col xs={24} md={12} lg={8} xl={6}>
                    <Typography.Text strong>Mã hóa đơn: </Typography.Text>
                    <Typography.Text>OV00012505211456</Typography.Text>
                </Col>
                <Col xs={24} md={12} lg={8} xl={6}>
                    <Typography.Text strong>Ngày tạo hóa đơn: </Typography.Text>
                    <Typography.Text>OV00012505211456</Typography.Text>
                </Col>
                <Col xs={24} md={12} lg={8} xl={6}>
                    <Typography.Text strong>Tiền thu của khách: </Typography.Text>
                    <Typography.Text>OV00012505211456</Typography.Text>
                </Col>
                <Col xs={24} md={12} lg={8} xl={6}>
                    <Typography.Text strong>Tiền giảm giá: </Typography.Text>
                    <Typography.Text>OV00012505211456</Typography.Text>
                </Col>
            </Row>
        </>
    );
};
export default OutputVoucherInfo;