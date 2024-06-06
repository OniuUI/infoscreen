// src/components/Person.tsx
import React from "react";

interface PersonProps {
    firstName: string;
    lastName: string;
    daysToBirthday: number;
    imageUrl: string;
}

const Person: React.FC<PersonProps> = ({ firstName, lastName, daysToBirthday, imageUrl }) => {
    const isBirthday = daysToBirthday === 0;

    return (
        <div className="flex items-center mb-4 bg-white rounded-lg p-2 animate-pulse border border-gray-600">
            <div className={`relative w-16 h-16 overflow-hidden rounded-lg mr-4${isBirthday ? " birthday" : ""}`}>
                <img className="w-full h-full object-cover" src={imageUrl} alt={`${firstName} ${lastName}`} />
                {isBirthday && <div className="absolute top-8 left-5 text-2xl">🎁</div>}
            </div>
            <div className="flex flex-col">
                <h3 className="text-lg leading-none mb-0 pb-0">{firstName} {lastName}</h3>
                <p className="text-sm leading-none mt-0 pt-0">{isBirthday ? "🎉 Happy Birthday! 🎉" : `${daysToBirthday} days to birthday`}</p>
            </div>
        </div>
    );
};

export default Person;