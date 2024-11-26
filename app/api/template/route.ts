import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jsonData } = body;

    console.log(jsonData);

    if (!jsonData) {
      return NextResponse.json({ message: 'Invalid Data' }, { status: 400 });
    }

    const templatePath = path.join(process.cwd(), 'public', 'template', '4A_Resume-Format.docx');
    const outputPath = path.join(process.cwd(), 'public', 'generated', '4A_Resume-Format_Updated.docx');

    fs.readFile(templatePath, 'binary', function (err, content) {
      if (err) {
        console.error('Error reading the template:', err);
        return NextResponse.json({ message: 'Error reading the template' }, { status: 500 });
      }

      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

      doc.setData(jsonData);

      try {
        doc.render();
      } catch (error) {
        console.error('Error rendering the document:', error);
        return NextResponse.json({ message: 'Error rendering the document' }, { status: 500 });
      }

      const buf = doc.getZip().generate({ type: 'nodebuffer' });

      fs.writeFile(outputPath, buf, function (err) {
        if (err) {
          console.error('Error writing the output file:', err);
          return NextResponse.json({ message: 'Error writing the output file' }, { status: 500 });
        } else {
          console.log('The Word file has been saved successfully.');
          return NextResponse.json(
            { message: 'File created successfully', path: `/utils/generated/4A_Resume-Format_Updated.docx` },
            { status: 200 }
          );
        }
      });
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
