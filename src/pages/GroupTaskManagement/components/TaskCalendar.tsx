import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Task } from '../../../models/groupTask';

const localizer = momentLocalizer(moment);

interface TaskCalendarProps {
  tasks: Task[];
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks }) => {
  const events = tasks.map((task) => ({
    id: task.id,
    title: `[${task.assignee}] ${task.title}`,
    start: new Date(task.deadline),
    end: new Date(task.deadline),
    allDay: true,
    resource: task,
  }));

  const eventStyleGetter = (event: any) => {
    const task = event.resource as Task;
    let backgroundColor = '#3174ad';
    if (task.status === 'Đã xong') backgroundColor = '#52c41a';
    if (task.status === 'Đang làm') backgroundColor = '#1890ff';

    const style: React.CSSProperties = {
      backgroundColor,
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      display: 'block',
    };

    if (task.priority === 'Cao') {
      style.borderLeft = '5px solid red';
    }

    return { style };
  };

  return (
    <div style={{ height: '600px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
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
        }}
      />
    </div>
  );
};

export default TaskCalendar;
