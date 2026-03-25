import React from 'react';
import { connect } from 'umi';
import { Card, Row, Col, Statistic, Button, Table, message, Spin } from 'antd';
import { DownloadOutlined, BarChartOutlined } from '@ant-design/icons';
import ColumnChart from '@/components/Chart/ColumnChart';
import * as XLSX from 'xlsx';
import type { IClub, IRegistration, IMember } from '@/types';

interface DashboardProps {
  clb: any;
  registration: any;
  members: any;
}

const Dashboard: React.FC<DashboardProps> = ({ clb, registration, members }) => {
  const { list: clubs = [] } = clb || {};
  const { list: registrations = [] } = registration || {};
  const { list: membersList = [] } = members || {};

  // Calculate stats
  const totalClubs = clubs.length;
  const totalRegistrations = registrations.length;
  const pendingRegistrations = registrations.filter((r: IRegistration) => r.status === 'Pending').length;
  const approvedMembers = membersList.length;

  const clubStats = clubs.map((club: IClub) => {
    const clubRegs = registrations.filter((r: IRegistration) => r.clubId === club.id);
    return {
      clubId: club.id,
      clubName: club.name,
      pending: clubRegs.filter((r: IRegistration) => r.status === 'Pending').length,
      approved: clubRegs.filter((r: IRegistration) => r.status === 'Approved').length,
      rejected: clubRegs.filter((r: IRegistration) => r.status === 'Rejected').length,
    };
  });

  // Chart data
  const xAxis = clubStats.map((c: any) => c.clubName);
  const yAxis = [
    clubStats.map((c: any) => c.pending),
    clubStats.map((c: any) => c.approved),
    clubStats.map((c: any) => c.rejected),
  ];
  const yLabel = ['Chờ duyệt', 'Đã duyệt', 'Từ chối'];

  const handleExportMembersForClub = (clubId: string) => {
    try {
      const club = clubs.find((c: IClub) => c.id === clubId);
      const clubMembers = membersList.filter((m: IMember) => m.clubId === clubId);

      if (clubMembers.length === 0) {
        message.warning('Không có thành viên để xuất');
        return;
      }

      const data = clubMembers.map((member: IMember) => ({
        'Họ và tên': member.fullName,
        'Email': member.email,
        'Số điện thoại': member.phone,
        'Giới tính': member.gender || '-',
        'Địa chỉ': member.address || '-',
        'Sở trường': member.skills,
        'Chức vụ': member.role || 'Thành viên',
        'Ngày tham gia': member.joinedDate,
        'Trạng thái': member.status,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Thành viên');

      worksheet['!cols'] = [
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 10 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 10 },
      ];

      XLSX.writeFile(
        workbook,
        `Danh_sach_thanh_vien_${club?.name}_${new Date().getTime()}.xlsx`
      );
      message.success(`Xuất danh sách thành viên CLB ${club?.name} thành công`);
    } catch (error) {
      console.error('Export error:', error);
      message.error('Lỗi khi xuất dữ liệu');
    }
  };

  const exportColumns = [
    {
      title: 'Câu lạc bộ',
      key: 'name',
      render: (_: any, record: IClub) => record.name,
    },
    {
      title: 'Số thành viên',
      key: 'memberCount',
      render: (_: any, record: IClub) => {
        return membersList.filter((m: IMember) => m.clubId === record.id).length;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: IClub) => (
        <Button
          size='small'
          type='primary'
          icon={<DownloadOutlined />}
          onClick={() => handleExportMembersForClub(record.id)}
        >
          Xuất XLSX
        </Button>
      ),
    },
  ];

  if (!clb || !registration || !members) {
    return <Spin />;
  }

  return (
    <div style={{ padding: 20, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Số Câu lạc bộ'
              value={totalClubs}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Tổng đơn đăng ký'
              value={totalRegistrations}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Chờ duyệt'
              value={pendingRegistrations}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Thành viên'
              value={approvedMembers}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title='Tình hình đăng ký theo CLB'>
            {clubs.length > 0 ? (
              <ColumnChart xAxis={xAxis} yAxis={yAxis} yLabel={yLabel} />
            ) : (
              <p>Chưa có dữ liệu</p>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title='Chi tiết theo CLB'>
            <Table
              columns={[
                {
                  title: 'Câu lạc bộ',
                  dataIndex: 'clubName',
                  key: 'clubName',
                },
                {
                  title: 'Chờ',
                  dataIndex: 'pending',
                  key: 'pending',
                  align: 'center',
                },
                {
                  title: 'Duyệt',
                  dataIndex: 'approved',
                  key: 'approved',
                  align: 'center',
                },
                {
                  title: 'Từ chối',
                  dataIndex: 'rejected',
                  key: 'rejected',
                  align: 'center',
                },
              ]}
              dataSource={clubStats}
              rowKey='clubId'
              pagination={false}
              size='small'
            />
          </Card>
        </Col>
      </Row>

      {/* Export Members Section */}
      <Card title='Xuất danh sách thành viên'>
        <Table
          columns={exportColumns}
          dataSource={clubs}
          rowKey='id'
          pagination={false}
          size='small'
        />
      </Card>
    </div>
  );
};

export default connect(({ clb, registration, members }: any) => ({
  clb,
  registration,
  members,
}))(Dashboard);
