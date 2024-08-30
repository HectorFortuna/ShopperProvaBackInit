import { Request, Response } from 'express';
import { Measure } from '../models/measure.js';
import { v4 as uuidv4 } from 'uuid';
import GeminiService from '../services/geminiService.js';

export const uploadMeasure = async (req: Request, res: Response) => {
    try {
        const { image, customer_code, measure_datetime, measure_type } = req.body;

        const measureDate = new Date(measure_datetime);

        if (isNaN(measureDate.getTime())) {
            return res.status(400).json({
                error_code: 'INVALID_DATA',
                error_description: 'Data inválida',
            });
        }

        const existingMeasure = await Measure.findOne({
            where: {
                customer_code,
                measure_type,
                measure_datetime: {
                    $between: [new Date(measureDate.getFullYear(), measureDate.getMonth(), 1), new Date()],
                }
            }
        });

        if (existingMeasure) {
            return res.status(409).json({
                error_code: 'DOUBLE_REPORT',
                error_description: 'Leitura do mês já realizada'
            });
        }

        const geminiResponse = await GeminiService.getMeterReadingFromImage(image);

        const measure = await Measure.create({
            measure_uuid: uuidv4(),
            customer_code,
            measure_datetime: measureDate,
            measure_type,
            image_url: '', 
            has_confirmed: false,
        });

        return res.status(200).json({
            image_url: '', 
            measure_value: geminiResponse.meterReading,
            measure_uuid: measure.measure_uuid,
        });
    } catch (error) {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: (error as Error).message,
        });
    }
};
export const confirmMeasure = async (req: Request, res: Response) => {
    try {
        const { measure_uuid, confirmed_value } = req.body;

        const measure = await Measure.findOne({ where: { measure_uuid } });

        if (!measure) {
            return res.status(404).json({
                error_code: 'MEASURE_NOT_FOUND',
                error_description: 'Leitura não encontrada',
            });
        }

        if (measure.has_confirmed) {
            return res.status(409).json({
                error_code: 'CONFIRMATION_DUPLICATE',
                error_description: 'Leitura já confirmada',
            });
        }

        measure.measure_value = confirmed_value;
        measure.has_confirmed = true;
        await measure.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: (error as Error).message,
        });
    }
};

export const listMeasures = async (req: Request, res: Response) => {
    try {
        const { customer_code } = req.params;
        const { measure_type } = req.query;

        const whereClause: any = { customer_code };
        if (measure_type) {
            whereClause.measure_type = (measure_type as string).toUpperCase();
        }

        const measures = await Measure.findAll({ where: whereClause });

        if (!measures.length) {
            return res.status(404).json({
                error_code: 'MEASURES_NOT_FOUND',
                error_description: 'Nenhuma leitura encontrada',
            });
        }

        return res.status(200).json({
            customer_code,
            measures: measures.map(measure => ({
                measure_uuid: measure.measure_uuid,
                measure_datetime: measure.measure_datetime,
                measure_type: measure.measure_type,
                has_confirmed: measure.has_confirmed,
                image_url: measure.image_url,
            })),
        });
    } catch (error) {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: (error as Error).message,
        });
    }
};