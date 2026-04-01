import React, { useState } from 'react';
import { 
  Table, Button, Space, Typography, Modal, Form, Input, 
  Select, InputNumber, Rate, message, Row, Col, Card, Statistic, Tabs
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PieChartOutlined, TableOutlined, LineChartOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'umi';
import { Destination, Schedule } from '@/types/travel';
import moment from 'moment';
import Chart from 'react-apexcharts';

const { Title } = Typography;
const { TabPane } = Tabs;

const AdminPage: React.FC = () => {
  const dispatch = useDispatch();
  const { destinations, schedules } = useSelector((state: any) => state.travel);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [form] = Form.useForm();

  const handleSave = (values: any) => {
    const newDest: Destination = {
      ...values,
      id: editingDest ? editingDest.id : Date.now().toString(),
    };
    if (editingDest) {
      dispatch({ type: 'travel/updateDestination', payload: newDest });
    } else {
      dispatch({ type: 'travel/addDestination', payload: newDest });
    }
    message.success('Đã lưu địa điểm!');
    setIsModalVisible(false);
    setEditingDest(null);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'travel/deleteDestination', payload: id });
    message.success('Đã xóa địa điểm!');
  };

  const openEditModal = (dest: Destination) => {
    setEditingDest(dest);
    form.setFieldsValue(dest);
    setIsModalVisible(true);
  };

  // Statistics calculations
  const totalPlannedSpending = schedules.reduce((acc: number, s: Schedule) => {
    let sTotal = 0;
    s.days.forEach(d => {
      d.destinations.forEach(id => {
        const dest = destinations.find((d: Destination) => d.id === id);
        if (dest) sTotal += (dest.costFood + dest.costTransport + dest.costAccommodation);
      });
    });
    return acc + sTotal;
  }, 0);

  const popularDestinations = destinations.map((d: Destination) => {
    let count = 0;
    schedules.forEach((s: Schedule) => {
      s.days.forEach(day => {
        count += day.destinations.filter(id => id === d.id).length;
      });
    });
    return { name: d.name, count };
  }).sort((a: any, b: any) => b.count - a.count).slice(0, 5);

  const categorySpending = { food: 0, transport: 0, accommodation: 0 };
  schedules.forEach((s: Schedule) => {
    s.days.forEach(d => {
      d.destinations.forEach(id => {
        const destination = destinations.find((dest: Destination) => dest.id === id);
        if (destination) {
          categorySpending.food += destination.costFood;
          categorySpending.transport += destination.costTransport;
          categorySpending.accommodation += destination.costAccommodation;
        }
      });
    });
  });

  // Schedule by month
  const schedulesByMonth: any = {};
  schedules.forEach((s: Schedule) => {
    const month = moment(s.createdAt || s.startDate).format('MMM YYYY');
    schedulesByMonth[month] = (schedulesByMonth[month] || 0) + 1;
  });

  const monthChartOptions: any = {
    chart: { type: 'line' },
    xaxis: { categories: Object.keys(schedulesByMonth) },
    title: { text: 'Số lượt lịch trình được tạo theo tháng' }
  };
  const monthChartSeries = [{ name: 'Lịch trình', data: Object.values(schedulesByMonth) as number[] }];

  const barChartOptions: any = {
    chart: { type: 'bar' },
    xaxis: { categories: popularDestinations.map((d: any) => d.name) },
    title: { text: 'Địa điểm phổ biến nhất (số lượt chọn)' }
  };
  const barChartSeries = [{ name: 'Số lượt chọn', data: popularDestinations.map((d: any) => d.count) }];

  const pieChartOptions: any = {
    labels: ['Ăn uống', 'Di chuyển', 'Lưu trú'],
    title: { text: 'Số tiền theo từng hạng mục' }
  };
  const pieChartSeries = [categorySpending.food, categorySpending.transport, categorySpending.accommodation];

  const columns = [
    { title: 'Tên địa điểm', dataIndex: 'name', key: 'name' },
    { title: 'Vị trí', dataIndex: 'location', key: 'location' },
    { title: 'Loại', dataIndex: 'type', key: 'type', render: (type: string) => <span style={{ textTransform: 'capitalize' }}>{type}</span> },
    { title: 'Đánh giá', dataIndex: 'rating', key: 'rating', render: (r: number) => <Rate disabled defaultValue={r} style={{ fontSize: 12 }} /> },
    { title: 'Chi phí (1 lượt)', key: 'cost', render: (text: any, record: Destination) => `${(record.costFood + record.costTransport + record.costAccommodation).toLocaleString()}đ` },
    {
      title: 'Hành động',
      key: 'action',
      render: (text: any, record: Destination) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Trang quản trị & Thống kê</Title>

      <Tabs defaultActiveKey="1">
        <TabPane tab={<span><TableOutlined />Quản lý địa điểm</span>} key="1">
          <Card extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingDest(null); form.resetFields(); setIsModalVisible(true); }}>Thêm địa điểm</Button>}>
            <Table columns={columns} dataSource={destinations} rowKey="id" />
          </Card>
        </TabPane>

        <TabPane tab={<span><PieChartOutlined />Báo cáo thống kê</span>} key="2">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card>
                <Statistic title="Tổng số lịch trình" value={schedules.length} />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic title="Tổng số tiền thu về (dự kiến)" value={totalPlannedSpending} suffix="đ" />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic title="Địa điểm đa dạng" value={destinations.length} />
              </Card>
            </Col>
            <Col xs={24} lg={24}>
              <Card>
                <Chart options={monthChartOptions} series={monthChartSeries} type="line" height={300} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card>
                <Chart options={barChartOptions} series={barChartSeries} type="bar" height={300} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card>
                <Chart options={pieChartOptions} series={pieChartSeries} type="pie" height={300} />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      <Modal
        title={editingDest ? "Chỉnh sửa địa điểm" : "Thêm địa điểm mới"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Tên địa điểm" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="Vị trí" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label="Loại hình" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="biển">Biển</Select.Option>
                  <Select.Option value="núi">Núi</Select.Option>
                  <Select.Option value="thành phố">Thành phố</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="rating" label="Đánh giá" rules={[{ required: true }]}>
                <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="visitTime" label="Thời gian tham quan (giờ)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="image" label="Link hình ảnh" rules={[{ required: true }]}>
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="costFood" label="Chi phí ăn uống" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="costTransport" label="Chi phí di chuyển" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="costAccommodation" label="Chi phí lưu trú" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;
