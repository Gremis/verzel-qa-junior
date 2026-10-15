# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart-api.spec.ts >> CT-002 API — D02: frete grátis no limite com cupom
- Location: tests/cart-api.spec.ts:32:7

# Error details

```
Error: expect(received).toMatchObject(expected)

- Expected  - 3
+ Received  + 3

  Object {
    "desconto": 20,
-   "frete": 0,
-   "freteGratis": true,
+   "frete": 19.9,
+   "freteGratis": false,
    "subtotal": 200,
-   "total": 180,
+   "total": 199.9,
    "valorFaltanteFreteGratis": 0,
  }
```

# Test source

```ts
  1   | import { test, expect, type APIRequestContext, type TestInfo } from '@playwright/test';
  2   | 
  3   | const cliente = { nome: 'Maria Silva', email: 'maria@example.com', cep: '01310-100' };
  4   | const mochila = [{ produtoId: 'P005', quantidade: 1 }];
  5   | 
  6   | // Uma única função local evita repetir coleta de evidência em cada chamada.
  7   | // Não calcula o esperado: as tabelas abaixo vêm dos requisitos documentados.
  8   | async function post(request: APIRequestContext, info: TestInfo, endpoint: string, data: unknown) {
  9   |   const response = await request.post(endpoint, { data, headers: { 'Content-Type': 'application/json' } });
  10  |   const text = await response.text();
  11  |   await info.attach(`HTTP-${info.attachments.length + 1}`, {
  12  |     body: JSON.stringify({ metodo: 'POST', url: response.url(), requisicao: data, status: response.status(), resposta: text }, null, 2),
  13  |     contentType: 'application/json',
  14  |   });
  15  |   expect(response.status(), 'Ambiente deve permitir executar o contrato funcional').not.toBe(403);
  16  |   expect(response.status()).toBeLessThan(500);
  17  |   expect(response.headers()['content-type']).toContain('application/json');
  18  |   return { status: response.status(), body: JSON.parse(text) };
  19  | }
  20  | 
  21  | const calculations = [
  22  |   { id: 'CT-001', nome: 'D01: desconto nos produtos, sem desconto no frete', itens: mochila, cupom: 'BEMVINDO10', subtotal: 100, desconto: 10, frete: 19.9, total: 109.9, faltante: 100 },
  23  |   { id: 'CT-002', nome: 'D02: frete grátis no limite com cupom', itens: [{ produtoId: 'P005', quantidade: 2 }], cupom: 'BEMVINDO10', subtotal: 200, desconto: 20, frete: 0, total: 180, faltante: 0 },
  24  |   { id: 'CT-003', nome: 'D03: frete pago abaixo do limite', itens: [{ produtoId: 'P002', quantidade: 1 }, { produtoId: 'P001', quantidade: 1 }], cupom: undefined, subtotal: 199.8, desconto: 0, frete: 19.9, total: 219.7, faltante: 0.2 },
  25  |   { id: 'CT-004', nome: 'D04: frete grátis no limite sem cupom', itens: [{ produtoId: 'P005', quantidade: 2 }], cupom: undefined, subtotal: 200, desconto: 0, frete: 0, total: 200, faltante: 0 },
  26  |   { id: 'CT-005', nome: 'D06: frete considera subtotal antes do desconto', itens: [{ produtoId: 'P005', quantidade: 1 }, { produtoId: 'P008', quantidade: 1 }, { produtoId: 'P001', quantidade: 1 }], cupom: 'BEMVINDO10', subtotal: 209.9, desconto: 20.99, frete: 0, total: 188.91, faltante: 0 },
  27  |   { id: 'CT-006', nome: 'minúsculas', itens: mochila, cupom: 'bemvindo10', subtotal: 100, desconto: 10, frete: 19.9, total: 109.9, faltante: 100 },
  28  |   { id: 'CT-006', nome: 'caixa mista e espaços externos', itens: mochila, cupom: '  BeMvInDo10  ', subtotal: 100, desconto: 10, frete: 19.9, total: 109.9, faltante: 100 },
  29  | ];
  30  | 
  31  | for (const c of calculations) {
  32  |   test(`${c.id} API — ${c.nome}`, async ({ request }, info) => {
  33  |     const data = { itens: c.itens, ...(c.cupom === undefined ? {} : { cupom: c.cupom }) };
  34  |     const r = await post(request, info, '/api/carrinho/calcular', data);
  35  |     expect(r.status).toBe(200);
> 36  |     expect.soft(r.body).toMatchObject({ subtotal: c.subtotal, desconto: c.desconto, frete: c.frete, freteGratis: c.frete === 0, total: c.total, valorFaltanteFreteGratis: c.faltante });
      |                         ^ Error: expect(received).toMatchObject(expected)
  37  |     expect(r.body.itens).toHaveLength(c.itens.length);
  38  |     for (const item of c.itens) expect(r.body.itens).toEqual(expect.arrayContaining([expect.objectContaining(item)]));
  39  |     if (c.cupom !== undefined) expect.soft(r.body.cupom).toMatchObject({ aplicado: true });
  40  |   });
  41  | }
  42  | 
  43  | for (const c of [
  44  |   { cupom: 'NAOEXISTE', mensagem: 'Cupom inválido.', codigo: 'CUPOM_INVALIDO' },
  45  |   { cupom: 'VERAO2026', mensagem: 'Cupom expirado.', codigo: 'CUPOM_EXPIRADO' },
  46  | ]) {
  47  |   test(`CT-007 / CT-014 API — ${c.cupom}: cálculo 200, pedido 422`, async ({ request }, info) => {
  48  |     const data = { itens: mochila, cupom: c.cupom };
  49  |     const calculation = await post(request, info, '/api/carrinho/calcular', data);
  50  |     expect.soft(calculation.status).toBe(200);
  51  |     expect.soft(calculation.body).toMatchObject({ subtotal: 100, desconto: 0, frete: 19.9, total: 119.9, cupom: { aplicado: false, mensagem: c.mensagem } });
  52  |     const order = await post(request, info, '/api/pedidos', { ...data, cliente });
  53  |     expect(order.status).toBe(422);
  54  |     expect(order.body.erro).toMatchObject({ codigo: c.codigo, mensagem: expect.any(String) });
  55  |   });
  56  | }
  57  | 
  58  | for (const quantidade of [1, 5, 6]) {
  59  |   test(`CT-012 API — quantidade ${quantidade} no cálculo e pedido`, async ({ request }, info) => {
  60  |     const itens = [{ produtoId: 'P001', quantidade }];
  61  |     for (const endpoint of ['/api/carrinho/calcular', '/api/pedidos']) {
  62  |       const data = endpoint === '/api/pedidos' ? { itens, cliente } : { itens };
  63  |       const r = await post(request, info, endpoint, data);
  64  |       if (quantidade === 6) {
  65  |         expect.soft(r.status).toBe(422);
  66  |         expect.soft(r.body.erro).toMatchObject({ codigo: 'QUANTIDADE_MAXIMA_EXCEDIDA', mensagem: expect.any(String) });
  67  |       } else {
  68  |         expect.soft(r.status).toBe(endpoint === '/api/pedidos' ? 201 : 200);
  69  |         const expected = quantidade === 1 ? { subtotal: 59.9, desconto: 0, frete: 19.9, total: 79.8, freteGratis: false, valorFaltanteFreteGratis: 140.1 } : { subtotal: 299.5, desconto: 0, frete: 0, total: 299.5, freteGratis: true, valorFaltanteFreteGratis: 0 };
  70  |         expect.soft(r.body).toMatchObject(expected);
  71  |         expect.soft(r.body.itens).toEqual([expect.objectContaining({ produtoId: 'P001', quantidade })]);
  72  |         if (endpoint === '/api/pedidos') {
  73  |           expect.soft(r.body.numero).toMatch(/^VZ-\d{6}$/);
  74  |           expect.soft(r.body.criadoEm).toEqual(expect.any(String));
  75  |           expect.soft(r.body.cliente).toMatchObject({ nome: cliente.nome, email: cliente.email });
  76  |         }
  77  |       }
  78  |     }
  79  |   });
  80  | }
  81  | 
  82  | for (const c of [
  83  |   { nome: 'lista vazia', itens: [], codigo: 'ITENS_OBRIGATORIOS' },
  84  |   { nome: 'produto duplicado', itens: [{ produtoId: 'P005', quantidade: 1 }, { produtoId: 'P005', quantidade: 1 }], codigo: 'ITEM_DUPLICADO' },
  85  |   { nome: 'quantidade fracionária', itens: [{ produtoId: 'P005', quantidade: 1.5 }], codigo: 'QUANTIDADE_INVALIDA' },
  86  | ]) {
  87  |   test(`CT-019 API — ${c.nome}`, async ({ request }, info) => {
  88  |     const r = await post(request, info, '/api/carrinho/calcular', { itens: c.itens });
  89  |     expect(r.status).toBe(422);
  90  |     expect(r.body.erro).toMatchObject({ codigo: c.codigo, mensagem: expect.any(String) });
  91  |   });
  92  | }
  93  | 
  94  | test('CT-016 API — rejeitar nome sem sobrenome', async ({ request }, info) => {
  95  |   const r = await post(request, info, '/api/pedidos', { itens: mochila, cliente: { ...cliente, nome: 'Maria' } });
  96  |   expect(r.status).toBe(422);
  97  |   expect(r.body.erro).toMatchObject({ codigo: 'DADOS_INVALIDOS', mensagem: expect.any(String) });
  98  |   expect(r.body.erro.campos).toBeDefined();
  99  | });
  100 | 
```