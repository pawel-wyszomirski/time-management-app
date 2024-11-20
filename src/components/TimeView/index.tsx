import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { pl } from 'date-fns/locale';
import TimeFilters from './TimeFilters';
import TimeEntryList from './TimeEntryList';
import TimeSummary from './TimeSummary';

const TimeView: React.FC = () => {
  const timeEntries = useStore(state => state.timeEntries);
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'custom'>('week');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [groupBy, setGroupBy] = useState<'day' | 'project' | 'category'>('day');

  const filteredEntries = useMemo(() => {
    return timeEntries.filter(entry => {
      if (!entry.endTime) return false;

      const entryDate = new Date(entry.endTime);
      const today = new Date();
      
      switch (dateRange) {
        case 'today':
          return format(entryDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
        case 'week': {
          const weekStart = startOfWeek(today, { locale: pl });
          const weekEnd = endOfWeek(today, { locale: pl });
          return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
        }
        case 'custom': {
          if (!customStartDate || !customEndDate) return true;
          const start = new Date(customStartDate);
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          return isWithinInterval(entryDate, { start, end });
        }
        default:
          return true;
      }
    });
  }, [timeEntries, dateRange, customStartDate, customEndDate]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Podsumowanie czasu
      </h2>

      <TimeFilters
        dateRange={dateRange}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        groupBy={groupBy}
        onDateRangeChange={setDateRange}
        onCustomStartDateChange={setCustomStartDate}
        onCustomEndDateChange={setCustomEndDate}
        onGroupByChange={setGroupBy}
      />

      <TimeSummary
        entries={filteredEntries}
        groupBy={groupBy}
      />

      <TimeEntryList
        entries={filteredEntries}
        groupBy={groupBy}
      />
    </div>
  );
};

export default TimeView;