import { Request, Response, NextFunction } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';


export async function summarizeArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };

    if (!process.env.GEMINI_API_KEY) {
      throw new AppError(500, 'AI_CONFIG_ERROR', 'Fitur AI belum dikonfigurasi. Mohon hubungi admin.');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const article = await prisma.article.findUnique({
      where: { id },
      select: { title: true, content: true }
    });

    if (!article) {
      throw new AppError(404, 'NOT_FOUND', 'Artikel tidak ditemukan.');
    }

    const plainText = article.content.replace(/<[^>]*>/g, ' ');
    
    const prompt = `Berperanlah sebagai asisten editor berita profesional untuk portal "Media Kajoo". 
    Tugasmu adalah merangkum artikel berikut menjadi 3 sampai 5 poin bullet yang sangat menarik dan informatif dalam Bahasa Indonesia.
    Gunakan gaya bahasa yang santai namun tetap informatif. Jangan gunakan kata pengantar, langsung saja ke poin-poinnya.
    
    Judul Artikel: ${article.title}
    Konten Artikel: ${plainText.substring(0, 10000)} // limit content to avoid token limits
    
    Format: Poin-poin bullet menggunakan simbol "•".`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({ 
      success: true, 
      data: { 
        summary: summary.trim(),
        model: 'gemini-flash-latest'
      } 
    });
  } catch (error: any) {
    // console.error('Gemini Error:', error);
    next(new AppError(500, 'AI_ERROR', `Gagal merangkum: ${error.message || 'Error tidak diketahui'}`));
  }
}
