import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Popconfirm, message, Modal, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { queryTags, addTag, updateTag, removeTag } from '@/services/BlogService';
import { Tag as TagType } from '@/types/blog';

const TagAdmin: React.FC = () => {
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [form] = Form.useForm();

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await queryTags();
      if (res.success) {
        setTags(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleAdd = () => {
    setEditingTag(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: TagType) => {
    setEditingTag(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    const res = await removeTag(id);
    if (res.success) {
      message.success('Đã xóa thẻ');
      fetchTags();
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingTag) {
        await updateTag(editingTag.id, values);
        message.success('Đã cập nhật thẻ');
      } else {
        await addTag(values);
        message.success('Đã thêm thẻ mới');
      }
      setModalVisible(false);
      fetchTags();
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const columns = [
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số bài viết',
      dataIndex: 'count',
      key: 'count',
      render: (count?: number) => count ?? 0,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: TagType) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm thẻ mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ mới'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên thẻ"
            rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagAdmin;
