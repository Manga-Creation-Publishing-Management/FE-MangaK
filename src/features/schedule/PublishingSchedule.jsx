import { useState } from 'react';

export function usePublishingSchedule() {
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [startDate, setStartDate] = useState('');

  const approvedSeries = [
    { id: 1, name: 'The Last Warrior', author: 'Akira Tanaka' },
    { id: 4, name: 'Shadow Realm', author: 'Kenji Nakamura' },
  ];

  const schedules = [
    {
      id: 1,
      seriesName: 'The Last Warrior',
      author: 'Akira Tanaka',
      frequency: 'weekly',
      startDate: '2026-06-01',
      nextRelease: '2026-05-25',
      chaptersPublished: 12,
      status: 'active',
    },
    {
      id: 2,
      seriesName: 'Shadow Realm',
      author: 'Kenji Nakamura',
      frequency: 'weekly',
      startDate: '2026-04-01',
      nextRelease: '2026-05-28',
      chaptersPublished: 18,
      status: 'active',
    },
  ];

  const handleCreateSchedule = () => {
    if (!selectedSeries || !startDate) {
      alert('Please select a series and start date');
      return;
    }
    console.log('Creating publishing schedule:', {
      series: selectedSeries,
      frequency,
      startDate,
    });
    setShowAddSchedule(false);
    setSelectedSeries('');
    setStartDate('');
  };

  return {
    showAddSchedule,
    setShowAddSchedule,
    selectedSeries,
    setSelectedSeries,
    frequency,
    setFrequency,
    startDate,
    setStartDate,
    approvedSeries,
    schedules,
    handleCreateSchedule,
  };
}
