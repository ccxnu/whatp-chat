import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import Handlebars from "handlebars";
import { minify } from 'html-minifier-terser';
import * as path from 'path';
import { lastValueFrom } from 'rxjs';

import { TransformerRepository } from '@/application/transformer/transformer';
import { DateFormat } from '@/core/entities/date';
import { CertificateDetails } from '@/domain/value-objects/certificate-details';

@Injectable()
export class TikeeTransformerRepository implements TransformerRepository
{
  constructor(private readonly httpService: HttpService)
  {}

  async generateCertificate(certificate: CertificateDetails): Promise<Buffer>
  {
    const dateCompleted = new DateFormat(certificate.dateCompleted);

    const filePath = path.join(process.cwd(), './public/certificate.html');

    const html = fs.readFileSync(filePath, 'utf8');

    const data =
    {
      "full_name": certificate.userFullName.toUpperCase(),
      "course_name": certificate.courseName,
      "date_completed": dateCompleted.currentDate(),
    };

    const content = Handlebars.compile(html)(data);

    const minifiedHtml = await minify(content, {
      collapseWhitespace: true,
      removeComments: true,
      removeEmptyAttributes: true,
      minifyCSS: true,
    });


    return this.generatePdf(minifiedHtml);
  }

 async generatePdf(htmlContent: string): Promise<Buffer>
 {
    const url = 'http://20.84.48.225:3636/apiDocsCreator/HtmlToPdf';
    const headers = { 'Content-Type': 'application/json' };

    try
    {
      const response = await lastValueFrom(
        this.httpService.post(
          url,
          { data: htmlContent },
          {
            headers,
          }
        ),
      );

      const base64Pdf = response.data.data;
      const pdfBuffer = Buffer.from(base64Pdf, 'base64'); // Convertir a Buffer

      return pdfBuffer;
    }
    catch (error)
    {
      throw error;
    }
  }
}
