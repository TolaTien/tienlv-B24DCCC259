import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, Input, Select, Tooltip } from 'antd';
import { Task, TaskPriority, TaskStatus } from '../../../models/groupTask';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, SyncOutlined, LockOutlined } from '@ant-design/icons';
import moment from 'moment';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  filterStatus: TaskStatus | 'Tất cả';
  setFilterStatus: (status: TaskStatus | 'Tất cả') => void;
  currentUser: string;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
  searchText,
  setSearchText,
  filterStatus,
  setFilterStatus,
  currentUser,
}) => {
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'Tất cả' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Task) => (
        <span style={{ fontWeight: record.assignee === currentUser ? 'bold' : 'normal' }}>
          {text} {record.assignee === currentUser && <Tag color="blue">Của bạn</Tag>}
        </span>
      ),
    },
    {
      title: 'Người được giao',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: 'Mức độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: TaskPriority) => {
        let color = 'blue';
        if (priority === 'Cao') color = 'red';
        if (priority === 'Trung bình') color = 'orange';
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: 'Thời hạn',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline: string) => moment(deadline).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: TaskStatus) => {
        let color = 'default';
        if (status === 'Đang làm') color = 'processing';
        if (status === 'Đã xong') color = 'success';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Task) => {
        const isOwner = record.assignee === currentUser;
        const isAdmin = currentUser.toLowerCase() === 'admin';
        const hasPermission = isOwner || isAdmin;

        return (
          <Space size="middle">
            {hasPermission ? (
              <>
                <Tooltip title={record.status === 'Đã xong' ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}>
                  <Button 
                    shape="circle"
                    icon={record.status === 'Đã xong' ? <SyncOutlined /> : <CheckCircleOutlined />} 
                    onClick={() => onToggleStatus(record.id)}
                    type={record.status === 'Đã xong' ? 'default' : 'primary'}
                  />
                </Tooltip>
                <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
                <Popconfirm title="Xác nhận xóa?" onConfirm={() => onDelete(record.id)}>
                  <Button icon={<DeleteOutlined />} danger />
                </Popconfirm>
              </>
            ) : (
              <Tooltip title="Chỉ người được giao hoặc Admin mới có quyền thao tác">
                <Tag icon={<LockOutlined />} color="default">Chỉ xem</Tag>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Input
          placeholder="Tìm kiếm công việc..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 160 }}
        >
          <Select.Option value="Tất cả">Tất cả trạng thái</Select.Option>
          <Select.Option value="Chưa làm">Chưa làm</Select.Option>
          <Select.Option value="Đang làm">Đang làm</Select.Option>
          <Select.Option value="Đã xong">Đã xong</Select.Option>
        </Select>
      </div>
      <Table 
        columns={columns} 
        dataSource={filteredTasks} 
        rowKey="id" 
        rowClassName={(record) => record.assignee === currentUser ? 'my-task-row' : ''}
      />
      <style>{`
        .my-task-row { background-color: #f0f7ff; }
        .my-task-row:hover > td { background-color: #e6f7ff !important; }
      `}</style>
    </div>
  );
};

export default TaskTable;
