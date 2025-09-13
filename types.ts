export interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    Imsak: string; // Sehri
    Midnight: string;
}

export interface Hadith {
    hadith: string;
    source: string;
}

export interface NextPrayerInfo {
    name: string;
    time: string;
    diff: number;
}

export interface Location {
    city: string;
    country: string;
}

export interface MonthlyPrayerDay {
    date: string;
    timings: PrayerTimes;
}
