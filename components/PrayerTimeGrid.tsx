
import React from 'react';
import type { PrayerTimes } from '../types';

interface PrayerTimeGridProps {
    prayerTimes: PrayerTimes | null;
    nextPrayerName?: string;
}

const PrayerTimeGrid: React.FC<PrayerTimeGridProps> = ({ prayerTimes, nextPrayerName }) => {
    if (!prayerTimes) return null;

    const prayerNamesMap: { [key: string]: string } = {
        Imsak: 'সেহরি',
        Fajr: 'ফজর',
        Sunrise: 'সূর্যোদয়',
        Dhuhr: 'যোহর',
        Asr: 'আসর',
        Maghrib: 'মাগরিব (ইফতার)',
        Isha: 'ইশা',
    };

    const displayOrder: (keyof PrayerTimes)[] = ['Imsak', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    return (
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold font-bengali mb-4 text-teal-300">আজকের নামাজের সময়সূচী</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {displayOrder.map(key => {
                     const isNext = nextPrayerName === key;
                     const isIftarOrSehri = key === 'Maghrib' || key === 'Imsak';

                     return (
                        <div key={key} className={`p-4 rounded-lg transition-all duration-300 ${isNext ? 'bg-teal-700 ring-2 ring-teal-400 scale-105' : 'bg-gray-700/60'} ${isIftarOrSehri ? 'border-2 border-amber-400' : ''}`}>
                            <p className={`font-bengali font-semibold text-lg ${isNext ? 'text-white' : 'text-teal-300'}`}>{prayerNamesMap[key]}</p>
                            <p className={`font-mono text-2xl font-bold ${isNext ? 'text-white' : 'text-gray-100'}`}>{prayerTimes[key]}</p>
                        </div>
                     )
                })}
            </div>
        </div>
    );
};

export default PrayerTimeGrid;
