
import React, { useState } from 'react';
import type { Location } from '../types';
import { LocationMarkerIcon, CheckCircleIcon } from './Icons';

interface LocationInputProps {
    onLocationChange: (location: Location) => void;
    initialLocation: Location;
}

const LocationInput: React.FC<LocationInputProps> = ({ onLocationChange, initialLocation }) => {
    const [city, setCity] = useState(initialLocation.city);
    const [country, setCountry] = useState(initialLocation.country);
    const [isSaved, setIsSaved] = useState(false);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLocationChange({ city, country });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold font-bengali mb-4 text-teal-300 flex items-center">
                <LocationMarkerIcon /> <span className="ml-2">আপনার অবস্থান</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-teal-200 font-bengali">শহর</label>
                    <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        placeholder="e.g., Dhaka"
                    />
                </div>
                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-teal-200 font-bengali">দেশ</label>
                    <input
                        type="text"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        placeholder="e.g., Bangladesh"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-gray-800 transition-colors"
                >
                    {isSaved ? <><CheckCircleIcon/> Updated</> : 'Update Location'}
                </button>
            </form>
        </div>
    );
};

export default LocationInput;
