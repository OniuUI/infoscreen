// src/components/Person.tsx
import React from "react";
import './css/person.css';

interface PersonProps {
    firstName: string;
    lastName: string;
    daysToBirthday: number;
    imageUrl: string;
}

const Person: React.FC<PersonProps> = ({ firstName, lastName, daysToBirthday, imageUrl }) => {
    const isBirthday = daysToBirthday === 0;

    return (
        <div className="person">
            <div className={`image-container${isBirthday ? " birthday" : ""}`}>
                <img className="person-image" src={imageUrl} alt={`${firstName} ${lastName}`} />
                {isBirthday && <div className="party-hat">🎁</div>}
            </div>
            <div className="person-info">
                <h3>{firstName} {lastName}</h3>
                <p>{isBirthday ? "🎉 Happy Birthday! 🎉" : `${daysToBirthday} days to birthday`}</p>
            </div>
        </div>
        );
};

export default Person;