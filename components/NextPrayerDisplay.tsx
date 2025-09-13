
import React from 'react';
import type { NextPrayerInfo, Location } from '../types';
import { LocationMarkerIcon } from './Icons';

interface NextPrayerDisplayProps {
    nextPrayer: NextPrayerInfo | null;
    location: Location;
}

const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const NextPrayerDisplay: React.FC<NextPrayerDisplayProps> = ({ nextPrayer, location }) => {
    
    const prayerNameBengali: { [key: string]: string } = {
        Fajr: 'ফজর',
        Dhuhr: 'যোহর',
        Asr: 'আসর',
        Maghrib: 'মাগরিব',
        Isha: 'ইশা',
    };

    return (
        <div className="bg-teal-900/70 p-6 rounded-2xl shadow-2xl text-center border-t-2 border-teal-600">
            <div className="flex justify-center items-center text-teal-300 mb-2">
                <LocationMarkerIcon />
                <span className="ml-2 font-medium">{location.city}, {location.country}</span>
            </div>
            <p className="text-xl font-bengali font-medium text-teal-200">পরবর্তী সালাত</p>
            {nextPrayer ? (
                <>
                    <h2 className="text-5xl sm:text-6xl font-bold font-bengali text-white my-2">{prayerNameBengali[nextPrayer.name] || nextPrayer.name}</h2>
                    <p className="font-mono text-3xl sm:text-4xl text-teal-300 tracking-widest">{nextPrayer.time}</p>
                    <div className="mt-4 bg-gray-900/50 inline-block px-6 py-2 rounded-full">
                        <p className="text-sm font-bengali text-teal-200">সময় বাকি</p>
                        <p className="font-mono text-2xl text-white tracking-wider">{formatTime(nextPrayer.diff)}</p>
                    </div>
                </>
            ) : (
                <p className="text-2xl font-bengali text-teal-200 mt-4">সময় গণনা করা হচ্ছে...</p>
            )}
        </div>
    );
};

export default NextPrayerDisplay;
