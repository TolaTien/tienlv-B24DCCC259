import { addReview, replyReview, getReviews } from '@/services/Review/review';

export default {
	namespace: 'review',

	state: {
		list: [],
	},

	effects: {
		/* load dữ liệu khi mở trang */
		*init(_, { put }) {
			const data = getReviews();

			yield put({
				type: 'save',
				payload: data,
			});
		},

		/* tạo review */
		*create({ payload }, { select, put }) {
			const list = yield select((state) => state.review.list);

			const newList = addReview(payload, list);

			yield put({
				type: 'save',
				payload: newList,
			});
		},

		/* phản hồi review */
		*reply({ payload }, { select, put }) {
			const list = yield select((state) => state.review.list);

			const newList = replyReview(payload.id, payload.reply, list);

			yield put({
				type: 'save',
				payload: newList,
			});
		},
	},

	reducers: {
		save(state, action) {
			return {
				...state,
				list: action.payload,
			};
		},
	},
};
