import { test, expect, type APIRequestContext, type TestInfo } from '@playwright/test';

const cliente = { nome: 'Maria Silva', email: 'maria@example.com', cep: '01310-100' };
const mochila = [{ produtoId: 'P005', quantidade: 1 }];

// Uma única função local evita repetir coleta de evidência em cada chamada.
// Não calcula o esperado: as tabelas abaixo vêm dos requisitos documentados.
async function post(request: APIRequestContext, info: TestInfo, endpoint: string, data: unknown) {
  const response = await request.post(endpoint, { data, headers: { 'Content-Type': 'application/json' } });
  const text = await response.text();
  await info.attach(`HTTP-${info.attachments.length + 1}`, {
    body: JSON.stringify({ metodo: 'POST', url: response.url(), requisicao: data, status: response.status(), resposta: text }, null, 2),
    contentType: 'application/json',
  });
  expect(response.status(), 'Ambiente deve permitir executar o contrato funcional').not.toBe(403);
  expect(response.status()).toBeLessThan(500);
  expect(response.headers()['content-type']).toContain('application/json');
  return { status: response.status(), body: JSON.parse(text) };
}

const calculations = [
  { id: 'CT-001', nome: 'D01: desconto nos produtos, sem desconto no frete', itens: mochila, cupom: 'BEMVINDO10', subtotal: 100, desconto: 10, frete: 19.9, total: 109.9, faltante: 100 },
  { id: 'CT-002', nome: 'D02: frete grátis no limite com cupom', itens: [{ produtoId: 'P005', quantidade: 2 }], cupom: 'BEMVINDO10', subtotal: 200, desconto: 20, frete: 0, total: 180, faltante: 0 },
  { id: 'CT-003', nome: 'D03: frete pago abaixo do limite', itens: [{ produtoId: 'P002', quantidade: 1 }, { produtoId: 'P001', quantidade: 1 }], cupom: undefined, subtotal: 199.8, desconto: 0, frete: 19.9, total: 219.7, faltante: 0.2 },
  { id: 'CT-004', nome: 'D04: frete grátis no limite sem cupom', itens: [{ produtoId: 'P005', quantidade: 2 }], cupom: undefined, subtotal: 200, desconto: 0, frete: 0, total: 200, faltante: 0 },
  { id: 'CT-005', nome: 'D06: frete considera subtotal antes do desconto', itens: [{ produtoId: 'P005', quantidade: 1 }, { produtoId: 'P008', quantidade: 1 }, { produtoId: 'P001', quantidade: 1 }], cupom: 'BEMVINDO10', subtotal: 209.9, desconto: 20.99, frete: 0, total: 188.91, faltante: 0 },
  { id: 'CT-006', nome: 'minúsculas', itens: mochila, cupom: 'bemvindo10', subtotal: 100, desconto: 10, frete: 19.9, total: 109.9, faltante: 100 },
  { id: 'CT-006', nome: 'caixa mista e espaços externos', itens: mochila, cupom: '  BeMvInDo10  ', subtotal: 100, desconto: 10, frete: 19.9, total: 109.9, faltante: 100 },
];

for (const c of calculations) {
  test(`${c.id} API — ${c.nome}`, async ({ request }, info) => {
    const data = { itens: c.itens, ...(c.cupom === undefined ? {} : { cupom: c.cupom }) };
    const r = await post(request, info, '/api/carrinho/calcular', data);
    expect(r.status).toBe(200);
    expect.soft(r.body).toMatchObject({ subtotal: c.subtotal, desconto: c.desconto, frete: c.frete, freteGratis: c.frete === 0, total: c.total, valorFaltanteFreteGratis: c.faltante });
    expect(r.body.itens).toHaveLength(c.itens.length);
    for (const item of c.itens) expect(r.body.itens).toEqual(expect.arrayContaining([expect.objectContaining(item)]));
    if (c.cupom !== undefined) expect.soft(r.body.cupom).toMatchObject({ aplicado: true });
  });
}

for (const c of [
  { cupom: 'NAOEXISTE', mensagem: 'Cupom inválido.', codigo: 'CUPOM_INVALIDO' },
  { cupom: 'VERAO2026', mensagem: 'Cupom expirado.', codigo: 'CUPOM_EXPIRADO' },
]) {
  test(`CT-007 / CT-014 API — ${c.cupom}: cálculo 200, pedido 422`, async ({ request }, info) => {
    const data = { itens: mochila, cupom: c.cupom };
    const calculation = await post(request, info, '/api/carrinho/calcular', data);
    expect.soft(calculation.status).toBe(200);
    expect.soft(calculation.body).toMatchObject({ subtotal: 100, desconto: 0, frete: 19.9, total: 119.9, cupom: { aplicado: false, mensagem: c.mensagem } });
    const order = await post(request, info, '/api/pedidos', { ...data, cliente });
    expect(order.status).toBe(422);
    expect(order.body.erro).toMatchObject({ codigo: c.codigo, mensagem: expect.any(String) });
  });
}

for (const quantidade of [1, 5, 6]) {
  test(`CT-012 API — quantidade ${quantidade} no cálculo e pedido`, async ({ request }, info) => {
    const itens = [{ produtoId: 'P001', quantidade }];
    for (const endpoint of ['/api/carrinho/calcular', '/api/pedidos']) {
      const data = endpoint === '/api/pedidos' ? { itens, cliente } : { itens };
      const r = await post(request, info, endpoint, data);
      if (quantidade === 6) {
        expect.soft(r.status).toBe(422);
        expect.soft(r.body.erro).toMatchObject({ codigo: 'QUANTIDADE_MAXIMA_EXCEDIDA', mensagem: expect.any(String) });
      } else {
        expect.soft(r.status).toBe(endpoint === '/api/pedidos' ? 201 : 200);
        const expected = quantidade === 1 ? { subtotal: 59.9, desconto: 0, frete: 19.9, total: 79.8, freteGratis: false, valorFaltanteFreteGratis: 140.1 } : { subtotal: 299.5, desconto: 0, frete: 0, total: 299.5, freteGratis: true, valorFaltanteFreteGratis: 0 };
        expect.soft(r.body).toMatchObject(expected);
        expect.soft(r.body.itens).toEqual([expect.objectContaining({ produtoId: 'P001', quantidade })]);
        if (endpoint === '/api/pedidos') {
          expect.soft(r.body.numero).toMatch(/^VZ-\d{6}$/);
          expect.soft(r.body.criadoEm).toEqual(expect.any(String));
          expect.soft(r.body.cliente).toMatchObject({ nome: cliente.nome, email: cliente.email });
        }
      }
    }
  });
}

for (const c of [
  { nome: 'lista vazia', itens: [], codigo: 'ITENS_OBRIGATORIOS' },
  { nome: 'produto duplicado', itens: [{ produtoId: 'P005', quantidade: 1 }, { produtoId: 'P005', quantidade: 1 }], codigo: 'ITEM_DUPLICADO' },
  { nome: 'quantidade fracionária', itens: [{ produtoId: 'P005', quantidade: 1.5 }], codigo: 'QUANTIDADE_INVALIDA' },
]) {
  test(`CT-019 API — ${c.nome}`, async ({ request }, info) => {
    const r = await post(request, info, '/api/carrinho/calcular', { itens: c.itens });
    expect(r.status).toBe(422);
    expect(r.body.erro).toMatchObject({ codigo: c.codigo, mensagem: expect.any(String) });
  });
}

test('CT-016 API — rejeitar nome sem sobrenome', async ({ request }, info) => {
  const r = await post(request, info, '/api/pedidos', { itens: mochila, cliente: { ...cliente, nome: 'Maria' } });
  expect(r.status).toBe(422);
  expect(r.body.erro).toMatchObject({ codigo: 'DADOS_INVALIDOS', mensagem: expect.any(String) });
  expect(r.body.erro.campos).toBeDefined();
});
