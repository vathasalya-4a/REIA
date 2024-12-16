import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Buffer } from "buffer";
import { Readable } from "stream";
import prisma from "@/prisma";
import { Resend } from "resend";

const s3Client = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const resumeBucketName = process.env.CANDIDATE_RESUMES;
const jobDescriptionBucketName = process.env.CANDIDATE_JOB_DESCRIPTION;

if (!resumeBucketName || !jobDescriptionBucketName) {
  throw new Error("Missing required environment variables for S3 bucket names");
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(request: NextRequest) {
  try {
    const { candidateId, fileName, fileBuffer, jobDescription, JobBuffer, Jobfilename } = await request.json();
    let jobDescriptionFileUrl = null;
    const resumeBuffer = Buffer.from(fileBuffer, "base64");

    if (!fileName || !fileBuffer || !jobDescription) {
      console.error("Missing required fields:", { fileName, fileBuffer, jobDescription });
      return NextResponse.json(
        { error: "Missing file name, file buffer, or job description" },
        { status: 400 }
      );
    }

    const resumeUploadParams = {
      Bucket: resumeBucketName,
      Key: fileName,
      Body: resumeBuffer,
    };

    // Uploading Resume File to S3 Bucket
    await s3Client.send(new PutObjectCommand(resumeUploadParams));
    const resumeFileUrl = `https://${resumeBucketName}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${fileName}`;

    if (JobBuffer && Jobfilename) {
      const jobDescriptionBuffer = Buffer.from(JobBuffer, "base64");
      const jobDescriptionUploadParams = {
        Bucket: jobDescriptionBucketName,
        Key: Jobfilename,
        Body: jobDescriptionBuffer,
      };
      // Uploading Job Description File to S3 Bucket if File Uploaded
      await s3Client.send(new PutObjectCommand(jobDescriptionUploadParams));
      jobDescriptionFileUrl = `https://${jobDescriptionBucketName}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${Jobfilename}`;
    }

    // Storing the Resume and Job Description Details to Resume Table in PostgresSQL database

    const createdResume = await prisma.resume.create({
      data: {
        Resumefilename: fileName,
        ResumefileUrl: resumeFileUrl,
        JobDescriptionfileUrl: jobDescriptionFileUrl,
        JobDescription: jobDescription,
        candidateId: parseInt(candidateId, 10),
      },
    });

    return NextResponse.json({
      message: "Resume and job description uploaded successfully",
      resumeFileUrl,
      jobDescriptionFileUrl,
      jobDescription,
      resumeId: createdResume.id
    });
  } catch (error) {
    console.error("Error processing upload request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const CandidateId = parseInt(searchParams.get("CandidateId"), 10);
    const ResumeId = parseInt(searchParams.get("ResumeId"), 10);

    const data = await prisma.resume.findMany({
      where: {
        AND: [{ candidateId: CandidateId }, { id: ResumeId }],
      },
      select: {
        Resumefilename: true,
        ResumefileUrl: true,
        JobDescription: true,
      },
    });

    if (!data.length) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    const response = data[0];

    // Fetching the Resume File from the S3 URL
    const fileResponse = await fetch(response.ResumefileUrl);
    if (!fileResponse.ok) {
      throw new Error("Failed to fetch the file from S3.");
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    const fileContent = Buffer.from(fileBuffer).toString("base64");

    return NextResponse.json({
      message: "Resume and job description retrieved successfully",
      ResumeFilename: response.Resumefilename,
      ResumeFileContent: fileContent,
      JobDescription: response.JobDescription,
    });
  } catch (error) {
    console.error("Error in transforming resume:", error);
    return NextResponse.json(
      { error: "Failed to process the ATS scores." },
      { status: 500 }
    );
  }
}


