import React, { useState } from 'react';
import { Card, Row, Col, Select, Input, Tag, Typography, Space, Empty } from 'antd';
import { useSelector } from 'umi';
import { Destination, DestinationType } from '@/types/travel';
import { EnvironmentOutlined, DollarOutlined, StarOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ExplorePage: React.FC = () => {
  const { destinations } = useSelector((state: any) => state.travel);
  const [filterType, setFilterType] = useState<DestinationType | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'price_asc' | 'price_desc' | 'rating_desc' | 'none'>('none');
  const [searchText, setSearchText] = useState('');

  const filteredDestinations = destinations
    .filter((d: Destination) => {
      const matchType = filterType === 'all' || d.type === filterType;
      const matchSearch = d.name.toLowerCase().includes(searchText.toLowerCase()) || 
                          d.location.toLowerCase().includes(searchText.toLowerCase());
      return matchType && matchSearch;
    })
    .sort((a: Destination, b: Destination) => {
      const avgPriceA = a.costFood + a.costTransport + a.costAccommodation;
      const avgPriceB = b.costFood + b.costTransport + b.costAccommodation;

      if (sortOrder === 'price_asc') return avgPriceA - avgPriceB;
      if (sortOrder === 'price_desc') return avgPriceB - avgPriceA;
      if (sortOrder === 'rating_desc') return b.rating - a.rating;
      return 0;
    });

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Khám phá điểm đến</Title>
      
      <div style={{ marginBottom: '24px', backgroundColor: '#fff', padding: '16px', borderRadius: '8px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input 
              placeholder="Tìm kiếm địa điểm..." 
              onChange={(e) => setSearchText(e.target.value)} 
              allowClear 
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select 
              style={{ width: '100%' }} 
              placeholder="Loại hình" 
              defaultValue="all"
              onChange={(value) => setFilterType(value as any)}
            >
              <Option value="all">Tất cả loại hình</Option>
              <Option value="biển">Biển</Option>
              <Option value="núi">Núi</Option>
              <Option value="thành phố">Thành phố</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select 
              style={{ width: '100%' }} 
              placeholder="Sắp xếp theo" 
              defaultValue="none"
              onChange={(value) => setSortOrder(value as any)}
            >
              <Option value="none">Mặc định</Option>
              <Option value="price_asc">Giá: Thấp đến Cao</Option>
              <Option value="price_desc">Giá: Cao đến Thấp</Option>
              <Option value="rating_desc">Đánh giá cao nhất</Option>
            </Select>
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]}>
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map((d: Destination) => (
            <Col xs={24} sm={12} md={8} lg={6} key={d.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={d.name}
                    src={d.image}
                    onError={(e: any) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta
                  title={
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: '18px' }}>{d.name}</Text>
                        <Tag color={d.type === 'biển' ? 'blue' : d.type === 'núi' ? 'green' : 'orange'}>
                          {d.type.toUpperCase()}
                        </Tag>
                      </div>
                      <Space>
                        <EnvironmentOutlined style={{ color: '#1890ff' }} />
                        <Text type="secondary">{d.location}</Text>
                      </Space>
                    </Space>
                  }
                  description={
                    <div style={{ marginTop: '12px' }}>
                      <Paragraph ellipsis={{ rows: 2 }}>{d.description}</Paragraph>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space>
                          <StarOutlined style={{ color: '#fadb14' }} />
                          <Text strong>{d.rating}</Text>
                        </Space>
                        <Space>
                          <DollarOutlined style={{ color: '#52c41a' }} />
                          <Text strong>{((d.costFood + d.costTransport + d.costAccommodation)).toLocaleString()}đ</Text>
                        </Space>
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Empty description="Không tìm thấy điểm đến nào" />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default ExplorePage;
