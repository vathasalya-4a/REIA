export const Resume_Extract_Schema = {
    name: "string", // The full name of the candidate
    summary: "string (optional)", // A brief one paragraph (5 to 6 points) summary or objective statement
    work_experience: [
      {
        Job: "string", // The company name and location
        JobTitle: "string", // The job title in the company
        Duration: "string", // The start and end dates
        Responsibilities: ["string"], // Include all the Responsibilities points extracted from the Resume in bullet points
        Technologies: ["string"] // Technologies used
      }
    ],
    education: [
      {
        university: "string", // The degree and institution name
        date: "string" // The year the degree was obtained
      }
    ],
    skill_section: [
      {
        name: "string", // Skill group name
        skills: ["string"] // List of skills
      }
    ],
    certifications: [
      {
        name: "string", // Certification name
        date: "string" // Date or year of certification
      }
    ]
  };
  