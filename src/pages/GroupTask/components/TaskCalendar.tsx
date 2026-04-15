import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { Task } from '@/models/groupTask';

const localizer = momentLocalizer(moment);

interface TaskCalendarProps {
  tasks: Task[];
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks }) => {
  const events = tasks.map((task) => ({
    id: task.id,
    title: `[${task.status}] ${task.name} - ${task.assignee}`,
    start: new Date(task.deadline),
    end: new Date(task.deadline),
    allDay: true,
    resource: task,
  }));

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#3174ad';
    if (event.resource.status === 'Đã xong') backgroundColor = '#52c41a';
    if (event.resource.status === 'Đang làm') backgroundColor = '#1890ff';
    if (event.resource.status === 'Chưa làm') backgroundColor = '#faad14';

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  return (
    <div style={{ height: '600px', background: '#fff', padding: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        messages={{
          next: 'Tiếp',
          previous: 'Trước',
          today: 'Hôm nay',
          month: 'Tháng',
          week: 'Tuần',
          day: 'Ngày',
          agenda: 'Lịch trình',
        }}
      />
    </div>
  );
};

export default TaskCalendar;
