import { test, expect } from '@playwright/test';

// INFRA-001: página local; não verifica nenhum critério da Verzel Store.
test('INFRA-001 — iniciar navegador, interagir e verificar resultado local', async ({ page }) => {
  await page.setContent(`
    <html lang="pt-BR">
      <body>
        <button onclick="this.textContent='Infraestrutura pronta'">Verificar infraestrutura</button>
      </body>
    </html>
  `);

  await page.getByRole('button', { name: 'Verificar infraestrutura', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Infraestrutura pronta', exact: true })).toBeVisible();
});
