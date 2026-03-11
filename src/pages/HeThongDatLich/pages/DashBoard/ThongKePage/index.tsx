import React from 'react';
import { Row, Col, Card, Statistic, Table, DatePicker } from 'antd';
import { formatCurrency } from '@/pages/HeThongDatLich/utils/format';
import { SimpleBarChart } from '@/pages/HeThongDatLich/components/SimpleBarChart';
import { useStats } from './useStats';

const { RangePicker } = DatePicker;

const ThongKePage: React.FC = () => {
  const { range, setRange, statsData } = useStats();

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row gutter={[16, 16]}>
        {/* Bộ lọc */}
        <Col span={24}>
          <Card size="small" title="Lọc dữ liệu">
            <RangePicker value={range} onChange={(val) => setRange(val)} format="DD/MM/YYYY" />
          </Card>
        </Col>

        {/* Thống kê doanh thu */}
        <Col span={24}>
          <Card>
            <Statistic 
              title="Tổng doanh thu thực tế" 
              value={statsData.total} 
              formatter={(val) => formatCurrency(Number(val))} 
            />
          </Card>
        </Col>

        {/* Biểu đồ nhân viên */}
        <Col span={24}>
          <Card title="Biểu đồ doanh thu theo nhân viên">
            <div style={{ marginTop: 20 }}>
              {statsData.staffStats.length > 0 ? (
                <SimpleBarChart data={statsData.staffStats} />
              ) : (
                <div style={{ textAlign: 'center', color: '#999' }}>Không có dữ liệu</div>
              )}
            </div>
          </Card>
        </Col>

        {/* Bảng chi tiết */}
        <Col span={24}>
          <Card title="Danh sách lịch hẹn chi tiết">
            <Table 
              dataSource={statsData.filtered} 
              rowKey="id"
              columns={[
                { title: 'Ngày', dataIndex: 'date' },
                { title: 'Nhân viên', dataIndex: 'staff' },
                { title: 'Dịch vụ', dataIndex: 'service' },
                { title: 'Số tiền', dataIndex: 'price', render: (v) => formatCurrency(v) },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ThongKePage;