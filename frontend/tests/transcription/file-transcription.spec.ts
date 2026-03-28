import { test, expect } from '@playwright/test'

test('usuario entra a dashboard y realiza transcripción de archivo propio', async ({page}) => {
    await page.goto('/auth/login')
    await page.locator('#email').fill('josefrlnc01@gmail.com')
    await page.locator('#password').fill('contrase\u00f1a123')
    await page.locator('input[type="submit"]').click()

    await expect(page).toHaveURL('/dashboard', {timeout: 20000})
    const fileInput = page.locator('#fileUpload')
    await fileInput.setInputFiles('tests/prueba.mp4')
    await page.locator('#transcribe-button').click()
    
    const transcription = page.locator('#file-result')
    await expect(transcription).toHaveText(/Esto es un video/i, {timeout: 50000})
})