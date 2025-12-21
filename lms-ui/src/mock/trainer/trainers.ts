// Dummy trainer mock data
export type Batch = {
  id: number;
  name: string;
  schedule: string;
  students: string[];
};

export type Trainer = {
  id: number;
  name: string;
  email: string;
  password: string;
  contact: string;
  batches: Batch[];
};

export const trainers: Trainer[] = [
  {
    id: 1,
    name: "Mr. Smith",
    email: "smith@email.com",
    password: "password123", // For mock/demo only
    contact: "123-456-7890",
    batches: [
      {
        id: 1,
        name: "Batch A",
        schedule: "Mon, Wed, Fri - 5:00pm",
        students: ["Jane Doe", "John Doe", "Alice", "Bob"],
      },
      {
        id: 2,
        name: "Batch C",
        schedule: "Tue, Thu - 4:00pm",
        students: ["Charlie", "David"],
      },
    ],
  },
  {
    id: 2,
    name: "Ms. Lee",
    email: "lee@email.com",
    password: "password123", // For mock/demo only
    contact: "987-654-3210",
    batches: [
      {
        id: 3,
        name: "Batch B",
        schedule: "Sat, Sun - 10:00am",
        students: ["Eve", "Frank"],
      },
    ],
  },
];
