import React, { useState } from 'react';
import { Layout, Button, Typography, Space, Card, Statistic, Row, Col, Tabs, Switch } from 'antd';
import { 
  LogoutOutlined, 
  PlusOutlined, 
  CheckCircleOutlined, 
  UnorderedListOutlined, 
  CalendarOutlined,
  DashboardOutlined 
} from '@ant-design/icons';
import useGroupTaskModel, { Task, TaskStatus } from '../../models/groupTask';
import LoginView from './components/LoginView';
import TaskTable from './components/TaskTable';
import TaskModal from './components/TaskModal';
import TaskCalendar from './components/TaskCalendar';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const GroupTaskManagement: React.FC = () => {
  const { 
    tasks, 
    currentUser, 
    login, 
    register,
    logout, 
    addTask, 
    updateTask, 
    deleteTask,
    toggleStatus 
  } = useGroupTaskModel();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'Tất cả'>('Tất cả');
  const [showOnlyMyTasks, setShowOnlyMyTasks] = useState(true);

  if (!currentUser) {
    return <LoginView onLogin={login} onRegister={register} />;
  }

  const handleAddTask = (values: Omit<Task, 'id'>) => {
    if (editingTask) {
      updateTask(editingTask.id, values);
    } else {
      addTask(values);
    }
    setModalVisible(false);
    setEditingTask(undefined);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const displayTasks = showOnlyMyTasks 
    ? tasks.filter(t => t.assignee === currentUser)
    : tasks;

  const stats = {
    total: displayTasks.length,
    completed: displayTasks.filter(t => t.status === 'Đã xong').length,
    doing: displayTasks.filter(t => t.status === 'Đang làm').length,
    todo: displayTasks.filter(t => t.status === 'Chưa làm').length,
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Space>
          <DashboardOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <Title level={4} style={{ margin: 0 }}>Quản lý Công việc Nhóm</Title>
        </Space>
        <Space>
          <Text strong>Xin chào, {currentUser}</Text>
          <Button icon={<LogoutOutlined />} onClick={logout} type="link">Đăng xuất</Button>
        </Space>
      </Header>

      <Content style={{ padding: '24px' }}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic title="Tổng công việc" value={stats.total} prefix={<UnorderedListOutlined />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Đã hoàn thành" value={stats.completed} valueStyle={{ color: '#3f8600' }} prefix={<CheckCircleOutlined />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Đang thực hiện" value={stats.doing} valueStyle={{ color: '#1890ff' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Chưa bắt đầu" value={stats.todo} valueStyle={{ color: '#faad14' }} />
            </Card>
          </Col>
        </Row>

        <Card style={{ borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
            <Space size="large">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => {
                  setEditingTask(undefined);
                  setModalVisible(true);
                }}
              >
                Thêm công việc
              </Button>
              <Space>
                <Text>Chỉ hiện công việc của tôi</Text>
                <Switch checked={showOnlyMyTasks} onChange={setShowOnlyMyTasks} />
              </Space>
            </Space>
          </div>

          <Tabs defaultActiveKey="list">
            <Tabs.TabPane 
              tab={<span><UnorderedListOutlined />Danh sách</span>} 
              key="list"
            >
              <TaskTable 
                tasks={displayTasks}
                onEdit={handleEditTask}
                onDelete={deleteTask}
                onToggleStatus={toggleStatus}
                searchText={searchText}
                setSearchText={setSearchText}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                currentUser={currentUser}
              />
            </Tabs.TabPane>
            <Tabs.TabPane 
              tab={<span><CalendarOutlined />Lịch</span>} 
              key="calendar"
            >
              <TaskCalendar tasks={displayTasks} />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Content>

      <TaskModal 
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingTask(undefined);
        }}
        onOk={handleAddTask}
        editingTask={editingTask}
      />
    </Layout>
  );
};

export default GroupTaskManagement;
