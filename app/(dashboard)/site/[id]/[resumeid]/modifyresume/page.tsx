"use client";

import { useParams } from 'next/navigation'; 
import { useEffect, useState } from "react";
import LoadingDots from "@/components/icons/loading-dots";
import { FileEdit, XIcon } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import * as mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
console.log(pdfjsLib.GlobalWorkerOptions.workerSrc);

export default function ModifyResume() {
  const searchParams = useParams();
  const { id,resumeid } = searchParams;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [form, setform] = useState({
    TaskID: "",
    ResourceType: "",
    CATSLaborCategory: "",
    Template: "",
    RecruiterPrompt: "",
  });

  useEffect(() => {
    if (id && resumeid) {
      setLoading(true);
      setTimeout(() => {
      setLoading(false);
      }, 1000);
    }
  }, [id, resumeid]);

  const closeToast = () => { setToastMessage("");}

  const extractText = async (base64FileContent: string, fileName: string) => {
    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    const arrayBuffer = Buffer.from(base64FileContent, "base64");
  
    if (fileExtension === "pdf") {
      const uint8Array = new Uint8Array(arrayBuffer);
      const pdfDocument = await pdfjsLib.getDocument({ data: uint8Array }).promise;
      let resumeText = "";
  
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const pageContent = await page.getTextContent();
        const pageText = pageContent.items.map((item: any) => item.str).join(" ");
        resumeText += pageText;
      }
      return resumeText;
    } else if (fileExtension === "docx") {
      const { value: resumeText } = await mammoth.extractRawText({
        arrayBuffer,
      });
      return resumeText;
    } else {
      throw new Error("Unsupported file format. Please upload a PDF or DOCX file.");
    }
  };  

  const transformresume = async () => {
    setLoading(true);
    if (!form.TaskID || !form.ResourceType || !form.CATSLaborCategory || !form.Template) {
      setToastMessage("Please fill all the required fields to transform the resume")
      setLoading(false);
      return;
    }
    closeToast();
    
    try {

      // Fetching the Specific Resume and Job Description details using Id's
      const fetchresponse = await fetch(`/api/upload-resume?CandidateId=${id}&ResumeId=${resumeid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!fetchresponse.ok) {
        throw new Error("Error in fetching the Resume and Job Description Details");
      }
      
      const fetchResult = await fetchresponse.json();

      const ResumeText = await extractText(fetchResult.ResumeFileContent, fetchResult.ResumeFilename);

      const transformresponse = await fetch("/api/modifyresume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          RecruiterPrompt: form.RecruiterPrompt,
          ResumeText: ResumeText,
          JobDescription: fetchResult.JobDescription,
        }),
      });

      const response = await transformresponse.json();

      if (transformresponse.ok) {
        // Call the second API to generate the Word document
        const generateResponse = await fetch("/api/template", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonData: response,
            TaskID: form.TaskID,
            ResourceType: form.ResourceType,
            CATSLaborCategory: form.CATSLaborCategory,
            Template: form.Template,
          }),
        });
    
        const generateResult = await generateResponse.json();
    
        if (generateResponse.ok) {
          console.log('File generated:', generateResult.path);
    
          // Optionally, trigger a download or update the UI
          window.open(generateResult.path, '_blank');
        } else {
          console.error('Error generating file:', generateResult.message);
        }
      } else {
        console.error('Error in modify resume API:', response.message);
      }
    }
     catch (error ) {
      console.error("Error during submission:", error);
      setToastMessage("Failed to transform resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-y-auto resize-none custom-scrollbar p-2">

      <h1 className="mt-2 text-center font-cal text-3xl text-black-200">
        Transform Resume
      </h1>

      <div className="mt-8 mx-auto w-5/6 p-6 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">

        <form className="grid gap-6">

          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <label className="flex-grow flex flex-col">
              <span className="mb-1 text-gray-700 dark:text-gray-300">
                Task ID
              </span>
              <input
                type="text"
                placeholder="Enter Task ID"
                value={form.TaskID}
                onChange={(e) => setform({ ...form, TaskID: e.target.value })}
                className="rounded-md border border-stone-300 p-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </label>
            <label className="flex-grow flex flex-col">
              <span className="mb-1 text-gray-700 dark:text-gray-300">
               Resource Type
              </span>
              <input
                type="text"
                placeholder="Enter Resource Type"
                value={form.ResourceType}
                onChange={(e) => setform({ ...form, ResourceType: e.target.value })}
                className="rounded-md border border-stone-300 p-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </label>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="flex-grow">
              <span className="block mb-1 text-gray-700 dark:text-gray-300">
                CATS Labor Category
              </span>
              <select 
                className="w-full rounded-md border border-stone-300 p-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-700 dark:text-gray-300"
                value={form.CATSLaborCategory}
                onChange={(e) => setform({ ...form, CATSLaborCategory: e.target.value })}>
                <option>Select Labor Category</option>
                <option>Subject Matter Expert</option>
              </select>
            </label>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="flex-grow">
              <span className="block mb-1 text-gray-700 dark:text-gray-300">
                Template
              </span>
              <select 
                className="w-full rounded-md border border-stone-300 p-2 shadow-sm focus:outline-none text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-gray-300"
                value={form.Template}
                onChange={(e) => setform({ ...form, Template: e.target.value })}>
                <option>Select Template</option>
                <option>4A Resume Template</option>
                <option>B Summary</option>
              </select>
            </label>
          </div>

        </form>

      </div>

      {!prompt ? (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4">
          <p className="mt-3 text-sm text-gray-500">
            Recruiter Prompt?{" "}
            <button
              type="button"
              onClick={() => setPrompt(true)}
              className="text-gray-500 underline hover:text-gray-700"
            >
              Click here to add any additional instructions or context
            </button>
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4">
          <p className="mt-3 text-sm text-gray-500">
            No Recruiter Prompt?{" "}
            <button
              type="button"
              onClick={() => setPrompt(false)}
              className="text-gray-500 underline hover:text-gray-700"
            >
              Click here to not include any additional instructions or context
            </button>
          </p>
        </div>
      )}

      {prompt && (
        <div className="flex items-center justify-center h-full mt-8">
          <textarea
            className="w-5/6 h-32 p-7 rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white focus:outline-none focus:ring-1 focus:ring-gray-400"
            placeholder="Leave this field empty or enter any additional instructions ....."
            value={form.RecruiterPrompt}
            onChange={(e) => setform({ ...form, RecruiterPrompt: e.target.value})}
          ></textarea>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          disabled={loading}
          onClick={transformresume}
          className={`${
            loading
              ? "cursor-not-allowed bg-gray-600"
              : "bg-black text-white hover:bg-gray-800 active:bg-gray-900"
          } flex items-center justify-center w-md p-3 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800`}
        >
          {loading ? (
            <div className="flex items-center">
              <LoadingDots color="#A8A29E" />
              <p className="ml-2 text-sm font-medium">Transforming Resume...</p>
            </div>
          ) : (
            <div className="flex items-center">
              <FileEdit className="h-5 w-5 mr-2" aria-hidden="true" />
              <p className="text-sm font-medium">Transform Resume</p>
            </div>
          )}
        </button>
        {
            toastMessage && (
              <div className="fixed bottom-4 right-6 bg-white text-black p-5 rounded-lg shadow-lg flex flex-col items-start justify-center w-[332px] h-auto border border-gray-300 transition group">
                <button
                  onClick={closeToast}
                  className="absolute top-2 right-2 text-gray-600 focus:outline-none opacity-0 group-hover:opacity-100 transition">
                  <XIcon className="h-3 w-3" aria-hidden="true" />
                </button>
                <span className="text-left m-0 p-0 leading-normal font-bold text-red-700">Error</span>
                <span className="text-left m-0 p-0 leading-normal">{toastMessage}</span>
              </div>
            )
        }
      </div>
    </div>
  );
}
