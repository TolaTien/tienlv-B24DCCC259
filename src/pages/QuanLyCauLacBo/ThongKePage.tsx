import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { TeamOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

export default () => {
    const { clubs, apps } = useModel('useClubManagement');

    const totalClubs = clubs.length;
    const totalApps = apps.length;
    const approvedApps = apps.filter(a => a.status === 'Approved').length;
    const pendingApps = apps.filter(a => a.status === 'Pending').length;

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng số CLB"
                            value={totalClubs}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#3f51b5' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng số đơn đăng ký"
                            value={totalApps}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đã duyệt"
                            value={approvedApps}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#3fcf8e' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Chờ duyệt"
                            value={pendingApps}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#ffa940' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Phân bổ thành viên theo CLB" style={{ marginTop: '24px' }}>
                {clubs.map(club => {
                    const memberCount = apps.filter(a => a.clubId === club.id && a.status === 'Approved').length;
                    return (
                        <div key={club.id} style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span>{club.name}</span>
                                <span>{memberCount} thành viên</span>
                            </div>
                            <div style={{ width: '100%', height: 8, background: '#f0f0f0', borderRadius: 4 }}>
                                <div 
                                    style={{ 
                                        width: `${totalApps > 0 ? (memberCount / totalApps) * 100 : 0}%`, 
                                        height: '100%', 
                                        background: '#3f51b5', 
                                        borderRadius: 4 
                                    }} 
                                />
                            </div>
                        </div>
                    );
                })}
                {clubs.length === 0 && <div style={{ textAlign: 'center', color: '#999' }}>Chưa có dữ liệu CLB</div>}
            </Card>
        </div>
    );
};