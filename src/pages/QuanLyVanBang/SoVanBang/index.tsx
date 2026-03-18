import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface ISoVanBang {
  _id: string;
  maSo: string;
  tenSo: string;
  ngayLap: string;
  ghiChu: string;
}

const SoVanBang: React.FC = () => {
  const [danhSachSo, setDanhSachSo] = useState<ISoVanBang[]>(() => {
    const savedData = localStorage.getItem('DATA_SO_VAN_BANG');
    return savedData ? JSON.parse(savedData) : [];
  });
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem('DATA_SO_VAN_BANG', JSON.stringify(danhSachSo));
  }, [danhSachSo]);

  const handleOpenModal = (record?: ISoVanBang) => {
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
    setDanhSachSo(danhSachSo.filter(item => item._id !== id));
    message.success('Xóa sổ văn bằng thành công');
  };

  const handleFinish = (values: any) => {
    if (editingId) {
      setDanhSachSo(danhSachSo.map(item => item._id === editingId ? { ...item, ...values } : item));
      message.success('Cập nhật sổ văn bằng thành công');
    } else {
      const newSo = { ...values, _id: Date.now().toString() };
      setDanhSachSo([...danhSachSo, newSo]);
      message.success('Thêm mới sổ văn bằng thành công');
    }
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'Mã sổ', dataIndex: 'maSo', key: 'maSo' },
    { title: 'Tên sổ', dataIndex: 'tenSo', key: 'tenSo' },
    { title: 'Ngày lập', dataIndex: 'ngayLap', key: 'ngayLap' },
    { title: 'Ghi chú', dataIndex: 'ghiChu', key: 'ghiChu' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: ISoVanBang) => (
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
      title="Quản lý Sổ văn bằng" 
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm mới</Button>}
    >
      <Table columns={columns} dataSource={danhSachSo} rowKey="_id" bordered />

      <Modal
        title={editingId ? 'Sửa sổ văn bằng' : 'Thêm mới sổ văn bằng'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="maSo" label="Mã sổ" rules={[{ required: true, message: 'Vui lòng nhập mã sổ' }]}>
            <Input placeholder="Nhập mã sổ" />
          </Form.Item>
          <Form.Item name="tenSo" label="Tên sổ" rules={[{ required: true, message: 'Vui lòng nhập tên sổ' }]}>
            <Input placeholder="Nhập tên sổ" />
          </Form.Item>
          <Form.Item name="ngayLap" label="Ngày lập (DD/MM/YYYY)" rules={[{ required: true, message: 'Vui lòng nhập ngày lập' }]}>
            <Input placeholder="VD: 15/08/2024" />
          </Form.Item>
          <Form.Item name="ghiChu" label="Ghi chú">
            <Input.TextArea placeholder="Nhập ghi chú" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default SoVanBang;