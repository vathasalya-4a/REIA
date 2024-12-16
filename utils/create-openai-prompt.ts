import { Weights } from "@/types";


export function createOpenAiPrompt(
  resumeText: string,
  jobDescription: string,
  weights: Weights
): string {
  return `
    Please evaluate the following resume against the job description for ATS compatibility based on the following criteria:

    Weights:
    1. **Skills Matching** (${weights.skills_matching}%)
    2. **Experience** (${weights.experience}%)
    3. **Education** (${weights.education}%)
    4. **Keyword Usage** (${weights.keyword_usage}%)
    5. **Certifications** (${weights.certifications}%)
    6. **Achievements** (${weights.achievements}%)
    7. **Job Stability** (${weights.job_stability}%)
    8. **Cultural Fit** (${weights.cultural_fit}%)

    Resume: ${resumeText}
    Job Description: ${jobDescription}

    Please ensure that no section headers like 'Suggestions for Improvement' or specific labels for each category (e.g., 'Skills Matching') are provided. Only the feedback should be returned.
    Specific suggestions on how to improve the resume to close the gap if the score is less than 100%. These suggestions should focus on areas such as skills, experience, keyword usage, certifications, and any other relevant criteria that need attention based on the weights provided.
    Please provide the response in the following format:


    ATS Compatibility Score: [score] out of 100

    - <Suggestion 1>
    - <Suggestion 2>
    - <Continue providing specific suggestions in bullet point format.>

    Ensure the above format is strictly followed.
  `;
}

