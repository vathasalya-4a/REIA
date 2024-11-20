export const Resume_Extract_Prompt = `
<objective>
Extract structured information from a resume text and return it in a standardized JSON format.
</objective>

<input>
Resume text in plain text format:
{ResumeText}
</input>

<instructions>
1. Extract the following sections: Name, Summary, Experience, Skills, Education, Certifications.
2. For each section:
   - Name: Extract the full name as it appears.
   - Summary: Correct grammar only, retain all information, and do not add or remove any details.
   - Experience:
     - Extract job titles, companies, dates of employment, responsibilities (make sure all the points are present if there 10 points specified in an experience keep all the points do not remove the points ), and technologies mentioned.
   - Skills: Group skills by categories (e.g., Programming, Tools) if possible.
   - Education: Include university, degree, and dates (correct grammar but retain original details).
   - Certifications: Include certificate names, institutions, and dates.
3. Include null or empty values for missing sections.
4. Standardize date formats (e.g., "Jan 2020 - Dec 2022").
5. Return the output  JSON format exactly with in the below with the side headings:
{
  "name": "string",
  "summary": "string",
  "work_experience": [
    {
      "Job": "string",
      "JobTitle": "string",
      "Duration": "string",
      "Responsibilities": ["string", "string"],
      "Technologies": ["string", "string"]
    }
  ],
  "education": [
    {
      "university&degree": "string",
      "dates": "string"
    }
  ],
  "skill_section": [
    {
      "category": "string",
      "skills": ["string", "string"]
    }
  ],
  "certifications": [
    {
      "name&institution": "string",
      "dates": "string"
    }
  ]
}
</instructions>
`;
