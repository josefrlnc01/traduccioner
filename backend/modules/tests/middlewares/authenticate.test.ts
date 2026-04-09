import { describe, it, expect, vi } from "vitest"
import { authenticate } from "../../../shared/middlewares/auth.middleware.js"
import { Request, Response, NextFunction } from "express"

import User from "../../user/user.model.js"
import * as jwt from "jsonwebtoken"

// Mock completo de jsonwebtoken
vi.mock("jsonwebtoken", () => {
    return {
        default: {
            verify: vi.fn(() => ({ id: "123" })) // devuelve siempre id falso
        }
    }
})



describe("authenticate middleware", () => {

    it("debe devolver 401 si no hay usuario", async () => {

        const req: any = {
            headers: {}
        }

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        const next = vi.fn()

        await authenticate(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(next).not.toHaveBeenCalled()

    })



    it("debe dejar pasar si hay usuario y token", async () => {
        const req: any = {
            headers: { authorization: "Bearer token-falso" }
        }

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        const next = vi.fn()

        // Mock de User.findById().select()
        vi.spyOn(User, "findById").mockReturnValue({
            select: vi.fn().mockResolvedValue({
                name: "jose maria",
                email: "jose@frlnc01@gmail.com",
                subscription: "free"
            })
        } as any)

        await authenticate(req, res, next)

        expect(next).toHaveBeenCalled()       // next debe llamarse
        expect(req.user).toBeDefined()        // req.user debe existir
        expect(req.user.name).toBe("jose maria")
    })

})