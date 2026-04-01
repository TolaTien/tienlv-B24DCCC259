import React, { useState, useEffect, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import {
  Row,
  Col,
  Select,
  Button,
  List,
  Typography,
  Divider,
  Alert,
  InputNumber,
  message,
  Card,
  Tag,
} from 'antd';
import { PlusOutlined, DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import { TravelService } from '../service';
import { TravelPlan } from '../typing';

const { Title, Text } = Typography;
const { Option } = Select;

const TravelPlanner: React.FC = () => {
  const [destinations, setDestinations] = useState<TravelPlan.Destination[]>([]);
  const [selectedDestId, setSelectedDestId] = useState<string | undefined>();
  const [itineraryItems, setItineraryItems] = useState<TravelPlan.ItineraryItem[]>([]);
  const [budgetLimit, setBudgetLimit] = useState<number>(10000000); // Default 10M
  const [day, setDay] = useState<number>(1);

  useEffect(() => {
    setDestinations(TravelService.getDestinations());
    const savedItineraries = TravelService.getItineraries();
    if (savedItineraries.length > 0) {
      setItineraryItems(savedItineraries[0].items || []);
    }
  }, []);

  const addToItinerary = () => {
    if (!selectedDestId) return;
    const newItem: TravelPlan.ItineraryItem = {
      id: Date.now().toString(),
      destinationId: selectedDestId,
      day: day,
      order: itineraryItems.length,
    };
    const updated = [...itineraryItems, newItem];
    setItineraryItems(updated);
    message.success('Đã thêm vào lịch trình');
  };

  const removeFromItinerary = (id: string) => {
    setItineraryItems(itineraryItems.filter((item) => item.id !== id));
  };

  const fullItineraryData = useMemo(() => {
    return itineraryItems.map((item) => {
      const dest = destinations.find((d) => d.id === item.destinationId);
      return { ...item, dest };
    });
  }, [itineraryItems, destinations]);

  const budgetStats = useMemo(() => {
    let food = 0, stay = 0, travel = 0, other = 0;
    fullItineraryData.forEach((item) => {
      if (item.dest) {
        food += item.dest.costFood || 0;
        stay += item.dest.costStay || 0;
        travel += item.dest.costTravel || 0;
        // Assume 'price' minus these is 'other' or just use price
        other += Math.max(0, (item.dest.price || 0) - (food + stay + travel));
      }
    });
    const total = food + stay + travel + other;
    return { food, stay, travel, other, total };
  }, [fullItineraryData]);

  const chartOptions: any = {
    chart: { type: 'donut' },
    labels: ['Ăn uống', 'Lưu trú', 'Di chuyển', 'Khác'],
    responsive: [{
      breakpoint: 480,
      options: { chart: { width: 200 }, legend: { position: 'bottom' } }
    }],
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560']
  };

  const chartSeries = [budgetStats.food, budgetStats.stay, budgetStats.travel, budgetStats.other];

  const totalTime = useMemo(() => {
    return fullItineraryData.reduce((acc, curr) => acc + (curr.dest?.visitTime || 0), 0);
  }, [fullItineraryData]);

  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <ProCard title="Lập kế hoạch" headerBordered>
            <Row gutter={16} align="bottom">
              <Col xs={24} sm={10}>
                <Text strong>Chọn điểm đến</Text>
                <Select
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="Chọn một địa điểm"
                  onChange={setSelectedDestId}
                  value={selectedDestId}
                >
                  {destinations.map((d) => (
                    <Option key={d.id} value={d.id}>{d.name}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={12} sm={6}>
                <Text strong>Ngày</Text>
                <InputNumber min={1} value={day} onChange={(v) => setDay(v || 1)} style={{ width: '100%', marginTop: 8 }} />
              </Col>
              <Col xs={12} sm={8}>
                <Button type="primary" icon={<PlusOutlined />} onClick={addToItinerary} block style={{ marginTop: 8 }}>
                  Thêm vào lịch trình
                </Button>
              </Col>
            </Row>

            <Divider />

            <List
              itemLayout="horizontal"
              dataSource={fullItineraryData}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeFromItinerary(item.id)} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<img src={item.dest?.image} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />}
                    title={<span>{item.dest?.name} <Tag color="blue">Ngày {item.day}</Tag></span>}
                    description={
                      <div>
                        <Text type="secondary">{item.dest?.location}</Text>
                        <br />
                        <Text type="success">Chi phí: {new Intl.NumberFormat('vi-VN').format(item.dest?.price || 0)}đ</Text>
                        <Text style={{ marginLeft: 16 }}>Thời gian: {item.dest?.visitTime}h</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
              locale={{ emptyText: 'Chưa có địa điểm nào trong lịch trình' }}
            />
          </ProCard>
        </Col>

        <Col xs={24} lg={8}>
          <ProCard title="Quản lý ngân sách & Thống kê" headerBordered>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Ngân sách tối đa (VNĐ)</Text>
              <InputNumber
                style={{ width: '100%', marginTop: 8 }}
                value={budgetLimit}
                onChange={(v) => setBudgetLimit(v || 0)}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </div>

            <Card size="small" style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
              <Row>
                <Col span={12}>
                  <Text type="secondary">Tổng chi phí</Text>
                  <Title level={4} style={{ margin: 0 }}>
                    {new Intl.NumberFormat('vi-VN').format(budgetStats.total)}đ
                  </Title>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Thời gian tham quan</Text>
                  <Title level={4} style={{ margin: 0 }}>{totalTime}h</Title>
                </Col>
              </Row>
            </Card>

            {budgetStats.total > budgetLimit && (
              <Alert
                message="Vượt quá ngân sách!"
                description={`Bạn đã vượt quá ${new Intl.NumberFormat('vi-VN').format(budgetStats.total - budgetLimit)}đ so với dự kiến.`}
                type="error"
                showIcon
                icon={<WarningOutlined />}
                style={{ marginBottom: 16 }}
              />
            )}

            <div style={{ height: 300 }}>
              <Title level={5}>Phân bổ ngân sách</Title>
              {budgetStats.total > 0 ? (
                <ReactApexChart options={chartOptions} series={chartSeries} type="donut" height={250} />
              ) : (
                <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Chưa có dữ liệu chi phí</div>
              )}
            </div>
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default TravelPlanner;
