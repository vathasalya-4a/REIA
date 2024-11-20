import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jsonData } = body;

    console.log(jsonData)

    if (!jsonData) {
      return NextResponse.json({ message: 'Invalid Data' }, { status: 400 });
    }

    const templatePath = path.join(process.cwd(), 'public', 'template', '4A_Resume-Format.docx');
    const outputPath = path.join(process.cwd(), 'public', 'generated', '4A_Resume-Format_Updated.docx');

    const templateContent = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    doc.setData(jsonData);

    try {
      doc.render();
    } catch (error) {
      console.error('Error rendering document:', error);
      return NextResponse.json({ message: 'Error rendering document' }, { status: 500 });
    }

    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(outputPath, buf);

    return NextResponse.json(
      { message: 'File created successfully', path: `/utils/generated/4A_Resume-Format_Updated.docx` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
