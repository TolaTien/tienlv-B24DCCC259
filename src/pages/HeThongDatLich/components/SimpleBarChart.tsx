import React from 'react';
import { formatCurrency } from '../utils/format';

// Định nghĩa chuẩn kiểu dữ liệu để không bị lỗi 'unknown'
export interface DataItem {
  name: string;
  value: number;
}

interface Props {
  data: DataItem[];
  height?: number;
}

export const SimpleBarChart: React.FC<Props> = ({ data, height = 300 }) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div style={{ width: '100%', height: height, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '20px', borderBottom: '1px solid #eee' }}>
        {data.map((item, index) => (
          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', marginBottom: '4px' }}>{formatCurrency(item.value)}</span>
            <div style={{
              width: '80%',
              height: `${(item.value / maxValue) * 100}%`,
              background: '#1890ff',
              borderRadius: '2px 2px 0 0'
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
        {data.map((item, index) => (
          <div key={index} style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: '#666' }}>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};