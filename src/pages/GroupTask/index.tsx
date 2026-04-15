import React, { useState } from 'react';
import { useModel } from 'umi';
import { Card, Button, Input, Form, Typography, Space, Tabs, Tag, Popconfirm, message } from 'antd';
import { PlusOutlined, LogoutOutlined, UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import TaskForm from './components/TaskForm';
import TaskCalendar from './components/TaskCalendar';
import TaskStats from './components/TaskStats';
import type { Task } from '@/models/groupTask';

const { Title, Text } = Typography;

const GroupTaskPage: React.FC = () => {
  const { tasks, currentUser, login, logout, addTask, editTask, deleteTask } = useModel('groupTask');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const actionRef = React.useRef<ActionType>();

  if (!currentUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
        <Card title="Đăng nhập Quản lý Công việc" style={{ width: 400 }}>
          <Form
            onFinish={(values) => {
              login(values.username);
              message.success(`Chào mừng ${values.username}!`);
            }}
          >
            <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
              <Input prefix={<UserOutlined />} placeholder="Tên người dùng" size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Bắt đầu
            </Button>
          </Form>
        </Card>
      </div>
    );
  }

  const columns: ProColumns<Task>[] = [
    {
      title: 'Tên công việc',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      formItemProps: {
        rules: [{ required: true, message: 'Vui lòng nhập tên công việc' }],
      },
    },
    {
      title: 'Người được giao',
      dataIndex: 'assignee',
      valueType: 'select',
      valueEnum: Array.from(new Set(tasks.map(t => t.assignee))).reduce((acc, curr) => {
        acc[curr] = { text: curr };
        return acc;
      }, {} as any),
    },
    {
      title: 'Mức độ ưu tiên',
      dataIndex: 'priority',
      valueType: 'select',
      valueEnum: {
        'Thấp': { text: 'Thấp', status: 'Default' },
        'Trung bình': { text: 'Trung bình', status: 'Processing' },
        'Cao': { text: 'Cao', status: 'Error' },
      },
      render: (_, record) => {
        let color = 'default';
        if (record.priority === 'Trung bình') color = 'blue';
        if (record.priority === 'Cao') color = 'red';
        return <Tag color={color}>{record.priority}</Tag>;
      },
    },
    {
      title: 'Thời hạn',
      dataIndex: 'deadline',
      valueType: 'date',
      sorter: (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        'Chưa làm': { text: 'Chưa làm', status: 'Default' },
        'Đang làm': { text: 'Đang làm', status: 'Processing' },
        'Đã xong': { text: 'Đã xong', status: 'Success' },
      },
    },
    {
      title: 'Hành động',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setEditingTask(record);
            setIsModalVisible(true);
          }}
        >
          <EditOutlined /> Sửa
        </a>,
        <Popconfirm
          key="delete"
          title="Bạn có chắc chắn muốn xóa?"
          onConfirm={() => {
            deleteTask(record.id);
            message.success('Đã xóa công việc');
          }}
        >
          <a style={{ color: '#ff4d4f' }}>
            <DeleteOutlined /> Xóa
          </a>
        </Popconfirm>,
      ],
    },
  ];

  const handleTaskSubmit = (values: any) => {
    if (editingTask) {
      editTask(editingTask.id, values);
      message.success('Đã cập nhật công việc');
    } else {
      addTask(values);
      message.success('Đã thêm công việc mới');
    }
    setIsModalVisible(false);
    setEditingTask(null);
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2}>Quản lý Công việc Nhóm</Title>
          <Text type="secondary">Chào mừng, <Text strong>{currentUser}</Text></Text>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingTask(null);
              setIsModalVisible(true);
            }}
          >
            Thêm công việc
          </Button>
          <Button icon={<LogoutOutlined />} onClick={logout}>
            Đăng xuất
          </Button>
        </Space>
      </div>

      <TaskStats tasks={tasks} />

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Danh sách công việc" key="list">
          <ProTable<Task>
            columns={columns}
            actionRef={actionRef}
            dataSource={tasks}
            rowKey="id"
            search={{
              labelWidth: 'auto',
            }}
            toolBarRender={false}
            pagination={{
              pageSize: 10,
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Việc của tôi" key="my-tasks">
          <ProTable<Task>
            columns={columns}
            dataSource={tasks.filter((t) => t.assignee === currentUser)}
            rowKey="id"
            search={false}
            toolBarRender={false}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Lịch trình (Calendar)" key="calendar">
          <TaskCalendar tasks={tasks} />
        </Tabs.TabPane>
      </Tabs>

      <TaskForm
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        initialValues={editingTask}
      />
    </div>
  );
};

export default GroupTaskPage;
