import React, { useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Space, Card, Modal, Form, Input, InputNumber, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DichVu } from '@/models/dichVuModel';

const DichVuPage: React.FC = () => {
  const { dichVuList, loading, addDichVu, updateDichVu, deleteDichVu } = useModel('dichVuModel');
  
  // State quản lý Modal và Form
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Mở modal Thêm mới
  const showAddModal = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Mở modal Sửa
  const showEditModal = (record: DichVu) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Xử lý khi Submit Form
  const handleFinish = (values: any) => {
    if (editingId) {
      updateDichVu(editingId, values);
      message.success('Cập nhật dịch vụ thành công!');
    } else {
     
      const newDichVu = { ...values, id: `DV${Date.now().toString().slice(-4)}` };
      addDichVu(newDichVu);
      message.success('Thêm dịch vụ thành công!');
    }
    setIsModalVisible(false);
  };

  const columns: ColumnsType<DichVu> = [
    { title: 'Mã DV', dataIndex: 'id', key: 'id' },
    { title: 'Tên Dịch vụ', dataIndex: 'tenDichVu', key: 'tenDichVu' },
    { 
      title: 'Giá (VNĐ)', 
      dataIndex: 'gia', 
      key: 'gia',
      render: (gia) => gia.toLocaleString('vi-VN') + ' đ'
    },
    { 
      title: 'Thời gian', 
      dataIndex: 'thoiGian', 
      key: 'thoiGian',
      render: (phut) => `${phut} phút`
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showEditModal(record)}>Sửa</a>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa dịch vụ này?"
            onConfirm={() => {
              deleteDichVu(record.id);
              message.success('Đã xóa dịch vụ');
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <a style={{ color: 'red' }}>Xóa</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="Danh mục Dịch vụ" 
      extra={<Button type="primary" onClick={showAddModal}>+ Thêm Dịch Vụ</Button>}
    >
      <Table 
        columns={columns} 
        dataSource={dichVuList} 
        rowKey="id" 
        loading={loading} 
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingId ? "Sửa Dịch Vụ" : "Thêm Dịch Vụ Mới"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item 
            name="tenDichVu" 
            label="Tên Dịch Vụ" 
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
          >
            <Input placeholder="VD: Cắt tóc nam, Chăm sóc da..." />
          </Form.Item>
          
          <Form.Item 
            name="gia" 
            label="Giá Tiền (VNĐ)" 
            rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} step={10000} />
          </Form.Item>

          <Form.Item 
            name="thoiGian" 
            label="Thời gian thực hiện (Phút)" 
            rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
          >
            <InputNumber style={{ width: '100%' }} min={5} step={5} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default DichVuPage;