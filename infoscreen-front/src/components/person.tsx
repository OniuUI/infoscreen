// src/components/Person.tsx
import React from "react";
import { differenceInCalendarDays, parseISO } from "date-fns";

interface PersonProps {
    firstName: string;
    lastName: string;
    birthdate: string;
    imageUrl: string;
}

const daysUntilBirthday = (birthdate: string): number => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const birthDateThisYear = parseISO(`${currentYear}-${birthdate.slice(5)}`);
  const days = differenceInCalendarDays(birthDateThisYear, today);

  if (days >= 0) {
    return days;
  } else {
    const birthDateNextYear = parseISO(`${currentYear + 1}-${birthdate.slice(5)}`);
    return differenceInCalendarDays(birthDateNextYear, today);
  }
};

const Person: React.FC<PersonProps> = ({ firstName, lastName, birthdate, imageUrl }) => {
    const daysToBirthday = daysUntilBirthday(birthdate);
    const isBirthday = daysToBirthday === 0;

    return (
        <div className="person">
            <div className={`image-container${isBirthday ? " birthday" : ""}`}>
                <img className="person-image" src={imageUrl} alt={`${firstName} ${lastName}`} />
                {isBirthday && <div className="party-hat">🥳</div>}
            </div>
            <div className="person-info">
                <span>{firstName} {lastName}</span>
                <span>- {isBirthday ? "Today!" : `${daysToBirthday} days to birthday`}</span>
            </div>
        </div>
        );
};

export default Person;
