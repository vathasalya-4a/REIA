import { NextResponse } from "next/server";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import * as mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
console.log(pdfjsLib.GlobalWorkerOptions.workerSrc);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();

    let text = "";

    if (extension === "pdf") {
      const uint8Array = new Uint8Array(arrayBuffer);

      // Extract text from PDF using pdfjs-dist
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
      const pdfDoc = await loadingTask.promise;
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        text += textContent.items.map((item: any) => item.str).join(" ");
      }
    } else if (extension === "docx") {
      // Extract text from DOCX using mammoth
      const { value } = await mammoth.extractRawText({ arrayBuffer });
      text = value;
    } else {
      return NextResponse.json({ error: "Unsupported file format" }, { status: 400 });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json({ error: "Failed to process the file" }, { status: 500 });
  }
}
