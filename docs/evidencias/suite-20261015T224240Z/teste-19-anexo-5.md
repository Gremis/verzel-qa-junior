# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: coupon-shipping.spec.ts >> CT-002 — manter frete grátis em exatamente R$ 200 com cupom
- Location: tests/coupon-shipping.spec.ts:67:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByRole('region', { name: 'Resumo do pedido', exact: true }).locator('[data-valor="frete"]')
Expected: "Grátis"
Received: "R$ 19,90"
Timeout:  5000ms

Call log:
  - Expect "soft toHaveText" getByRole('region', { name: 'Resumo do pedido', exact: true }).locator('[data-valor="frete"]') with timeout 5000ms
  - waiting for getByRole('region', { name: 'Resumo do pedido', exact: true }).locator('[data-valor="frete"]')
    14 × locator resolved to <dd data-valor="frete">R$ 19,90</dd>
       - unexpected value "R$ 19,90"

```

```yaml
- definition: R$ 19,90
```

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByRole('region', { name: 'Resumo do pedido', exact: true }).locator('[data-valor="total"]')
Expected: "R$ 180,00"
Received: "R$ 199,90"
Timeout:  5000ms

Call log:
  - Expect "soft toHaveText" getByRole('region', { name: 'Resumo do pedido', exact: true }).locator('[data-valor="total"]') with timeout 5000ms
  - waiting for getByRole('region', { name: 'Resumo do pedido', exact: true }).locator('[data-valor="total"]')
    14 × locator resolved to <dd data-valor="total">R$ 199,90</dd>
       - unexpected value "R$ 199,90"

```

```yaml
- definition: R$ 199,90
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | // Cada teste recebe sua própria page/context: nenhum carrinho é compartilhado.
  4   | // Valores esperados vêm dos cenários D01, D02 e D06, não da resposta da API.
  5   | test('CT-001 — aplicar 10% nos produtos sem descontar o frete', async ({ page }, testInfo) => {
  6   |   await test.step('Preparar uma mochila de R$ 100,00 pela interface', async () => {
  7   |     await page.goto('/');
  8   |     const product = page.getByRole('article', { name: 'Mochila Urbana 20L', exact: true });
  9   |     await expect(product).toContainText('R$ 100,00');
  10  |     await product.getByRole('button', { name: 'Adicionar ao carrinho', exact: true }).click();
  11  |     await page.getByRole('link', { name: /Carrinho/ }).click();
  12  |     await expect(page.getByRole('status', { name: 'Quantidade de Mochila Urbana 20L', exact: true })).toHaveText('1');
  13  |   });
  14  | 
  15  |   await test.step('Aplicar BEMVINDO10', async () => {
  16  |     await page.getByRole('textbox', { name: 'Cupom de desconto', exact: true }).fill('BEMVINDO10');
  17  |     await page.getByRole('button', { name: 'Aplicar cupom', exact: true }).click();
  18  |     await expect(page.getByRole('button', { name: 'Remover cupom', exact: true })).toBeVisible();
  19  |   });
  20  | 
  21  |   await test.step('Conferir D01: 100 − 10 + 19,90 = 109,90', async () => {
  22  |     const summary = page.getByRole('region', { name: 'Resumo do pedido', exact: true });
  23  |     await expect(summary.locator('[data-valor="subtotal"]')).toHaveText('R$ 100,00');
  24  |     await expect(summary.locator('[data-valor="desconto"]')).toHaveText('- R$ 10,00');
  25  |     await expect(summary.locator('[data-valor="frete"]')).toHaveText('R$ 19,90');
  26  |     await expect(summary.locator('[data-valor="total"]')).toHaveText('R$ 109,90');
  27  |     await expect(summary).toContainText('Faltam R$ 100,00 para o frete grátis.');
  28  |     await testInfo.attach('CT-001-resumo', { body: await page.screenshot(), contentType: 'image/png' });
  29  |   });
  30  | });
  31  | 
  32  | test('CT-005 — calcular frete pelo subtotal anterior ao desconto', async ({ page }, testInfo) => {
  33  |   await test.step('Preparar D06: mochila, garrafa e camiseta', async () => {
  34  |     await page.goto('/');
  35  |     for (const [name, price] of [
  36  |       ['Mochila Urbana 20L', 'R$ 100,00'],
  37  |       ['Garrafa Térmica 750ml', 'R$ 50,00'],
  38  |       ['Camiseta Essencial', 'R$ 59,90'],
  39  |     ]) {
  40  |       const product = page.getByRole('article', { name, exact: true });
  41  |       await expect(product).toContainText(price);
  42  |       await product.getByRole('button', { name: 'Adicionar ao carrinho', exact: true }).click();
  43  |     }
  44  |     await page.getByRole('link', { name: /Carrinho/ }).click();
  45  |     for (const name of ['Mochila Urbana 20L', 'Garrafa Térmica 750ml', 'Camiseta Essencial']) {
  46  |       await expect(page.getByRole('status', { name: `Quantidade de ${name}`, exact: true })).toHaveText('1');
  47  |     }
  48  |     await expect(page.getByRole('region', { name: 'Resumo do pedido', exact: true }).locator('[data-valor="subtotal"]')).toHaveText('R$ 209,90');
  49  |   });
  50  | 
  51  |   await test.step('Aplicar BEMVINDO10', async () => {
  52  |     await page.getByRole('textbox', { name: 'Cupom de desconto', exact: true }).fill('BEMVINDO10');
  53  |     await page.getByRole('button', { name: 'Aplicar cupom', exact: true }).click();
  54  |     await expect(page.getByRole('button', { name: 'Remover cupom', exact: true })).toBeVisible();
  55  |   });
  56  | 
  57  |   await test.step('Conferir D06: 209,90 − 20,99 + 0 = 188,91', async () => {
  58  |     const summary = page.getByRole('region', { name: 'Resumo do pedido', exact: true });
  59  |     await expect(summary.locator('[data-valor="subtotal"]')).toHaveText('R$ 209,90');
  60  |     await expect(summary.locator('[data-valor="desconto"]')).toHaveText('- R$ 20,99');
  61  |     await expect(summary.locator('[data-valor="frete"]')).toHaveText('Grátis');
  62  |     await expect(summary.locator('[data-valor="total"]')).toHaveText('R$ 188,91');
  63  |     await testInfo.attach('CT-005-resumo', { body: await page.screenshot(), contentType: 'image/png' });
  64  |   });
  65  | });
  66  | 
  67  | test('CT-002 — manter frete grátis em exatamente R$ 200 com cupom', async ({ page }, testInfo) => {
  68  |   await test.step('Preparar duas mochilas de R$ 100,00', async () => {
  69  |     await page.goto('/');
  70  |     const product = page.getByRole('article', { name: 'Mochila Urbana 20L', exact: true });
  71  |     await expect(product).toContainText('R$ 100,00');
  72  |     await product.getByRole('button', { name: 'Adicionar ao carrinho', exact: true }).click();
  73  |     await page.getByRole('link', { name: /Carrinho/ }).click();
  74  |     await page.getByRole('button', { name: 'Aumentar quantidade de Mochila Urbana 20L', exact: true }).click();
  75  |     await expect(page.getByRole('status', { name: 'Quantidade de Mochila Urbana 20L', exact: true })).toHaveText('2');
  76  |   });
  77  | 
  78  |   await test.step('Aplicar BEMVINDO10 e guardar a resposta observada', async () => {
  79  |     await page.getByRole('textbox', { name: 'Cupom de desconto', exact: true }).fill('BEMVINDO10');
  80  |     const calculation = page.waitForResponse(response => {
  81  |       if (!response.url().endsWith('/api/carrinho/calcular') || response.request().method() !== 'POST') return false;
  82  |       return response.request().postDataJSON()?.cupom === 'BEMVINDO10';
  83  |     });
  84  |     await page.getByRole('button', { name: 'Aplicar cupom', exact: true }).click();
  85  |     const response = await calculation;
  86  |     await testInfo.attach('CT-002-calculo-observado', {
  87  |       body: JSON.stringify({ status: response.status(), request: response.request().postDataJSON(), response: await response.json() }, null, 2),
  88  |       contentType: 'application/json',
  89  |     });
  90  |     await expect(page.getByRole('button', { name: 'Remover cupom', exact: true })).toBeVisible();
  91  |   });
  92  | 
  93  |   await test.step('Conferir D02: 200 − 20 + 0 = 180, conforme CA06', async () => {
  94  |     const summary = page.getByRole('region', { name: 'Resumo do pedido', exact: true });
  95  |     await expect(summary.locator('[data-valor="subtotal"]')).toHaveText('R$ 200,00');
  96  |     await expect(summary.locator('[data-valor="desconto"]')).toHaveText('- R$ 20,00');
  97  |     await expect.soft(summary.locator('[data-valor="frete"]')).toHaveText('Grátis');
> 98  |     await expect.soft(summary.locator('[data-valor="total"]')).toHaveText('R$ 180,00');
      |                                                                ^ Error: expect(locator).toHaveText(expected) failed
  99  |     await testInfo.attach('CT-002-resumo', { body: await page.screenshot(), contentType: 'image/png' });
  100 |   });
  101 | });
  102 | 
```