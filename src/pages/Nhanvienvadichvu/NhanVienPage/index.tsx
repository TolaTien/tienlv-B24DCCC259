import React, { useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Space, Card, Modal, Form, Input, InputNumber, Select, Popconfirm, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { NhanVien } from '@/models/nhanVienModel';

const { Option } = Select;

const NhanVienPage: React.FC = () => {
  const { nhanVienList, loading, addNhanVien, updateNhanVien, deleteNhanVien } = useModel('nhanVienModel');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const showAddModal = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record: NhanVien) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleFinish = (values: any) => {
    if (editingId) {
      updateNhanVien(editingId, values);
      message.success('Cập nhật thông tin nhân viên thành công!');
    } else {
      const newNhanVien = { ...values, id: `NV${Date.now().toString().slice(-4)}` };
      addNhanVien(newNhanVien);
      message.success('Thêm nhân viên thành công!');
    }
    setIsModalVisible(false);
  };

  const columns: ColumnsType<NhanVien> = [
    { title: 'Mã NV', dataIndex: 'id', key: 'id' },
    { title: 'Họ Tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Lịch Làm Việc', dataIndex: 'lichLamViec', key: 'lichLamViec' },
    { 
      title: 'Giới hạn (Khách/Ngày)', 
      dataIndex: 'gioiHanKhach', 
      key: 'gioiHanKhach',
      align: 'center'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status) => (
        <Tag color={status === 'Hoạt động' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showEditModal(record)}>Sửa</a>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => {
              deleteNhanVien(record.id);
              message.success('Đã xóa nhân viên');
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
      title="Danh sách Nhân viên" 
      extra={<Button type="primary" onClick={showAddModal}>+ Thêm Nhân Viên</Button>}
    >
      <Table 
        columns={columns} 
        dataSource={nhanVienList} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingId ? "Sửa Nhân Viên" : "Thêm Nhân Viên Mới"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ trangThai: 'Hoạt động' }}>
          <Form.Item 
            name="hoTen" 
            label="Họ và Tên" 
            rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
          >
            <Input placeholder="VD: Nguyễn Văn A" />
          </Form.Item>
          
          <Form.Item 
            name="lichLamViec" 
            label="Khung giờ làm việc" 
            rules={[{ required: true, message: 'Vui lòng nhập lịch làm việc!' }]}
          >
            <Input placeholder="VD: 09:00 - 18:00 (T2-T6)" />
          </Form.Item>

          <Form.Item 
            name="gioiHanKhach" 
            label="Giới hạn số khách (Người/Ngày)" 
            rules={[{ required: true, message: 'Vui lòng nhập giới hạn khách!' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>

          <Form.Item 
            name="trangThai" 
            label="Trạng thái" 
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Hoạt động">Hoạt động</Option>
              <Option value="Nghỉ phép">Nghỉ phép</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default NhanVienPage;