import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Space, Modal, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { KnowledgeBlock } from '../../models/Question';

const KnowledgeBlockPage: React.FC = () => {
  const [blocks, setBlocks] = useState<KnowledgeBlock[]>(() => {
    const saved = localStorage.getItem('knowledge_blocks_data');
    return saved ? JSON.parse(saved) : [{ id: 'KB01', name: 'Tổng quan' }, { id: 'KB02', name: 'Chuyên sâu' }];
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem('knowledge_blocks_data', JSON.stringify(blocks));
  }, [blocks]);

  const handleSave = (values: any) => {
    const index = blocks.findIndex(b => b.id === values.id);
    if (index > -1) {
      const updated = [...blocks];
      updated[index] = values;
      setBlocks(updated);
    } else {
      setBlocks([...blocks, values]);
    }
    setIsModalVisible(false);
    message.success('Đã lưu khối kiến thức!');
  };

  const handleDelete = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    message.success('Đã xóa khối kiến thức!');
  };

  const columns: ColumnsType<KnowledgeBlock> = [
    { title: 'Mã khối', dataIndex: 'id', key: 'id' },
    { title: 'Tên khối kiến thức', dataIndex: 'name', key: 'name' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => { form.setFieldsValue(record); setIsModalVisible(true); }}>Sửa</Button>
          <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Quản lý Khối kiến thức</h2>
        <Button type="primary" onClick={() => { form.resetFields(); setIsModalVisible(true); }}>+ Thêm mới</Button>
      </div>
      <Table columns={columns} dataSource={blocks} rowKey="id" bordered />
      <Modal title="Thông tin khối kiến thức" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="id" label="Mã khối" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="name" label="Tên khối" rules={[{ required: true }]}><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default KnowledgeBlockPage;