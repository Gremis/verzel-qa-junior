import { test, expect } from '@playwright/test';

// Cada teste recebe sua própria page/context: nenhum carrinho é compartilhado.
// Valores esperados vêm dos cenários D01, D02 e D06, não da resposta da API.
test('CT-001 — aplicar 10% nos produtos sem descontar o frete', async ({ page }, testInfo) => {
  await test.step('Preparar uma mochila de R$ 100,00 pela interface', async () => {
    await page.goto('/');
    const product = page.getByRole('article', { name: 'Mochila Urbana 20L', exact: true });
    await expect(product).toContainText('R$ 100,00');
    await product.getByRole('button', { name: 'Adicionar ao carrinho', exact: true }).click();
    await page.getByRole('link', { name: /Carrinho/ }).click();
    await expect(page.getByRole('status', { name: 'Quantidade de Mochila Urbana 20L', exact: true })).toHaveText('1');
  });

  await test.step('Aplicar BEMVINDO10', async () => {
    await page.getByRole('textbox', { name: 'Cupom de desconto', exact: true }).fill('BEMVINDO10');
    await page.getByRole('button', { name: 'Aplicar cupom', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Remover cupom', exact: true })).toBeVisible();
  });

  await test.step('Conferir D01: 100 − 10 + 19,90 = 109,90', async () => {
    const summary = page.getByRole('region', { name: 'Resumo do pedido', exact: true });
    await expect(summary.locator('[data-valor="subtotal"]')).toHaveText('R$ 100,00');
    await expect(summary.locator('[data-valor="desconto"]')).toHaveText('- R$ 10,00');
    await expect(summary.locator('[data-valor="frete"]')).toHaveText('R$ 19,90');
    await expect(summary.locator('[data-valor="total"]')).toHaveText('R$ 109,90');
    await expect(summary).toContainText('Faltam R$ 100,00 para o frete grátis.');
    await testInfo.attach('CT-001-resumo', { body: await page.screenshot(), contentType: 'image/png' });
  });
});

test('CT-005 — calcular frete pelo subtotal anterior ao desconto', async ({ page }, testInfo) => {
  await test.step('Preparar D06: mochila, garrafa e camiseta', async () => {
    await page.goto('/');
    for (const [name, price] of [
      ['Mochila Urbana 20L', 'R$ 100,00'],
      ['Garrafa Térmica 750ml', 'R$ 50,00'],
      ['Camiseta Essencial', 'R$ 59,90'],
    ]) {
      const product = page.getByRole('article', { name, exact: true });
      await expect(product).toContainText(price);
      await product.getByRole('button', { name: 'Adicionar ao carrinho', exact: true }).click();
    }
    await page.getByRole('link', { name: /Carrinho/ }).click();
    for (const name of ['Mochila Urbana 20L', 'Garrafa Térmica 750ml', 'Camiseta Essencial']) {
      await expect(page.getByRole('status', { name: `Quantidade de ${name}`, exact: true })).toHaveText('1');
    }
    await expect(page.getByRole('region', { name: 'Resumo do pedido', exact: true }).locator('[data-valor="subtotal"]')).toHaveText('R$ 209,90');
  });

  await test.step('Aplicar BEMVINDO10', async () => {
    await page.getByRole('textbox', { name: 'Cupom de desconto', exact: true }).fill('BEMVINDO10');
    await page.getByRole('button', { name: 'Aplicar cupom', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Remover cupom', exact: true })).toBeVisible();
  });

  await test.step('Conferir D06: 209,90 − 20,99 + 0 = 188,91', async () => {
    const summary = page.getByRole('region', { name: 'Resumo do pedido', exact: true });
    await expect(summary.locator('[data-valor="subtotal"]')).toHaveText('R$ 209,90');
    await expect(summary.locator('[data-valor="desconto"]')).toHaveText('- R$ 20,99');
    await expect(summary.locator('[data-valor="frete"]')).toHaveText('Grátis');
    await expect(summary.locator('[data-valor="total"]')).toHaveText('R$ 188,91');
    await testInfo.attach('CT-005-resumo', { body: await page.screenshot(), contentType: 'image/png' });
  });
});

test('CT-002 — manter frete grátis em exatamente R$ 200 com cupom', async ({ page }, testInfo) => {
  await test.step('Preparar duas mochilas de R$ 100,00', async () => {
    await page.goto('/');
    const product = page.getByRole('article', { name: 'Mochila Urbana 20L', exact: true });
    await expect(product).toContainText('R$ 100,00');
    await product.getByRole('button', { name: 'Adicionar ao carrinho', exact: true }).click();
    await page.getByRole('link', { name: /Carrinho/ }).click();
    await page.getByRole('button', { name: 'Aumentar quantidade de Mochila Urbana 20L', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Quantidade de Mochila Urbana 20L', exact: true })).toHaveText('2');
  });

  await test.step('Aplicar BEMVINDO10 e guardar a resposta observada', async () => {
    await page.getByRole('textbox', { name: 'Cupom de desconto', exact: true }).fill('BEMVINDO10');
    const calculation = page.waitForResponse(response => {
      if (!response.url().endsWith('/api/carrinho/calcular') || response.request().method() !== 'POST') return false;
      return response.request().postDataJSON()?.cupom === 'BEMVINDO10';
    });
    await page.getByRole('button', { name: 'Aplicar cupom', exact: true }).click();
    const response = await calculation;
    await testInfo.attach('CT-002-calculo-observado', {
      body: JSON.stringify({ status: response.status(), request: response.request().postDataJSON(), response: await response.json() }, null, 2),
      contentType: 'application/json',
    });
    await expect(page.getByRole('button', { name: 'Remover cupom', exact: true })).toBeVisible();
  });

  await test.step('Conferir D02: 200 − 20 + 0 = 180, conforme CA06', async () => {
    const summary = page.getByRole('region', { name: 'Resumo do pedido', exact: true });
    await expect(summary.locator('[data-valor="subtotal"]')).toHaveText('R$ 200,00');
    await expect(summary.locator('[data-valor="desconto"]')).toHaveText('- R$ 20,00');
    await expect.soft(summary.locator('[data-valor="frete"]')).toHaveText('Grátis');
    await expect.soft(summary.locator('[data-valor="total"]')).toHaveText('R$ 180,00');
    await testInfo.attach('CT-002-resumo', { body: await page.screenshot(), contentType: 'image/png' });
  });
});
