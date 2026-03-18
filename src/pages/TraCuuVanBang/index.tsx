import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Card, message, Descriptions } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import MyDatePicker from '@/components/MyDatePicker';

const TraCuuVanBang: React.FC = () => {
  const [form] = Form.useForm();
  const [ketQua, setKetQua] = useState<any>(null);

  const handleSearch = (values: any) => {
    // Đếm số lượng trường đã được nhập dữ liệu hợp lệ
    const filledParams = Object.values(values).filter(
      (val) => val !== undefined && val !== null && val !== ''
    );

    if (filledParams.length < 2) {
      message.warning('Vui lòng nhập ít nhất 2 tham số để tra cứu thông tin!');
      return;
    }

    // Call API tìm kiếm và ghi nhận lượt tra cứu theo Quyết định (Backend xử lý count)
    console.log('Tham số tìm kiếm:', values);
    
    // Giả lập kết quả trả về
    setKetQua({
      hoTen: 'Nguyễn Văn A',
      maSinhVien: 'B20DCCN001',
      soHieuVanBang: 'VN123456',
      soVaoSo: 105,
      quyetDinh: 'QĐ 123/2024',
      duLieuDong: {
        dan_toc: 'Kinh',
        diem_tb: 3.8
      }
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Card title="Tra cứu văn bằng tốt nghiệp" bordered={false} className="shadow-sm">
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="soHieuVanBang" label="Số hiệu văn bằng">
                <Input placeholder="Nhập số hiệu" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="soVaoSo" label="Số vào sổ">
                <Input placeholder="Nhập số vào sổ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="maSinhVien" label="Mã sinh viên (MSV)">
                <Input placeholder="Nhập MSV" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hoTen" label="Họ và tên">
                <Input placeholder="Nhập họ tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ngaySinh" label="Ngày sinh">
                <MyDatePicker placeholder="Chọn ngày sinh" format="DD/MM/YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />} size="large">
              Tra cứu
            </Button>
          </div>
        </Form>
      </Card>

      {ketQua && (
        <Card title="Thông tin chi tiết" style={{ marginTop: 24 }} bordered={false}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Họ tên">{ketQua.hoTen}</Descriptions.Item>
            <Descriptions.Item label="Mã sinh viên">{ketQua.maSinhVien}</Descriptions.Item>
            <Descriptions.Item label="Số hiệu văn bằng">{ketQua.soHieuVanBang}</Descriptions.Item>
            <Descriptions.Item label="Số vào sổ">{ketQua.soVaoSo}</Descriptions.Item>
            <Descriptions.Item label="Quyết định TN">{ketQua.quyetDinh}</Descriptions.Item>
            
            {/* Render các trường mở rộng từ duLieuDong */}
            {Object.entries(ketQua.duLieuDong).map(([key, value]) => (
              <Descriptions.Item key={key} label={key.replace('_', ' ').toUpperCase()}>
                {String(value)}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      )}
    </div>
  );
};

export default TraCuuVanBang;