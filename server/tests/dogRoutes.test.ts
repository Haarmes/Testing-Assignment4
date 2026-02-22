import { describe, test, expect, vi } from "vitest"
import request from "supertest"
import express from "express"
import dogRoutes from "../routes/dogRoutes"
import { getDogImage } from "../controllers/dogController"

vi.mock("../controllers/dogController")

describe("dogRoutes", () => {

    test("GET /api/dogs/random returns success", async () => {
        const mockedResponse = {
            success: true,
            data: {
                status: "success",
                imageUrl: "https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg"
            }
        }
        vi.mocked(getDogImage).mockImplementation(
            async (_req: any, res: any) => {
                res.status(200).json(mockedResponse)
            }
        )
        const app = express()
        app.use("/api/dogs", dogRoutes)
        const response = await request(app)
            .get("/api/dogs/random")

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data.imageUrl)
            .toContain("https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg")
    })

    test("GET /api/dogs/random returns 500 and error message", async () => {

        const mockedErrorResponse = {
            success: false,
            error: "Failed to fetch dog image: Network error"
        }
        vi.mocked(getDogImage).mockImplementation(
            async (_req: any, res: any) => {
                res.status(500).json(mockedErrorResponse)
            }
        )
        const app = express()
        app.use("/api/dogs", dogRoutes)

        const response = await request(app)
            .get("/api/dogs/random")
        expect(response.status).toBe(500)
        expect(response.body.success).toBe(false)
        expect(response.body.error)
            .toBe("Failed to fetch dog image: Network error")
    })
})