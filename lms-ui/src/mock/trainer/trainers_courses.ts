// Enhanced trainer mock data with course details
export const trainers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@email.com",
    contact: "111-222-3333",
    courses: [
      {
        id: "C001",
        name: "Web Development Bootcamp",
        schedule: "Mon, Wed, Fri - 10:00 AM",
        duration: "2025-11-01 to 2026-02-28",
        totalSessions: 36,
        assignments: 8,
        description:
          "A hands-on full-stack web development bootcamp covering HTML, CSS, JavaScript, React, Node.js, and deployment.",
        resources: [
          {
            name: "React Hooks Guide",
            type: "pdf",
            link: "https://example.com/react-hooks.pdf",
          },
          {
            name: "Flexbox Cheatsheet",
            type: "pdf",
            link: "https://example.com/flexbox.pdf",
          },
          {
            name: "State Management Video",
            type: "video",
            link: "https://example.com/state-management.mp4",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Prof. Anil Mehta",
    email: "anil.mehta@email.com",
    contact: "222-333-4444",
    courses: [
      {
        id: "C002",
        name: "Data Science with Python",
        schedule: "Tue, Thu - 7:00 PM",
        duration: "2025-11-05 to 2026-03-05",
        totalSessions: 40,
        assignments: 9,
        description:
          "Learn data analysis, visualization, and machine learning using Python, NumPy, Pandas, Matplotlib, and Scikit-learn.",
        resources: [
          {
            name: "Pandas Basics Handbook",
            type: "pdf",
            link: "https://example.com/pandas-basics.pdf",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Lisa Martinez",
    email: "lisa.martinez@email.com",
    contact: "333-444-5555",
    courses: [
      {
        id: "C003",
        name: "UI/UX Design Fundamentals",
        schedule: "Sat - 11:00 AM",
        duration: "2025-10-15 to 2026-01-31",
        totalSessions: 24,
        assignments: 6,
        description:
          "An introduction to user interface and user experience design, covering design principles, wireframing, prototyping, and usability testing.",
        resources: [
          {
            name: "UI Design Principles",
            type: "pdf",
            link: "https://example.com/ui-design-principles.pdf",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Rahul Deshpande",
    email: "rahul.deshpande@email.com",
    contact: "444-555-6666",
    courses: [
      {
        id: "C004",
        name: "Cloud Computing on Azure",
        schedule: "Mon, Wed - 6:30 PM",
        duration: "2025-11-10 to 2026-02-28",
        totalSessions: 30,
        assignments: 7,
        description:
          "Hands-on course on Microsoft Azure covering core services, networking, storage, identity, and basic DevOps integration.",
        resources: [
          {
            name: "Azure Fundamentals Notes",
            type: "pdf",
            link: "https://example.com/azure-fundamentals.pdf",
          },
        ],
      },
    ],
  },
];
