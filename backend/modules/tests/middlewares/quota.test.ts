import { describe, it, expect, vi, beforeEach } from "vitest"
import { checkQuota } from "../../../shared/middlewares/quota.middleware.js"
import Quota from "../../quota/quota.schema.js"

describe("checkQuota middleware", () => {
    let req: any
    let res: any
    let next: any

    beforeEach(() => {
        req = {
            user: { _id: "user123", subscription: "free" },
            headers: {},
            socket: { remoteAddress: "127.0.0.1" }
        }

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        next = vi.fn()
        vi.restoreAllMocks()
    })

    it("debe llamar a next si no hay quota registrada", async () => {
        vi.spyOn(Quota, "findOne").mockResolvedValue(null)

        await checkQuota(req, res, next)

        expect(next).toHaveBeenCalled()
    })

    it("debe devolver 429 si el usuario free excede minutos", async () => {
        vi.spyOn(Quota, "findOne").mockResolvedValue({
            usedMinutes: 6
        } as any)

        await checkQuota(req, res, next)

        expect(res.status).toHaveBeenCalledWith(429)
        expect(res.json).toHaveBeenCalledWith({error: `No dispones de minutos de transcripción gratuita suficientes.`})
        expect(next).not.toHaveBeenCalled()
    })

    it("debe permitir al usuario pro si no excede la cuota", async () => {
        req.user.subscription = "pro"
        vi.spyOn(Quota, "findOne").mockResolvedValue({
            usedMinutes: 178
        } as any)

        await checkQuota(req, res, next)

        expect(next).toHaveBeenCalled()
    })

    it("debe permitir al usuario business si no excede la cuota", async () => {
        req.user.subscription = "business"
        vi.spyOn(Quota, "findOne").mockResolvedValue({
            usedMinutes: 590
        } as any)

        await checkQuota(req, res, next)

        expect(next).toHaveBeenCalled()
    })

    it("debe devolver 500 si hay error en la consulta", async () => {
        vi.spyOn(Quota, "findOne").mockRejectedValue(new Error("DB error"))

        await checkQuota(req, res, next)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({error: 'Error al verificar cuota'})
        expect(next).not.toHaveBeenCalled()
    })
})