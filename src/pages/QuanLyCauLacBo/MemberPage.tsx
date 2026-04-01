import React from 'react';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import type { Application } from './type';

export default () => {
    const { apps = [], clubs = [] } = useModel('useClubManagement');

    const clubMap = (clubs || []).reduce((acc, club) => {
        acc[club.id] = club.name;
        return acc;
    }, {} as Record<string, string>);

    const members = apps.filter(app => app.status === 'Approved');

    return (
        <ProTable<Application>
            headerTitle="Danh sách Thành viên"
            dataSource={members}
            rowKey="id"
            columns={[
                { title: 'Họ tên', dataIndex: 'fullName' },
                { title: 'Số điện thoại', dataIndex: 'phone' },
                { title: 'Email', dataIndex: 'email' },
                { 
                    title: 'Câu lạc bộ', 
                    dataIndex: 'clubId',
                    render: (id) => clubMap[id as string] || id
                },
                { title: 'Sở trường', dataIndex: 'strength', hideInSearch: true },
            ]}
        />
    );
};