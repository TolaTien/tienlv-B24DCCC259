import dayjs from 'dayjs';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

export const formatDate = (date: string) => dayjs(date).format('DD/MM/YYYY');