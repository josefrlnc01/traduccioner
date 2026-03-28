import { test, expect } from '@playwright/test'



test('registro y obtiene url de login', async ({ page }) => {
    await page.goto('/auth/register');

    // 2️⃣ Rellena los campos de email y password
    await page.locator('#name').fill('jose maria');
    await page.locator('#email').fill('josefrlnc01@gmail.com');
    await page.locator('#password').fill('contraseña123');
    await page.locator('#password_confirmation').fill('contraseña123');

    // 3️⃣ Haz click en el submit
    await page.locator('input[type=submit]').click();

    // 4️⃣ Verifica la URL final
    // Esto reemplaza totalmente waitForNavigation
    await expect(page).toHaveURL('/auth/login', { timeout: 10000 });
})
