const STORAGE_KEY = 'reviews';

/* lấy dữ liệu */
export const getReviews = () => {
	const data = localStorage.getItem(STORAGE_KEY);
	return data ? JSON.parse(data) : [];
};

/* lưu dữ liệu */
export const saveReviews = (list) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

/* thêm đánh giá */
export const addReview = (review, list) => {
	const newList = [...list, review];

	saveReviews(newList);

	return newList;
};

/* phản hồi */
export const replyReview = (id, reply, list) => {
	const newList = list.map((item) => (item.id === id ? { ...item, reply } : item));

	saveReviews(newList);

	return newList;
};

/* tính rating trung bình */
export const calculateAverage = (reviews, employee) => {
	const empReviews = reviews.filter((r) => r.employee === employee);

	if (empReviews.length === 0) return 0;

	const total = empReviews.reduce((sum, r) => sum + r.rating, 0);

	return (total / empReviews.length).toFixed(1);
};
