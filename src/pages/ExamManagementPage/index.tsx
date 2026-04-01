import React, { useState, useEffect } from 'react';
import { Form, Button, Select, Input, InputNumber, Space, Card, Typography, message, Table, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Exam, Subject, KnowledgeBlock, Question, Difficulty, DifficultyLabels } from '../../models/Question';

const { Option } = Select;
const { Title } = Typography;

const ExamManagementPage: React.FC = () => {
	const [form] = Form.useForm();
	const [exams, setExams] = useState<Exam[]>(() => {
		const saved = localStorage.getItem('exams_data');
		return saved ? JSON.parse(saved) : [];
	});
	const [viewExamModal, setViewExamModal] = useState<Exam | null>(null);

	const subjects: Subject[] = JSON.parse(localStorage.getItem('subjects_data') || '[]');
	const knowledgeBlocks: KnowledgeBlock[] = JSON.parse(localStorage.getItem('knowledge_blocks_data') || '[]');
	const questionsBank: Question[] = JSON.parse(localStorage.getItem('questions_data') || '[]');

	useEffect(() => {
		localStorage.setItem('exams_data', JSON.stringify(exams));
	}, [exams]);

	const handleGenerateExam = (values: any) => {
		let generatedQuestions: Question[] = [];

		for (const rule of values.structure) {
			if (!rule || !rule.knowledgeBlockId || !rule.difficulty || !rule.quantity) continue;

			const availableQs = questionsBank.filter(
				(q) =>
					q.subjectId === values.subjectId &&
					q.knowledgeBlockId === rule.knowledgeBlockId &&
					q.difficulty === rule.difficulty,
			);

			if (availableQs.length < rule.quantity) {
				const blockName = knowledgeBlocks.find((k) => k.id === rule.knowledgeBlockId)?.name;
				message.error(
					`Không đủ câu hỏi: Yêu cầu ${rule.quantity} câu ${
						DifficultyLabels[rule.difficulty as Difficulty]
					} thuộc phần "${blockName}". Trong kho chỉ có ${availableQs.length} câu.`,
				);
				return;
			}

			const shuffled = [...availableQs].sort(() => 0.5 - Math.random());
			generatedQuestions = [...generatedQuestions, ...shuffled.slice(0, rule.quantity)];
		}

		if (generatedQuestions.length === 0) {
			message.error('Cấu trúc đề thi chưa có câu hỏi nào!');
			return;
		}

		const newExam: Exam = {
			id: `EXAM_${Date.now()}`,
			title: values.title,
			subjectId: values.subjectId,
			structure: values.structure,
			questions: generatedQuestions,
			createdAt: new Date().toLocaleString(),
		};

		setExams([newExam, ...exams]);
		form.resetFields();
		message.success(`Đã tạo thành công đề thi với ${generatedQuestions.length} câu hỏi!`);
	};

	return (
		<div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
			<Title level={2}>Quản Lý & Tạo Đề Thi</Title>

			<Card title='Thiết lập cấu trúc đề' style={{ marginBottom: 24 }}>
				<Form form={form} layout='vertical' onFinish={handleGenerateExam}>
					<Form.Item name='title' label='Tên đề thi' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='subjectId' label='Môn học' rules={[{ required: true }]}>
						<Select placeholder='Chọn môn học'>
							{subjects.map((s) => (
								<Option key={s.id} value={s.id}>
									{s.name}
								</Option>
							))}
						</Select>
					</Form.Item>

					<div style={{ marginBottom: 16 }}>
						<b>Cấu trúc câu hỏi:</b>
					</div>
					<Form.List name='structure' initialValue={[{}]}>
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, ...restField }) => (
									<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
										<Form.Item
											{...restField}
											name={[name, 'knowledgeBlockId']}
											rules={[{ required: true, message: 'Chọn khối KT' }]}
										>
											<Select placeholder='Khối kiến thức' style={{ width: 180 }}>
												{knowledgeBlocks.map((k) => (
													<Option key={k.id} value={k.id}>
														{k.name}
													</Option>
												))}
											</Select>
										</Form.Item>
										<Form.Item
											{...restField}
											name={[name, 'difficulty']}
											rules={[{ required: true, message: 'Chọn mức độ' }]}
										>
											<Select placeholder='Mức độ khó' style={{ width: 150 }}>
												{Object.entries(DifficultyLabels).map(([k, v]) => (
													<Option key={k} value={k}>
														{v}
													</Option>
												))}
											</Select>
										</Form.Item>
										<Form.Item
											{...restField}
											name={[name, 'quantity']}
											rules={[{ required: true, message: 'Nhập SL' }]}
										>
											<InputNumber placeholder='Số lượng' min={1} style={{ width: 100 }} />
										</Form.Item>
										{fields.length > 1 && <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />}
									</Space>
								))}
								<Form.Item>
									<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
										Thêm tiêu chí
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
					<Form.Item>
						<Button type='primary' htmlType='submit' size='large'>
							Sinh đề thi tự động
						</Button>
					</Form.Item>
				</Form>
			</Card>

			<Title level={4}>Danh sách đề thi đã lưu</Title>
			<Table
				dataSource={exams}
				rowKey='id'
				columns={[
					{ title: 'Tên đề thi', dataIndex: 'title' },
					{ title: 'Ngày tạo', dataIndex: 'createdAt' },
					{ title: 'Môn học', render: (_, r) => subjects.find((s) => s.id === r.subjectId)?.name || 'N/A' },
					{ title: 'Tổng số câu', render: (_, r) => r.questions.length },
					{
						title: 'Hành động',
						render: (_, r) => (
							<Button type='link' onClick={() => setViewExamModal(r)}>
								Xem chi tiết
							</Button>
						),
					},
				]}
			/>

			<Modal
				title={viewExamModal?.title}
				visible={!!viewExamModal}
				onCancel={() => setViewExamModal(null)}
				width={800}
				footer={null}
			>
				{viewExamModal?.questions.map((q, idx) => (
					<div key={idx} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
						<b>Câu {idx + 1}:</b> {q.content}
						<div style={{ fontSize: 12, color: 'gray', marginTop: 4 }}>
							[Mức độ: {DifficultyLabels[q.difficulty as Difficulty]}] - [Khối:{' '}
							{knowledgeBlocks.find((k) => k.id === q.knowledgeBlockId)?.name}]
						</div>
					</div>
				))}
			</Modal>
		</div>
	);
};
export default ExamManagementPage;
