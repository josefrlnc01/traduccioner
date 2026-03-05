import { NextFunction, Request, Response } from "express";
import Quota from "../../modules/quota/quota.schema.js";

export const checkQuota = async (req: Request, res: Response, next: NextFunction) =>  {
    const user = req.user
    const ip = (req.headers['x-forwarded-for']?.toString().split(' ')[0] ||
        req.socket.remoteAddress ||
        'unknown').trim()

    try {
        //operación atómica
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


        if (quota.requestCount > 1) {
            return res.status(429).json({error: 'No puedes hacer más de una traducción'})
        }

        next()
    } catch {
        return res.status(500).json({error: 'Error al verificar cuota'})
    }
}