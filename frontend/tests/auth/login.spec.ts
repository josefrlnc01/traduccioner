import { test, expect } from '@playwright/test'


test('login y obtiene datos del backend', async ({ page }) => {
    await page.goto('/auth/login');

    // 2️⃣ Rellena los campos de email y password
    await page.locator('#email').fill('josefrlnc01@gmail.com');
    await page.locator('#password').fill('contraseña123');

    // 3️⃣ Haz click en el submit
    await page.locator('input[type=submit]').click();

    // 4️⃣ Verifica la URL final
    // Esto reemplaza totalmente waitForNavigation
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
})