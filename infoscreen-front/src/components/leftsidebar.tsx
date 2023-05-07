// src/components/LeftSidebar.tsx
import React from "react";
import Person from "./person";

const people = [
  {
    firstName: "Audun",
    lastName: "Nymoen",
    birthdate: "1990-05-07",
      imageUrl: "https://media.licdn.com/dms/image/C4D03AQGwkePfutvEkQ/profile-displayphoto-shrink_800_800/0/1572261670240?e=2147483647&v=beta&t=5JfcJQ9VqqppKokramMVRYDEGxvpG-ZiCBt_CTpHH6A",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    birthdate: "1985-11-20",
    imageUrl: "https://example.com/jane-smith.jpg",
  },
  {
      firstName: "Jane",
      lastName: "Smith",
      birthdate: "1985-11-20",
      imageUrl: "https://example.com/jane-smith.jpg",
  },
  {
      firstName: "Jane",
      lastName: "Smith",
      birthdate: "1985-11-20",
      imageUrl: "https://example.com/jane-smith.jpg",
  },
  {
      firstName: "Jane",
      lastName: "Smith",
      birthdate: "1985-12-23",
      imageUrl: "https://example.com/jane-smith.jpg",
  },
];

const sortedPeople = people.sort((b, a) => {
  const daysA = new Date(a.birthdate).getTime();
  const daysB = new Date(b.birthdate).getTime();
  return daysA - daysB;
});

const LeftSidebar: React.FC = () => {
  return (
    <div className="left-sidebar">
      {sortedPeople.map((person, index) => (
        <Person
          key={index}
          firstName={person.firstName}
          lastName={person.lastName}
          birthdate={person.birthdate}
          imageUrl={person.imageUrl}
        />
      ))}
    </div>
  );
};

export default LeftSidebar;
