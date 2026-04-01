import React, { useState } from 'react';
import { 
  Card, Button, List, Typography, Modal, Form, Input, DatePicker, 
  Row, Col, Space, Alert, Statistic, Divider, Empty, Tag,
  Popconfirm, message
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, ScheduleOutlined, 
  WalletOutlined, CarOutlined, CoffeeOutlined, HomeOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'umi';
import { Destination, Schedule } from '@/types/travel';
import moment from 'moment';
import Chart from 'react-apexcharts';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const SchedulePage: React.FC = () => {
  const dispatch = useDispatch();
  const { destinations, schedules } = useSelector((state: any) => state.travel);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddDestModalVisible, setIsAddDestModalVisible] = useState(false);
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [form] = Form.useForm();

  const selectedSchedule = schedules.find((s: Schedule) => s.id === selectedScheduleId);

  const handleCreateSchedule = (values: any) => {
    const { name, dateRange, totalBudget } = values;
    const startDate = dateRange[0].format('YYYY-MM-DD');
    const endDate = dateRange[1].format('YYYY-MM-DD');
    const diffDays = dateRange[1].diff(dateRange[0], 'days') + 1;

    const newSchedule: Schedule = {
      id: Date.now().toString(),
      name,
      startDate,
      endDate,
      totalBudget: Number(totalBudget),
      createdAt: new Date().toISOString(),
      days: Array.from({ length: diffDays }, (_, i) => ({
        day: i + 1,
        destinations: [],
      })),
    };

    dispatch({ type: 'travel/saveSchedule', payload: newSchedule });
    setSelectedScheduleId(newSchedule.id);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Đã tạo lịch trình mới!');
  };

  const handleAddDestination = (destinationId: string) => {
    if (!selectedSchedule) return;

    const updatedSchedule = { ...selectedSchedule };
    const dayIndex = updatedSchedule.days.findIndex(d => d.day === currentDay);
    if (dayIndex >= 0) {
      updatedSchedule.days = [...updatedSchedule.days];
      updatedSchedule.days[dayIndex] = {
        ...updatedSchedule.days[dayIndex],
        destinations: [...updatedSchedule.days[dayIndex].destinations, destinationId]
      };
      dispatch({ type: 'travel/saveSchedule', payload: updatedSchedule });
      setIsAddDestModalVisible(false);
      message.success('Đã thêm điểm đến!');
    }
  };

  const handleRemoveDestination = (day: number, index: number) => {
    if (!selectedSchedule) return;

    const updatedSchedule = { ...selectedSchedule };
    const dayIndex = updatedSchedule.days.findIndex(d => d.day === day);
    if (dayIndex >= 0) {
      const newDests = [...updatedSchedule.days[dayIndex].destinations];
      newDests.splice(index, 1);
      updatedSchedule.days = [...updatedSchedule.days];
      updatedSchedule.days[dayIndex] = {
        ...updatedSchedule.days[dayIndex],
        destinations: newDests
      };
      dispatch({ type: 'travel/saveSchedule', payload: updatedSchedule });
    }
  };

  const handleDeleteSchedule = (id: string) => {
    dispatch({ type: 'travel/deleteSchedule', payload: id });
    if (selectedScheduleId === id) setSelectedScheduleId(null);
    message.success('Đã xóa lịch trình!');
  };

  // Budget and Time Calculations
  const calculateStats = (schedule: Schedule) => {
    let food = 0, transport = 0, accommodation = 0, totalTime = 0;
    schedule.days.forEach(day => {
      day.destinations.forEach(destId => {
        const dest = destinations.find((d: Destination) => d.id === destId);
        if (dest) {
          food += dest.costFood;
          transport += dest.costTransport;
          accommodation += dest.costAccommodation;
          totalTime += dest.visitTime;
        }
      });
    });
    return { 
      food, transport, accommodation, 
      total: food + transport + accommodation,
      totalTime 
    };
  };

  const stats = selectedSchedule ? calculateStats(selectedSchedule) : { food: 0, transport: 0, accommodation: 0, total: 0, totalTime: 0 };
  const budgetExceeded = selectedSchedule ? stats.total > selectedSchedule.totalBudget : false;

  const chartOptions: any = {
    labels: ['Ăn uống', 'Di chuyển', 'Lưu trú'],
    colors: ['#ff4d4f', '#1890ff', '#52c41a'],
    legend: { position: 'bottom' }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card 
            title="Lịch trình của tôi" 
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Tạo mới</Button>}
          >
            <List
              dataSource={schedules}
              renderItem={(item: Schedule) => (
                <List.Item 
                  onClick={() => setSelectedScheduleId(item.id)}
                  style={{ cursor: 'pointer', backgroundColor: selectedScheduleId === item.id ? '#e6f7ff' : 'transparent', padding: '12px', borderRadius: '4px' }}
                  actions={[
                    <Popconfirm key="delete" title="Xóa lịch trình này?" onConfirm={(e) => { e?.stopPropagation(); handleDeleteSchedule(item.id); }}>
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
                    </Popconfirm>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<ScheduleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                    title={item.name}
                    description={`${moment(item.startDate).format('DD/MM')} - ${moment(item.endDate).format('DD/MM')}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={16}>
          {selectedSchedule ? (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Card>
                <Row gutter={16} align="middle">
                  <Col span={12}>
                    <Title level={3}>{selectedSchedule.name}</Title>
                    <Text type="secondary">{moment(selectedSchedule.startDate).format('DD/MM/YYYY')} - {moment(selectedSchedule.endDate).format('DD/MM/YYYY')}</Text>
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Statistic title="Ngân sách dự kiến" value={selectedSchedule.totalBudget} suffix="đ" />
                  </Col>
                </Row>
                
                <Divider />

                {budgetExceeded && (
                  <Alert
                    message="Cảnh báo vượt ngân sách!"
                    description={`Tổng chi phí hiện tại (${stats.total.toLocaleString()}đ) đã vượt quá ngân sách (${selectedSchedule.totalBudget.toLocaleString()}đ).`}
                    type="error"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    style={{ marginBottom: '16px' }}
                  />
                )}

                <Row gutter={16}>
                  <Col xs={24} lg={14}>
                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <Statistic title="Ăn uống" value={stats.food} suffix="đ" prefix={<CoffeeOutlined />} valueStyle={{ fontSize: '14px' }} />
                      </Col>
                      <Col span={8}>
                        <Statistic title="Di chuyển" value={stats.transport} suffix="đ" prefix={<CarOutlined />} valueStyle={{ fontSize: '14px' }} />
                      </Col>
                      <Col span={8}>
                        <Statistic title="Lưu trú" value={stats.accommodation} suffix="đ" prefix={<HomeOutlined />} valueStyle={{ fontSize: '14px' }} />
                      </Col>
                      <Col span={24}>
                        <Space size="large">
                          <Statistic 
                            title="Tổng cộng" 
                            value={stats.total} 
                            suffix="đ" 
                            prefix={<WalletOutlined />} 
                            valueStyle={{ color: budgetExceeded ? '#cf1322' : '#3f8600' }} 
                          />
                          <Statistic 
                            title="Thời gian tham quan" 
                            value={stats.totalTime} 
                            suffix="giờ" 
                            prefix={<ScheduleOutlined />} 
                          />
                        </Space>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={24} lg={10}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Chart options={chartOptions} series={[stats.food, stats.transport, stats.accommodation]} type="pie" width="100%" />
                    </div>
                  </Col>
                </Row>
              </Card>

              {selectedSchedule.days.map((day) => (
                <Card 
                  key={day.day} 
                  title={`Ngày ${day.day}`} 
                  extra={<Button type="dashed" icon={<PlusOutlined />} onClick={() => { setCurrentDay(day.day); setIsAddDestModalVisible(true); }}>Thêm điểm đến</Button>}
                >
                  <List
                    dataSource={day.destinations}
                    renderItem={(destId, index) => {
                      const dest = destinations.find((d: Destination) => d.id === destId);
                      return (
                        <List.Item 
                          actions={[
                            <Button key="remove" type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveDestination(day.day, index)} />
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<img src={dest?.image} onError={(e: any) => e.target.src = 'https://via.placeholder.com/50x50?text=IMG'} style={{ width: 48, height: 48, borderRadius: 4, objectFit: 'cover' }} />}
                            title={dest?.name}
                            description={
                              <Space split={<Divider type="vertical" />}>
                                <span><CoffeeOutlined /> {dest?.costFood.toLocaleString()}đ</span>
                                <span><CarOutlined /> {dest?.costTransport.toLocaleString()}đ</span>
                                <span><HomeOutlined /> {dest?.costAccommodation.toLocaleString()}đ</span>
                              </Space>
                            }
                          />
                        </List.Item>
                      );
                    }}
                    locale={{ emptyText: 'Chưa có điểm đến cho ngày này' }}
                  />
                </Card>
              ))}
            </Space>
          ) : (
            <Card>
              <Empty description="Chọn một lịch trình hoặc tạo mới để bắt đầu" />
            </Card>
          )}
        </Col>
      </Row>

      <Modal
        title="Tạo lịch trình mới"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSchedule}>
          <Form.Item name="name" label="Tên chuyến đi" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Du lịch Hạ Long 2024" />
          </Form.Item>
          <Form.Item name="dateRange" label="Thời gian" rules={[{ required: true }]}>
            <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="totalBudget" label="Ngân sách tối đa (VNĐ)" rules={[{ required: true }]}>
            <Input type="number" prefix={<WalletOutlined />} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Thêm điểm đến cho Ngày ${currentDay}`}
        visible={isAddDestModalVisible}
        onCancel={() => setIsAddDestModalVisible(false)}
        footer={null}
        width={600}
      >
        <List
          dataSource={destinations}
          renderItem={(item: Destination) => (
            <List.Item 
              actions={[<Button key="select" type="primary" size="small" onClick={() => handleAddDestination(item.id)}>Chọn</Button>]}
            >
              <List.Item.Meta
                avatar={<img src={item.image} onError={(e: any) => e.target.src = 'https://via.placeholder.com/40x40?text=IMG'} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />}
                title={item.name}
                description={item.location}
              />
              <Tag color="green">{(item.costFood + item.costTransport + item.costAccommodation).toLocaleString()}đ</Tag>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default SchedulePage;
