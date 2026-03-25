import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Card, Rate, Input, Button, Row, Col, List, Statistic } from 'antd';

import { calculateAverage } from '@/services/Review/review';

const { TextArea } = Input;

const DanhGiaPage = ({ dispatch, review }) => {
	const [employee, setEmployee] = useState('');
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState('');

	useEffect(() => {
		dispatch({
			type: 'review/init',
		});
	}, []);

	const submitReview = () => {
		dispatch({
			type: 'review/create',
			payload: {
				id: Date.now(),
				employee,
				rating,
				comment,
				reply: '',
			},
		});

		setEmployee('');
		setComment('');
	};

	const reply = (id) => {
		dispatch({
			type: 'review/reply',
			payload: {
				id,
				reply: 'Cảm ơn phản hồi của bạn!',
			},
		});
	};

	const employees = [...new Set(review.list.map((r) => r.employee))];

	return (
		<Row gutter={20}>
			{/* FORM */}
			<Col span={8}>
				<Card title='Thêm đánh giá'>
					<Input
						placeholder='Tên nhân viên'
						value={employee}
						onChange={(e) => setEmployee(e.target.value)}
						style={{ marginBottom: 10 }}
					/>

					<Rate value={rating} onChange={setRating} style={{ marginBottom: 10 }} />

					<TextArea
						rows={3}
						placeholder='Nhận xét'
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						style={{ marginBottom: 10 }}
					/>

					<Button type='primary' block onClick={submitReview}>
						Gửi đánh giá
					</Button>
				</Card>
			</Col>

			{/* DANH SÁCH */}
			<Col span={10}>
				<Card title='Danh sách đánh giá'>
					<List
						dataSource={review.list}
						renderItem={(item) => (
							<List.Item>
								<Card style={{ width: '100%' }}>
									<h3>{item.employee}</h3>

									<Rate disabled value={item.rating} />

									<p>{item.comment}</p>

									{item.reply && (
										<p>
											<b>Phản hồi:</b> {item.reply}
										</p>
									)}

									<Button onClick={() => reply(item.id)}>Phản hồi</Button>
								</Card>
							</List.Item>
						)}
					/>
				</Card>
			</Col>

			{/* THỐNG KÊ */}
			<Col span={6}>
				<Card title='Đánh giá trung bình'>
					{employees.map((e) => (
						<Statistic
							key={e}
							title={e}
							value={calculateAverage(review.list, e)}
							suffix='⭐'
							style={{ marginBottom: 20 }}
						/>
					))}
				</Card>
			</Col>
		</Row>
	);
};

export default connect(({ review }) => ({ review }))(DanhGiaPage);
