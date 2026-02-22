import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { getRandomDogImage } from '../services/dogService'



describe('getRandomDogImage', () => {

    beforeEach(() => {
        global.fetch = vi.fn()
    })
    afterEach(() => {
        vi.clearAllMocks()
        vi.resetAllMocks()
    })


    test('Return dog image with valid request', async () => {

        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({
                message: "https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg",
                status: 'success'
            })
        } as Response)

        const result = await getRandomDogImage()
        expect(result).toEqual({ imageUrl: "https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg", status: 'success' })
        expect(fetch).toHaveBeenCalledOnce()
    })

    test('Throws error when API call fails', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false
        } as Response)
        await expect(getRandomDogImage()).rejects.toThrow(
            'Failed to fetch dog image: Dog API returned status undefined'
        )
    })

})

