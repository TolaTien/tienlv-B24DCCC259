import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface IQuyetDinh {
  _id: string;
  soQuyetDinh: string;
  tenQuyetDinh: string;
  ngayKy: string;
  nguoiKy: string;
}

const QuyetDinh: React.FC = () => {
  const [danhSachQuyetDinh, setDanhSachQuyetDinh] = useState<IQuyetDinh[]>(() => {
    const savedData = localStorage.getItem('DATA_QUYET_DINH');
    return savedData ? JSON.parse(savedData) : [];
  });
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem('DATA_QUYET_DINH', JSON.stringify(danhSachQuyetDinh));
  }, [danhSachQuyetDinh]);

  const handleOpenModal = (record?: IQuyetDinh) => {
    setIsModalVisible(true);
    setTimeout(() => {
      if (record) {
        setEditingId(record._id);
        form.setFieldsValue(record);
      } else {
        setEditingId(null);
        form.resetFields();
      }
    }, 0);
  };

  const handleDelete = (id: string) => {
    setDanhSachQuyetDinh(danhSachQuyetDinh.filter(item => item._id !== id));
    message.success('Xóa quyết định thành công');
  };

  const handleFinish = (values: any) => {
    if (editingId) {
      setDanhSachQuyetDinh(danhSachQuyetDinh.map(item => item._id === editingId ? { ...item, ...values } : item));
      message.success('Cập nhật quyết định thành công');
    } else {
      const newQd = { ...values, _id: Date.now().toString() };
      setDanhSachQuyetDinh([...danhSachQuyetDinh, newQd]);
      message.success('Thêm mới quyết định thành công');
    }
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'Số quyết định', dataIndex: 'soQuyetDinh', key: 'soQuyetDinh' },
    { title: 'Tên quyết định', dataIndex: 'tenQuyetDinh', key: 'tenQuyetDinh' },
    { title: 'Ngày ký', dataIndex: 'ngayKy', key: 'ngayKy' },
    { title: 'Người ký', dataIndex: 'nguoiKy', key: 'nguoiKy' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: IQuyetDinh) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record._id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="Quản lý Quyết định tốt nghiệp" 
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm mới</Button>}
    >
      <Table columns={columns} dataSource={danhSachQuyetDinh} rowKey="_id" bordered />

      <Modal
        title={editingId ? 'Sửa quyết định' : 'Thêm mới quyết định'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="soQuyetDinh" label="Số quyết định" rules={[{ required: true, message: 'Vui lòng nhập số quyết định' }]}>
            <Input placeholder="VD: QĐ 123/2024" />
          </Form.Item>
          <Form.Item name="tenQuyetDinh" label="Tên quyết định" rules={[{ required: true, message: 'Vui lòng nhập tên quyết định' }]}>
            <Input placeholder="VD: Quyết định công nhận tốt nghiệp..." />
          </Form.Item>
          <Form.Item name="ngayKy" label="Ngày ký (DD/MM/YYYY)" rules={[{ required: true, message: 'Vui lòng nhập ngày ký' }]}>
            <Input placeholder="VD: 15/08/2024" />
          </Form.Item>
          <Form.Item name="nguoiKy" label="Người ký" rules={[{ required: true, message: 'Vui lòng nhập người ký' }]}>
            <Input placeholder="Nhập tên người ký" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default QuyetDinh;