import { NextFunction, Request, Response } from "express";
import Quota from "../../modules/quota/quota.schema.js";

export const checkQuota = async (req: Request, res: Response, next: NextFunction) =>  {
    const user = req.user
    //Obtención de la ip del dispositivo
    const ip = (req.headers['x-forwarded-for']?.toString().split(' ')[0] ||
        req.socket.remoteAddress ||
        'unknown').trim()

    try {
        //Operación atómica de búsqueda
        const quota = await Quota.findOneAndUpdate(
            {user: user._id, ip},
            {
                $inc: {requestCount: 1},
                $setOnInsert: {
                    resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                }
            },
            {upsert:true, new: true}
        )


        if (quota.requestCount > 1200) {
            return res.status(429).json({error: 'No puedes hacer más de una traducción'})
        }

        next()
    } catch {
        return res.status(500).json({error: 'Error al verificar cuota'})
    }
}