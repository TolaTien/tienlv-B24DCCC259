import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Switch, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { IFormField } from '@/models/vanbang/cauHinhBieuMauModel';

const CauHinhBieuMau: React.FC = () => {
  const { danhSachTruong, setDanhSachTruong } = useModel('vanbang.cauHinhBieuMauModel');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleOpenModal = (record?: IFormField) => {
    setIsModalVisible(true);
    setTimeout(() => {
      if (record) {
        setEditingId(record._id);
        form.setFieldsValue(record);
      } else {
        setEditingId(null);
        form.resetFields();
        form.setFieldsValue({ batBuoc: false, kieuDuLieu: 'String' });
      }
    }, 0);
  };

  const handleDelete = (id: string) => {
    setDanhSachTruong?.((danhSachTruong || []).filter(item => item._id !== id));
    message.success('Xóa thành công');
  };

  const handleFinish = (values: any) => {
    if (editingId) {
      setDanhSachTruong?.((danhSachTruong || []).map(item => item._id === editingId ? { ...item, ...values } : item));
      message.success('Cập nhật thành công');
    } else {
      const newField = { ...values, _id: Date.now().toString() };
      setDanhSachTruong?.([...(danhSachTruong || []), newField]);
      message.success('Thêm mới thành công');
    }
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'Mã trường', dataIndex: 'maTruong', key: 'maTruong' },
    { title: 'Tên trường', dataIndex: 'tenTruong', key: 'tenTruong' },
    { title: 'Kiểu dữ liệu', dataIndex: 'kieuDuLieu', key: 'kieuDuLieu' },
    { 
      title: 'Bắt buộc', 
      dataIndex: 'batBuoc', 
      key: 'batBuoc',
      render: (val: boolean) => val ? 'Có' : 'Không'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: IFormField) => (
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
      title="Cấu hình biểu mẫu phụ lục văn bằng" 
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm mới</Button>}
    >
      <Table columns={columns} dataSource={danhSachTruong || []} rowKey="_id" bordered />

      <Modal
        title={editingId ? 'Sửa trường dữ liệu' : 'Thêm trường dữ liệu'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="maTruong" label="Mã trường (viết liền không dấu)" rules={[{ required: true, message: 'Vui lòng nhập mã trường' }]}>
            <Input placeholder="VD: dan_toc" />
          </Form.Item>
          <Form.Item name="tenTruong" label="Tên trường (hiển thị)" rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}>
            <Input placeholder="VD: Dân tộc" />
          </Form.Item>
          <Form.Item name="kieuDuLieu" label="Kiểu dữ liệu" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="String">Văn bản (String)</Select.Option>
              <Select.Option value="Number">Số (Number)</Select.Option>
              <Select.Option value="Date">Ngày tháng (Date)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="batBuoc" label="Bắt buộc nhập" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CauHinhBieuMau;