import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { accessTokenKey } from "../utils/variables.js";
import User from "../../modules/user/user.model.js";


export async function authenticate (req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers?.authorization

    if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
        const error = new Error('No se ha encontrado token en los headers')
        return res.status(401).json({error: error.message})
    }
    
    const token = authHeaders.split(' ')[1]
    
    try {
        const decoded = jwt.verify(token, accessTokenKey)

        if (typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('name email subscription stripeCustomerId stripeSubscriptionId')
            if (!user) return res.status(401).json({error: 'Usuario no encontrado'})
            req.user = user
            next()
        }

    } catch  {
        const error = new Error('Token inválido o expirado')
        return res.status(401).json({error: error.message})
    }
}
