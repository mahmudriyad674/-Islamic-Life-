import React from 'react';
import type { MonthlyPrayerDay, PrayerTimes } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from './Icons';

interface MonthlyViewProps {
    monthlyData: MonthlyPrayerDay[];
    currentDisplayDate: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    isLoading: boolean;
}

const MonthlyView: React.FC<MonthlyViewProps> = ({ monthlyData, currentDisplayDate, onPrevMonth, onNextMonth, isLoading }) => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');

    const prayerNamesMap: { [key: string]: string } = {
        Fajr: 'ফজর',
        Sunrise: 'সূর্যোদয়',
        Dhuhr: 'যোহর',
        Asr: 'আসর',
        Maghrib: 'মাগরিব',
        Isha: 'ইশা',
    };
    const displayOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

    return (
        <div className="bg-gray-800/50 p-4 sm:p-6 rounded-2xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-bengali text-teal-300 flex items-center mb-4 sm:mb-0">
                    <CalendarIcon />
                    <span className="ml-2">মাসিক সময়সূচী</span>
                </h2>
                <div className="flex items-center space-x-2">
                    <button onClick={onPrevMonth} className="p-2 rounded-full bg-teal-800 hover:bg-teal-700 transition-colors" aria-label="Previous month">
                        <ChevronLeftIcon />
                    </button>
                    <span className="font-semibold text-lg text-white w-40 sm:w-48 text-center">
                        {currentDisplayDate.toLocaleString('bn-BD', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={onNextMonth} className="p-2 rounded-full bg-teal-800 hover:bg-teal-700 transition-colors" aria-label="Next month">
                        <ChevronRightIcon />
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto">
                        <thead className="bg-gray-700/60">
                            <tr>
                                <th className="p-3 font-bengali font-semibold text-teal-300">তারিখ</th>
                                {displayOrder.map(key => <th key={key} className="p-3 font-bengali font-semibold text-teal-300">{prayerNamesMap[key]}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyData.map(day => {
                                const isToday = day.date === today;
                                return (
                                    <tr key={day.date} className={`border-b border-gray-700 transition-colors ${isToday ? 'bg-teal-900/50' : 'hover:bg-gray-700/40'}`}>
                                        <td className={`p-3 font-mono whitespace-nowrap ${isToday ? 'text-teal-300 font-bold' : 'text-gray-200'}`}>{day.date.split('-').reverse().join('-')}</td>
                                        {displayOrder.map(key => <td key={key} className="p-3 font-mono text-gray-100 whitespace-nowrap">{day.timings[key as keyof PrayerTimes]}</td>)}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MonthlyView;
