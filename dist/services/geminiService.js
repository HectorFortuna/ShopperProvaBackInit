import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch, { Headers, Request, Response } from 'node-fetch';
if (!globalThis.fetch) {
    globalThis.fetch = fetch;
    globalThis.Headers = Headers;
    globalThis.Request = Request;
    globalThis.Response = Response;
}
class GeminiService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY não está definida nas variáveis de ambiente');
        }
        this.genAI = new GoogleGenerativeAI("AIzaSyDOXnEP2ijkBL1ksn8eKYIZ5UIPpLpfwsI");
    }
    async getMeterReadingFromImage(base64Image) {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro-vision" });
            const imageParts = [
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: "image/jpeg"
                    }
                }
            ];
            const result = await model.generateContent([
                "Analyze this image and tell me the numeric reading on the meter. Respond with only the numeric value, without any additional text.",
                ...imageParts
            ]);
            const response = await result.response;
            const text = response.text();
            console.log('Resposta do Gemini:', text); // Log para debugging
            // Extrair apenas o valor numérico da resposta
            const numericValue = parseInt(text.replace(/\D/g, ''), 10);
            if (isNaN(numericValue)) {
                throw new Error('Não foi possível extrair um valor numérico válido da resposta do Gemini');
            }
            return { meterReading: numericValue };
        }
        catch (error) {
            console.error('Erro detalhado ao processar imagem com Gemini:', error);
            if (error instanceof Error) {
                throw new Error(`Falha ao processar imagem com Gemini: ${error.message}`);
            }
            else {
                throw new Error('Falha ao processar imagem com Gemini: Erro desconhecido');
            }
        }
    }
}
export default new GeminiService();
