import React, { useState } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea, ProFormDatePicker, ProFormSwitch } from '@ant-design/pro-form';
import { Button, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { Club } from './type';

const ClubPage: React.FC = () => {
    const { clubs = [], addClub, updateClub, deleteClub } = useModel('useClubManagement');
    const [modalVisible, setModalVisible] = useState(false);
    const [currentRow, setCurrentRow] = useState<Club | undefined>(undefined);

    const columns: ProColumns<Club>[] = [
        { title: 'Tên CLB', dataIndex: 'name', sorter: true },
        { 
            title: 'Mô tả', 
            dataIndex: 'description', 
            hideInSearch: true,
            ellipsis: true,
            render: (text) => <div dangerouslySetInnerHTML={{ __html: (text as string) || '' }} /> 
        },
        { title: 'Chủ nhiệm', dataIndex: 'chairperson' },
        { 
            title: 'Trạng thái', 
            dataIndex: 'isActive',
            valueEnum: {
                true: { text: 'Hoạt động', status: 'Success' },
                false: { text: 'Tạm dừng', status: 'Default' },
            }
        },
        {
            title: 'Thao tác',
            valueType: 'option',
            render: (_, record) => [
                <a key="edit" onClick={() => {
                    setCurrentRow(record);
                    setModalVisible(true);
                }}>
                    <EditOutlined /> Chỉnh sửa
                </a>,
                <Popconfirm key="del" title="Xóa CLB này?" onConfirm={() => deleteClub?.(record.id)}>
                    <a style={{ color: 'red' }}>
                        <DeleteOutlined /> Xóa
                    </a>
                </Popconfirm>
            ],
        },
    ];

    return (
        <>
            <ProTable<Club>
                headerTitle="Danh sách Câu lạc bộ"
                columns={columns}
                dataSource={clubs}
                rowKey="id"
                toolBarRender={() => [
                    <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => {
                        setCurrentRow(undefined);
                        setModalVisible(true);
                    }}>
                        Thêm mới
                    </Button>
                ]}
            />
            <ModalForm<Club>
                title={currentRow ? 'Cập nhật CLB' : 'Thêm mới CLB'}
                visible={modalVisible}
                onVisibleChange={setModalVisible}
                initialValues={currentRow || { isActive: true }}
                onFinish={async (values) => {
                    if (currentRow) {
                        updateClub?.(currentRow.id, values);
                    } else {
                        addClub?.(values as any);
                    }
                    return true;
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
            >
                <ProFormText name="name" label="Tên CLB" rules={[{ required: true }]} />
                <ProFormText name="chairperson" label="Chủ nhiệm" rules={[{ required: true }]} />
                <ProFormDatePicker name="foundedDate" label="Ngày thành lập" width="md" />
                <ProFormSwitch name="isActive" label="Đang hoạt động" />
                <ProFormTextArea name="description" label="Mô tả" />
            </ModalForm>
        </>
    );
};

export default ClubPage;
