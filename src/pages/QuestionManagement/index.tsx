import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Select, Space, Modal, Tag, Row, Col, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Question, Difficulty, DifficultyLabels } from '../../models/Question';

const { Option } = Select;
const { TextArea } = Input;

// Mock data ban đầu
const mockSubjects = [{ id: 'S01', name: 'Lập trình Web' }, { id: 'S02', name: 'Cơ sở dữ liệu' }];
const mockKnowledgeBlocks = [{ id: 'KB01', name: 'Tổng quan' }, { id: 'KB02', name: 'Chuyên sâu' }];
const mockQuestions: Question[] = [
  { id: 'Q001', subjectId: 'S01', knowledgeBlockId: 'KB01', content: 'Trình bày vòng đời của một React Component?', difficulty: 'MEDIUM' },
];

const QuestionManagementPage: React.FC = () => {
  // 1. Khởi tạo mảng gốc: Lấy từ localStorage ra, nếu trống thì dùng mockQuestions
  const [questions, setQuestions] = useState<Question[]>(() => {
    const savedData = localStorage.getItem('questions_data');
    return savedData ? JSON.parse(savedData) : mockQuestions;
  });

  // 2. Khởi tạo mảng hiển thị (dành riêng cho việc filter)
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(questions);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 3. Lắng nghe mỗi khi mảng 'questions' thay đổi -> Lưu vào localStorage ngay lập tức
  useEffect(() => {
    localStorage.setItem('questions_data', JSON.stringify(questions));
    setFilteredQuestions(questions); // Reset lại mảng hiển thị cho khớp với mảng gốc
  }, [questions]);

  // Xử lý mở modal thêm mới
  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  // Xử lý lưu form (Thêm hoặc Sửa)
  const handleSave = (values: any) => {
    const existingIndex = questions.findIndex(q => q.id === values.id);

    if (existingIndex > -1) {
      // SỬA
      const updatedQuestions = [...questions];
      updatedQuestions[existingIndex] = { ...updatedQuestions[existingIndex], ...values };
      setQuestions(updatedQuestions);
    } else {
      // THÊM MỚI
      setQuestions([...questions, values]);
    }
    setIsModalVisible(false);
    message.success('Đã lưu thông tin câu hỏi!');
  };

  // Xử lý tìm kiếm/lọc
  const onFinishFilter = (values: any) => {
    // Lọc dữ liệu trên mảng gốc 'questions' (chứa dữ liệu thật) thay vì mảng mock
    const filteredData = questions.filter((item) => {
      if (values.subjectId && item.subjectId !== values.subjectId) return false;
      if (values.knowledgeBlockId && item.knowledgeBlockId !== values.knowledgeBlockId) return false;
      if (values.difficulty && item.difficulty !== values.difficulty) return false;
      return true; 
    });

    // CHỈ cập nhật mảng hiển thị, giữ nguyên mảng gốc
    setFilteredQuestions(filteredData);
  };

  // Xử lý Xóa câu hỏi
  const handleDelete = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    message.success('Đã xóa câu hỏi thành công!');
  };

  // Cấu hình các cột cho Bảng
  const columns: ColumnsType<Question> = [
    { title: 'Mã câu hỏi', dataIndex: 'id', key: 'id', width: '10%' },
    { title: 'Nội dung', dataIndex: 'content', key: 'content', width: '40%' },
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      key: 'subjectId',
      render: (id) => mockSubjects.find(s => s.id === id)?.name || id
    },
    {
      title: 'Khối kiến thức',
      dataIndex: 'knowledgeBlockId',
      key: 'knowledgeBlockId',
      render: (id) => mockKnowledgeBlocks.find(k => k.id === id)?.name || id
    },
    {
      title: 'Mức độ',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (level: Difficulty) => {
        const colors = { EASY: 'green', MEDIUM: 'blue', HARD: 'orange', VERY_HARD: 'red' };
        return <Tag color={colors[level]}>{DifficultyLabels[level]}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => { form.setFieldsValue(record); setIsModalVisible(true); }}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa câu hỏi này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
      <h2>Quản lý câu hỏi tự luận</h2>

      {/* Bộ lọc tìm kiếm */}
      <Form layout="inline" onFinish={onFinishFilter} style={{ marginBottom: 20 }}>
        <Form.Item name="subjectId" label="Môn học">
          <Select placeholder="Chọn môn học" allowClear style={{ width: 150 }}>
            {mockSubjects.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="knowledgeBlockId" label="Khối kiến thức">
          <Select placeholder="Chọn khối" allowClear style={{ width: 150 }}>
            {mockKnowledgeBlocks.map(k => <Option key={k.id} value={k.id}>{k.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="difficulty" label="Mức độ khó">
          <Select placeholder="Chọn mức độ" allowClear style={{ width: 150 }}>
            {Object.entries(DifficultyLabels).map(([key, label]) => (
              <Option key={key} value={key}>{label}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Tìm kiếm</Button>
        </Form.Item>
      </Form>

      {/* Nút Thêm mới */}
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" onClick={handleAdd}>+ Thêm câu hỏi</Button>
      </div>

      {/* Bảng dữ liệu - CHÚ Ý: dataSource bây giờ là filteredQuestions */}
      <Table columns={columns} dataSource={filteredQuestions} rowKey="id" bordered />

      {/* Modal Thêm/Sửa */}
      <Modal
        title="Thông tin câu hỏi"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="id" label="Mã câu hỏi" rules={[{ required: true }]}>
                <Input placeholder="Nhập mã câu hỏi" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="difficulty" label="Mức độ khó" rules={[{ required: true }]}>
                <Select placeholder="Chọn mức độ">
                  {Object.entries(DifficultyLabels).map(([key, label]) => (
                    <Option key={key} value={key}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="subjectId" label="Môn học" rules={[{ required: true }]}>
                <Select placeholder="Chọn môn học">
                  {mockSubjects.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="knowledgeBlockId" label="Khối kiến thức" rules={[{ required: true }]}>
                <Select placeholder="Chọn khối kiến thức">
                  {mockKnowledgeBlocks.map(k => <Option key={k.id} value={k.id}>{k.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="content" label="Nội dung câu hỏi" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Nhập nội dung câu hỏi tự luận..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuestionManagementPage;