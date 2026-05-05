import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Select, Tag, Popconfirm, message, Modal, Form, DatePicker, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { queryPosts, addPost, updatePost, removePost, queryTags } from '@/services/BlogService';
import { Post, Tag as TagType } from '@/types/blog';
import moment from 'moment';

const { Option } = Select;

const PostAdmin: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form] = Form.useForm();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await queryPosts({
        current,
        pageSize,
        title: searchText,
        status: statusFilter,
      });
      if (res.success) {
        setPosts(res.data);
        setTotal(res.total);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    const res = await queryTags();
    if (res.success) {
      setTags(res.data);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [current, pageSize, searchText, statusFilter]);

  useEffect(() => {
    fetchTags();
  }, []);

  const handleAdd = () => {
    setEditingPost(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Post) => {
    setEditingPost(record);
    form.setFieldsValue({
      ...record,
      publishedAt: moment(record.publishedAt),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    const res = await removePost(id);
    if (res.success) {
      message.success('Đã xóa bài viết');
      fetchPosts();
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        publishedAt: values.publishedAt.format('YYYY-MM-DD'),
      };

      if (editingPost) {
        await updatePost(editingPost.id, data);
        message.success('Đã cập nhật bài viết');
      } else {
        await addPost(data);
        message.success('Đã thêm bài viết mới');
      }
      setModalVisible(false);
      fetchPosts();
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'gold'}>
          {status === 'published' ? 'Đã đăng' : 'Nháp'}
        </Tag>
      ),
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags?.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      sorter: (a: Post, b: Post) => a.views - b.views,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      render: (date: string) => (date ? moment(date).format('DD/MM/YYYY') : '-'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Post) => (
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
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input
            placeholder="Tìm theo tiêu đề"
            prefix={<SearchOutlined />}
            onPressEnter={(e) => setSearchText((e.target as HTMLInputElement).value)}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Trạng thái"
            style={{ width: 150 }}
            allowClear
            onChange={(value) => setStatusFilter(value)}
          >
            <Option value="published">Đã đăng</Option>
            <Option value="draft">Nháp</Option>
          </Select>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm bài viết
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        loading={loading}
        pagination={{
          current,
          pageSize,
          total,
          onChange: (page, size) => {
            setCurrent(page);
            setPageSize(size);
          },
        }}
      />

      <Modal
        title={editingPost ? 'Sửa bài viết' : 'Thêm bài viết mới'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="summary" label="Tóm tắt" rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="content" label="Nội dung (Markdown)" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
            <Input.TextArea rows={10} />
          </Form.Item>
          <Form.Item name="thumbnail" label="Ảnh đại diện (URL)" rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="tags" label="Thẻ" rules={[{ required: true, message: 'Vui lòng chọn thẻ' }]}>
                <Select mode="multiple">
                  {tags.map(tag => (
                    <Option key={tag.name} value={tag.name}>{tag.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                <Select>
                  <Option value="published">Đã đăng</Option>
                  <Option value="draft">Nháp</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="publishedAt" label="Ngày đăng" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="author" label="Tác giả" initialValue="Admin" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PostAdmin;
