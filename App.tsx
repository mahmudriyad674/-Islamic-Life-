import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { PrayerTimes, Hadith, NextPrayerInfo, Location, MonthlyPrayerDay } from './types';
import { fetchPrayerTimes, fetchMonthlyPrayerTimes } from './services/prayerTimeService';
import { fetchHadiths } from './services/geminiService';
import { BookOpenIcon, BellIcon, BellOffIcon, ChevronLeftIcon, ChevronRightIcon } from './components/Icons';
import LocationInput from './components/LocationInput';
import PrayerTimeGrid from './components/PrayerTimeGrid';
import NextPrayerDisplay from './components/NextPrayerDisplay';
import MonthlyView from './components/MonthlyView';

const App: React.FC = () => {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
    const [hadiths, setHadiths] = useState<Hadith[]>([]);
    const [currentHadithIndex, setCurrentHadithIndex] = useState(0);
    const [location, setLocation] = useState<Location>({ city: 'Dhaka', country: 'Bangladesh' });
    const [currentTime, setCurrentTime] = useState(new Date());
    const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
    const [alarmPlayedFor, setAlarmPlayedFor] = useState<string[]>([]);
    
    // State for new Monthly View
    const [view, setView] = useState<'daily' | 'monthly'>('daily');
    const [monthlyData, setMonthlyData] = useState<MonthlyPrayerDay[]>([]);
    const [currentDisplayDate, setCurrentDisplayDate] = useState(new Date());
    const [isMonthlyLoading, setIsMonthlyLoading] = useState(false);

    const alarmAudioRef = useRef<HTMLAudioElement>(null);

    const loadDailyData = useCallback(async (loc: Location) => {
        setIsLoading(true);
        setError(null);
        try {
            const times = await fetchPrayerTimes(loc.city, loc.country);
            setPrayerTimes(times);

            if (hadiths.length === 0) {
                const fetchedHadiths = await fetchHadiths();
                setHadiths(fetchedHadiths);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [hadiths.length]);
    
    const loadMonthlyData = useCallback(async (date: Date, loc: Location) => {
        setIsMonthlyLoading(true);
        setError(null);
        try {
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const data = await fetchMonthlyPrayerTimes(loc.city, loc.country, month, year);
            setMonthlyData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching monthly data.');
            setMonthlyData([]);
        } finally {
            setIsMonthlyLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDailyData(location);
    }, [location, loadDailyData]);

    useEffect(() => {
        if (view === 'monthly') {
            loadMonthlyData(currentDisplayDate, location);
        }
    }, [view, currentDisplayDate, location, loadMonthlyData]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const findNextPrayer = useCallback(() => {
        if (!prayerTimes) return;

        const prayerOrder: (keyof PrayerTimes)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const now = new Date();
        
        if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() <= 1) {
            setAlarmPlayedFor([]);
        }

        let upcomingPrayer: NextPrayerInfo | null = null;
        for (const prayerName of prayerOrder) {
            const prayerTimeStr = prayerTimes[prayerName];
            if (!prayerTimeStr) continue;
            
            const [hours, minutes] = prayerTimeStr.split(':').map(Number);
            const prayerDate = new Date();
            prayerDate.setHours(hours, minutes, 0, 0);

            if (prayerDate > now) {
                const diff = prayerDate.getTime() - now.getTime();
                upcomingPrayer = { name: prayerName, time: prayerTimeStr, diff };
                break;
            }
        }

        if (!upcomingPrayer) {
            const fajrTimeStr = prayerTimes['Fajr'];
            if (fajrTimeStr) {
              const [hours, minutes] = fajrTimeStr.split(':').map(Number);
              const tomorrowFajr = new Date();
              tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
              tomorrowFajr.setHours(hours, minutes, 0, 0);
              const diff = tomorrowFajr.getTime() - now.getTime();
              upcomingPrayer = { name: 'Fajr', time: fajrTimeStr, diff };
            }
        }
        setNextPrayer(upcomingPrayer);
    }, [prayerTimes]);

    useEffect(() => {
        findNextPrayer();
        const interval = setInterval(findNextPrayer, 1000);
        return () => clearInterval(interval);
    }, [findNextPrayer]);
    
    useEffect(() => {
        if (isAlarmEnabled && nextPrayer && nextPrayer.diff > 0 && nextPrayer.diff <= 1000) {
            if (!alarmPlayedFor.includes(nextPrayer.name)) {
                alarmAudioRef.current?.play().catch(e => console.error("Audio play failed:", e));
                setAlarmPlayedFor(prev => [...prev, nextPrayer.name]);
            }
        }
    }, [isAlarmEnabled, nextPrayer, alarmPlayedFor]);

    const handleLocationChange = (newLocation: Location) => {
        setLocation(newLocation);
    };
    
    const handleNextHadith = () => setCurrentHadithIndex((prev) => (prev + 1) % hadiths.length);
    const handlePrevHadith = () => setCurrentHadithIndex((prev) => (prev - 1 + hadiths.length) % hadiths.length);

    const toggleAlarm = () => {
        if (!isAlarmEnabled) {
            alarmAudioRef.current?.play().then(() => alarmAudioRef.current?.pause());
        }
        setIsAlarmEnabled(!isAlarmEnabled);
    };
    
    const handlePrevMonth = () => setCurrentDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

    return (
        <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 lg:p-8 font-sans bg-gradient-to-br from-gray-900 to-teal-900">
            <audio ref={alarmAudioRef} src="https://www.soundjay.com/buttons/sounds/button-7.mp3" preload="auto"></audio>
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold font-bengali text-teal-300">ইসলামিক জীবন</h1>
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                         <button onClick={toggleAlarm} className="p-2 rounded-full bg-teal-800 hover:bg-teal-700 transition-colors" aria-label={isAlarmEnabled ? "Disable alarm" : "Enable alarm"}>
                            {isAlarmEnabled ? <BellIcon/> : <BellOffIcon/>}
                        </button>
                        <span className="text-lg font-mono tracking-widest bg-gray-800/50 px-3 py-1 rounded-md">
                            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                        </span>
                    </div>
                </header>

                <main>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-400"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                            <p className="font-bold">Error loading data</p>
                            <p>{error}</p>
                            <p className="mt-2 text-sm">Please check the city/country and your internet connection.</p>
                        </div>
                    ) : (
                        <>
                        <div className="flex justify-end mb-4">
                            <div className="inline-flex rounded-md shadow-sm bg-gray-800/50 p-1">
                                <button onClick={() => setView('daily')} className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${view === 'daily' ? 'bg-teal-700 text-white' : 'text-teal-200 hover:bg-gray-700'}`}>
                                    দৈনিক
                                </button>
                                <button onClick={() => setView('monthly')} className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${view === 'monthly' ? 'bg-teal-700 text-white' : 'text-teal-200 hover:bg-gray-700'}`}>
                                    মাসিক
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                               {view === 'daily' ? (
                                    <>
                                        <NextPrayerDisplay nextPrayer={nextPrayer} location={location} />
                                        <PrayerTimeGrid prayerTimes={prayerTimes} nextPrayerName={nextPrayer?.name} />
                                    </>
                                ) : (
                                    <MonthlyView 
                                        monthlyData={monthlyData}
                                        currentDisplayDate={currentDisplayDate}
                                        onPrevMonth={handlePrevMonth}
                                        onNextMonth={handleNextMonth}
                                        isLoading={isMonthlyLoading}
                                    />
                                )}
                            </div>
                            <div className="space-y-8">
                                 <LocationInput onLocationChange={handleLocationChange} initialLocation={location} />
                                 <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg h-full flex flex-col">
                                    <h2 className="text-2xl font-bold font-bengali mb-4 text-teal-300 flex items-center">
                                      <BookOpenIcon /> <span className="ml-2">দিনের হাদিস</span>
                                    </h2>
                                    {hadiths.length > 0 ? (
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div className="text-teal-100 font-bengali space-y-3">
                                                <p className="text-lg leading-relaxed">{hadiths[currentHadithIndex].hadith}</p>
                                                <p className="text-sm text-teal-400 italic font-sans">- {hadiths[currentHadithIndex].source}</p>
                                            </div>
                                            <div className="flex justify-between mt-4">
                                                <button onClick={handlePrevHadith} className="p-2 rounded-full bg-teal-800 hover:bg-teal-700 transition-colors" aria-label="Previous hadith">
                                                   <ChevronLeftIcon />
                                                </button>
                                                <button onClick={handleNextHadith} className="p-2 rounded-full bg-teal-800 hover:bg-teal-700 transition-colors" aria-label="Next hadith">
                                                    <ChevronRightIcon />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-teal-200 font-bengali">হাদিস লোড হচ্ছে...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        </>
                    )}
                </main>
                <footer className="text-center mt-12 text-teal-500 text-sm">
                    <p>Made with ❤️ for the community. Prayer times provided by Aladhan API.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
