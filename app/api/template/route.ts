import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const CLOUDMERSIVE_API_KEY = process.env.CONVERT_PDF_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jsonData, TaskID, ResourceType, CATSLaborCategory, Template } = body;

    const parsedJsonData = JSON.parse(jsonData);
    const combinedJson = {
      ...parsedJsonData,
      TaskID,
      ResourceType,
      CATSLaborCategory,
      Template,
    };

    console.log(combinedJson);

    const fileName = combinedJson.Template;
    const fileExtensionDocx = '.docx';

    const templatePath = path.join(process.cwd(), 'public', 'template', `${fileName}${fileExtensionDocx}`);
    const updatedFileName = `${fileName}.updated`;
    const outputPath = path.join(process.cwd(), 'public', 'generated', `${updatedFileName}${fileExtensionDocx}`);
    const content = await fs.readFile(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    doc.setData(combinedJson);

    try {
      doc.render();
    } catch (error) {
      console.error('Error rendering the document:', error);
      return NextResponse.json({ message: 'Error rendering the document' }, { status: 500 });
    }

    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    await fs.writeFile(outputPath, buf);
    console.log('The Word file has been saved successfully.');

    // Convert DOCX to PDF using Cloudmersive API
   try {
      const fileBuffer = await fs.readFile(outputPath);
      const pdfOutputPath = path.join(process.cwd(), 'public', 'generated', `${updatedFileName}.pdf`);

      const response = await axios.post(
        'https://api.cloudmersive.com/convert/docx/to/pdf',
        fileBuffer,
        {
          headers: {
            'Content-Type': 'application/octet-stream',
            Apikey: CLOUDMERSIVE_API_KEY,
          },
          responseType: 'arraybuffer',
        }
      );

      await fs.writeFile(pdfOutputPath, response.data);
      console.log('PDF generated successfully using Cloudmersive.');

      const pdfUrl = `/generated/${updatedFileName}.pdf`;
      console.log('Generated PDF URL:', pdfUrl);

      return NextResponse.json(
        {
          message: 'File created successfully',
          pdfUrl: pdfUrl ,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error during PDF conversion:', error.response?.data || error.message);
      return NextResponse.json({ message: 'Error during PDF conversion' }, { status: 500 });
    } 
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}