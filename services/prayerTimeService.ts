import type { PrayerTimes, MonthlyPrayerDay } from '../types';

export const fetchPrayerTimes = async (city: string, country: string): Promise<PrayerTimes> => {
    try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
        if (!response.ok) {
            throw new Error(`Failed to fetch prayer times. Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.code !== 200) {
            throw new Error(data.data || 'Invalid location or API error.');
        }
        return data.data.timings;
    } catch (error) {
        console.error("Error fetching prayer times:", error);
        throw new Error("Could not retrieve prayer times. Please check your network or location spelling.");
    }
};

export const fetchMonthlyPrayerTimes = async (city: string, country: string, month: number, year: number): Promise<MonthlyPrayerDay[]> => {
    try {
        const response = await fetch(`https://api.aladhan.com/v1/calendarByCity?city=${city}&country=${country}&method=2&month=${month}&year=${year}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch monthly prayer times. Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.code !== 200) {
            throw new Error(data.data || 'Invalid location or API error for monthly data.');
        }
        return data.data.map((day: any) => ({
            date: day.date.readable,
            timings: day.timings,
        }));
    } catch (error) {
        console.error("Error fetching monthly prayer times:", error);
        throw new Error("Could not retrieve monthly prayer times. Please check your network or location spelling.");
    }
};
