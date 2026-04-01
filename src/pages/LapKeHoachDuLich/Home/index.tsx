import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Input, Select, Rate, Row, Col, Typography, Empty, Tag } from 'antd';
import { TravelService } from '../service';
import { TravelPlan } from '../typing';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const TravelHome: React.FC = () => {
  const [destinations, setDestinations] = useState<TravelPlan.Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<TravelPlan.Destination[]>([]);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<string>('rating');

  useEffect(() => {
    const data = TravelService.getDestinations();
    setDestinations(data);
    setFilteredDestinations(data);
  }, []);

  useEffect(() => {
    let result = [...destinations];

    if (searchText) {
      result = result.filter((d) => d.name.toLowerCase().includes(searchText.toLowerCase()));
    }

    if (typeFilter) {
      result = result.filter((d) => d.type === typeFilter);
    }

    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredDestinations(result);
  }, [searchText, typeFilter, sortOrder, destinations]);

  return (
    <PageContainer>
      <ProCard ghost direction="column" gutter={[0, 16]}>
        <ProCard>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Tìm kiếm điểm đến..."
                allowClear
                onSearch={setSearchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="Loại hình"
                style={{ width: '100%' }}
                allowClear
                onChange={setTypeFilter}
              >
                <Option value="beach">Biển</Option>
                <Option value="mountain">Núi</Option>
                <Option value="city">Thành phố</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                defaultValue="rating"
                style={{ width: '100%' }}
                onChange={setSortOrder}
              >
                <Option value="rating">Đánh giá cao nhất</Option>
                <Option value="price-asc">Giá thấp đến cao</Option>
                <Option value="price-desc">Giá cao đến thấp</Option>
              </Select>
            </Col>
          </Row>
        </ProCard>

        <Row gutter={[16, 16]}>
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((dest) => (
              <Col key={dest.id} xs={24} sm={12} md={8} lg={6}>
                <ProCard
                  hoverable
                  bordered
                  cover={<img alt={dest.name} src={dest.image} style={{ height: 200, objectFit: 'cover' }} />}
                  bodyStyle={{ padding: 16 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Title level={5} style={{ margin: 0 }}>{dest.name}</Title>
                    <Tag color={dest.type === 'beach' ? 'cyan' : dest.type === 'mountain' ? 'green' : 'blue'}>
                      {dest.type.toUpperCase()}
                    </Tag>
                  </div>
                  <Text type="secondary">{dest.location}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Rate disabled defaultValue={dest.rating} style={{ fontSize: 14 }} />
                    <span style={{ marginLeft: 8 }}>{dest.rating}/5</span>
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ color: '#f5222d', fontSize: 16 }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dest.price)}
                    </Text>
                  </div>
                </ProCard>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Empty description="Không tìm thấy điểm đến nào" />
            </Col>
          )}
        </Row>
      </ProCard>
    </PageContainer>
  );
};

export default TravelHome;
