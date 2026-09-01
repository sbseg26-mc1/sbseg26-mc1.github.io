# Site trilíngue do Minicurso 1 do SBSeg 2026

**Data:** 2026-08-31
**Repositório:** `sbseg26-mc1/sbseg26-mc1.github.io`
**Publicação:** https://sbseg26-mc1.github.io/
**Documento anterior:** `2026-08-05-site-minicurso-sbseg26-design.md`

## 1. Objetivo

Publicar o site do minicurso em três idiomas, português do Brasil, inglês e
espanhol, com tradução integral do conteúdo. Um leitor anglófono ou
hispanofalante deve ler o site inteiro no seu idioma, incluindo as descrições
das 42 ferramentas do catálogo, sem encontrar trechos remanescentes em
português.

A motivação é o alcance: o SBSeg recebe participantes de fora do Brasil, e o
catálogo de ferramentas tem valor de consulta independente do evento, para
equipes de CSIRT e SOC de toda a América Latina e além.

## 2. Restrições

As cinco restrições do documento de 2026-08-05 continuam valendo integralmente.
Esta especificação acrescenta quatro:

6. **Sem etapa de build, ainda.** A decisão de arquitetura desta especificação
   foi tomada para preservar a restrição 1 do documento original. Nenhum
   gerador, nenhum template, nenhuma GitHub Action. O que está no repositório é
   exatamente o que o navegador recebe.
7. **Nenhuma duplicação de CSS ou JavaScript.** Os três idiomas compartilham os
   mesmos `assets/`. A tradução acontece apenas em arquivos HTML.
8. **Sem travessão em nenhum idioma.** A regra vale igualmente para o inglês,
   onde o travessão é de uso corrente. Usar vírgula, dois-pontos, parênteses,
   ponto ou reescrever a frase.
9. **Acentuação impecável nos três idiomas.** Português e espanhol com
   acentuação completa, espanhol com `¿` e `¡` de abertura, tudo em UTF-8.

## 3. Arquitetura

### 3.1 Decisão central

Três árvores estáticas independentes, uma por idioma, servindo assets
compartilhados.

```
/                        pt-BR, na raiz, preserva as URLs já publicadas
  index.html
  catalogo.html
  praticas.html
  sobre.html
/en/                     en
  index.html
  catalogo.html
  praticas.html
  sobre.html
/es/                     es
  index.html
  catalogo.html
  praticas.html
  sobre.html
/assets/                 compartilhado pelas três árvores
  css/site.css
  js/site.js
  js/catalogo.js
  img/favicon.svg
```

**Por que três árvores e não troca de texto por JavaScript.** A alternativa
óbvia, um HTML por página com dicionários JSON e atributos `data-i18n`,
contradiz dois princípios que sustentam o projeto desde o documento original: o
site funciona com o JavaScript desligado, e cada página é indexável por
buscadores. Além disso, com o idioma guardado em `localStorage` a URL deixa de
identificar o idioma, e um link compartilhado em espanhol abre em português para
quem o recebe. Em material acadêmico, que será citado e divulgado por link, isso
é uma perda concreta.

**O preço aceito.** Cada correção de conteúdo precisa ser aplicada em três
arquivos. O preço é proporcional à frequência de edição, e o conteúdo deste site
acompanha um capítulo de livro já escrito, portanto é estável. Se em algum
momento futuro o conteúdo passar a mudar com frequência, a saída é um gerador
local cuja saída seja commitada, o que preserva o GitHub Pages servindo estático
puro. Essa porta fica aberta, mas não se abre agora.

### 3.2 Nomes de arquivo

Os nomes de arquivo são idênticos nas três árvores. `/en/catalogo.html`, não
`/en/catalog.html`.

A consequência é que o bloco de navegação principal é o mesmo HTML nas três
árvores, mudando apenas os rótulos visíveis, e que o seletor de idioma é uma
troca de prefixo em vez de um mapa de equivalência página a página. Menos
superfície para erro, ao custo de uma palavra em português na URL em inglês.

### 3.3 Caminhos

Todos os caminhos são relativos, nunca absolutos.

| Origem | CSS | Favicon | Página irmã | Outro idioma |
| --- | --- | --- | --- | --- |
| `/index.html` | `assets/css/site.css` | `assets/img/favicon.svg` | `catalogo.html` | `en/index.html` |
| `/en/index.html` | `../assets/css/site.css` | `../assets/img/favicon.svg` | `catalogo.html` | `../index.html`, `../es/index.html` |
| `/es/index.html` | `../assets/css/site.css` | `../assets/img/favicon.svg` | `catalogo.html` | `../index.html`, `../en/index.html` |

O motivo de evitar caminhos absolutos é que o README promete que abrir os
arquivos por `file://` funciona, e um `/assets/css/site.css` quebra essa
promessa. O arquivo `.nojekyll`, já presente na raiz, garante que o GitHub Pages
sirva as subpastas sem processamento do Jekyll.

## 4. Cabeçalho de cada página

Cada arquivo declara o próprio idioma e aponta para os dois irmãos. Modelo,
usando `/en/catalogo.html` como exemplo:

```html
<html lang="en">
...
<title>Catalog: SBSeg 2026 Short Course 1</title>
<meta name="description" content="...">
<link rel="canonical" href="https://sbseg26-mc1.github.io/en/catalogo.html">
<link rel="alternate" hreflang="pt-BR"     href="https://sbseg26-mc1.github.io/catalogo.html">
<link rel="alternate" hreflang="en"        href="https://sbseg26-mc1.github.io/en/catalogo.html">
<link rel="alternate" hreflang="es"        href="https://sbseg26-mc1.github.io/es/catalogo.html">
<link rel="alternate" hreflang="x-default" href="https://sbseg26-mc1.github.io/catalogo.html">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="pt_BR">
<meta property="og:locale:alternate" content="es_ES">
<meta property="og:url" content="https://sbseg26-mc1.github.io/en/catalogo.html">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
```

Valores de `lang`: `pt-BR`, `en`, `es`. Valores de `og:locale`: `pt_BR`,
`en_US`, `es_ES`.

O conjunto `hreflang` é idêntico nos três arquivos de uma mesma página, e
`x-default` sempre aponta para a versão em português na raiz. As URLs de
`hreflang` e `canonical` são absolutas, porque é o único formato que os
buscadores aceitam. Todos os demais links continuam relativos.

`title`, `meta name="description"`, `og:title` e `og:description` são
traduzidos.

## 5. Seletor de idioma

Um grupo de três links, inserido no `.header-actions` antes dos botões de tema e
de menu. Trocar de idioma é seguir um link, sem JavaScript envolvido.

Em `/catalogo.html`:

```html
<nav class="lang" aria-label="Idioma">
  <a href="catalogo.html"    hreflang="pt-BR" aria-current="true" title="Português">PT</a>
  <a href="en/catalogo.html" hreflang="en"    title="English">EN</a>
  <a href="es/catalogo.html" hreflang="es"    title="Español">ES</a>
</nav>
```

Em `/en/catalogo.html`:

```html
<nav class="lang" aria-label="Language">
  <a href="../catalogo.html"  hreflang="pt-BR" title="Português">PT</a>
  <a href="catalogo.html"     hreflang="en"    aria-current="true" title="English">EN</a>
  <a href="../es/catalogo.html" hreflang="es"  title="Español">ES</a>
</nav>
```

O idioma corrente recebe `aria-current="true"` e um estilo de estado ativo. O
`aria-label` do `nav` é traduzido; os rótulos `PT`, `EN` e `ES` são iguais nos
três idiomas, e o `title` dá o nome do idioma por extenso.

Estilo novo em `assets/css/site.css`, cerca de 20 linhas, respeitando o piso de
16px de conteúdo e mantendo o cabeçalho legível em telas estreitas. O seletor
fica visível em todas as larguras, inclusive quando o menu principal está
recolhido, porque trocar de idioma é uma ação de primeira ordem para quem não lê
português.

## 6. Textos gerados por JavaScript

Duas ilhas de português vivem hoje dentro do JavaScript, que é compartilhado
pelas três árvores e portanto não pode conter texto de nenhum idioma.

**Em `assets/js/site.js`:** o `aria-label` do botão de tema, hoje escrito como
`"Ativar modo claro"` e `"Ativar modo escuro"`.

**Em `assets/js/catalogo.js`:** a contagem de resultados, hoje `"N itens no
catálogo"`, `"1 item encontrado"` e `"N itens encontrados"`, e o contador de cada
grupo, hoje `"N itens"` e `"N de M"`.

A solução é mover essas strings para atributos `data-*` no HTML, que já é
traduzido por árvore. O JavaScript lê os templates e substitui os marcadores.

No botão de tema:

```html
<button class="icon-btn theme-toggle" type="button"
        aria-label="Switch to dark mode"
        data-rotulo-claro="Switch to light mode"
        data-rotulo-escuro="Switch to dark mode">
```

No elemento de contagem do catálogo, que é único na página e por isso concentra
todos os templates do catálogo:

```html
<p id="contagem" aria-live="polite"
   data-tpl-total="{n} items in the catalog"
   data-tpl-um="1 item found"
   data-tpl-varios="{n} items found"
   data-tpl-grupo-total="{n} items"
   data-tpl-grupo-parcial="{n} of {total}">42 items in the catalog</p>
```

Os marcadores são `{n}` e `{total}`. Quando um atributo está ausente, o
JavaScript usa como padrão o texto em português de hoje, de modo que a mudança
não quebra nenhuma página que ainda não tenha sido atualizada.

O texto escrito entre as tags continua sendo o valor correto sem JavaScript, e é
o que aparece na primeira pintura e na impressão.

**Nomenclatura.** Os nomes de atributos, variáveis e funções permanecem em
português nas três árvores: `data-termos`, `data-categoria`, `data-estagio`,
`normalizar`, `cartoes`. O código é escrito em português; apenas o conteúdo muda
de idioma. Traduzir identificadores multiplicaria o JavaScript por três, que é
exatamente o que a restrição 7 proíbe.

## 7. Política de tradução

| Item | Tratamento |
| --- | --- |
| Nomes de ferramentas, modelos e padrões | Nunca traduzidos. Presidio, MITRE ATT&CK, e assim por diante |
| Nomes de instituições | Preservados no original, com glosa no idioma da página quando a sigla não for autoexplicativa |
| Nome do evento | "SBSeg 2026" preservado; a expansão do nome recebe glosa no idioma da página |
| Título do minicurso | Traduzido no `h1` e no `title`; o título oficial em português fica registrado na página Sobre |
| Referência de "Como citar" | Permanece em português nas três árvores, porque é a citação formal do capítulo publicado |
| Termos técnicos | Termo consagrado do idioma: incident response, playbook, pseudonymization; respuesta a incidentes, pseudonimización |
| Rótulos EC1, EC2, EC3 | Preservados como identificadores; o nome do estudo de caso é traduzido |
| `data-termos` dos 42 cartões | Reescritos no idioma da árvore, sem acento |

### 7.1 Sobre o `data-termos`

O índice de busca do catálogo é montado em `catalogo.js` a partir de
`cartao.textContent + " " + cartao.dataset.termos`, normalizado sem acentos.
Traduzir apenas o texto visível deixaria a busca funcionando por acidente para
nomes próprios, que não mudam, e falhando para qualquer conceito. Nenhum teste
de carregamento de página revelaria isso.

Portanto, em cada árvore, o `data-termos` de cada cartão é reescrito com os
sinônimos e variantes do idioma daquela árvore, sem acentuação, como já é a
convenção em português.

Os atributos `data-categoria` e `data-estagio` são identificadores de filtro, não
texto, e permanecem idênticos nas três árvores: `grupo`, `privacidade`,
`modelos`, `soar`, `padroes`, `dados`, `ec1`, `ec2`, `ec3`.

## 8. Alterações em arquivos existentes

| Arquivo | Alteração |
| --- | --- |
| `index.html`, `catalogo.html`, `praticas.html`, `sobre.html` | Seletor de idioma, bloco `hreflang` e `canonical`, `og:locale:alternate`, atributos de template no botão de tema e no `#contagem` |
| `assets/css/site.css` | Bloco novo para `.lang`, incluindo estado ativo e comportamento em telas estreitas |
| `assets/js/site.js` | Ler `data-rotulo-claro` e `data-rotulo-escuro`, com o texto atual como padrão |
| `assets/js/catalogo.js` | Ler os cinco `data-tpl-*` do `#contagem` e substituir `{n}` e `{total}`, com os textos atuais como padrão |
| `README.md` | Nova estrutura de diretórios, regra de editar nos três idiomas, e a observação sobre `data-termos` |

Arquivos novos: oito páginas HTML em `/en/` e `/es/`.

## 9. Verificação

Verificação automatizada por `grep`, cobrindo as doze páginas:

1. As doze páginas existem, quatro em cada árvore.
2. Cada página declara o `lang` da sua árvore.
3. Cada página traz os quatro `hreflang` e um `canonical`, apontando para as
   URLs corretas da sua própria página.
4. Cada `catalogo.html` traz 42 elementos `class="tool"` e 6 elementos
   `catalog-group__count`.
5. Nenhum arquivo contém travessão.
6. Nenhuma página em subpasta referencia `assets/` sem o prefixo `../`.
7. Nenhuma página em subpasta contém as palavras de interface em português que
   deveriam ter sido traduzidas, verificado por uma lista de sentinelas.

Depois disso, inspeção visual das doze páginas servidas por
`python3 -m http.server 8000`, conferindo em cada uma: o seletor de idioma leva
à página equivalente, a busca do catálogo encontra resultados por termos do
idioma, os contadores de grupo aparecem traduzidos ao filtrar, e o cabeçalho se
mantém legível em largura de telefone.

## 10. Ordem de trabalho

1. **Base compartilhada.** Estilo `.lang` no CSS, leitura de templates nos dois
   arquivos JavaScript, e as quatro páginas em português recebendo seletor,
   `hreflang`, `canonical` e atributos de template. Ao fim deste passo a árvore
   em português funciona exatamente como hoje, mais o seletor de idioma, cujos
   links para `/en/` e `/es/` ainda não resolvem.
2. **Árvore `/en/`.** Quatro páginas traduzidas.
3. **Árvore `/es/`.** Quatro páginas traduzidas.
4. **README.**
5. **Verificação** automatizada e inspeção visual.

## 11. Fora de escopo

- Detecção automática do idioma do navegador, por sugestão ou por
  redirecionamento. O seletor manual é o único mecanismo. A decisão é
  deliberada: redirecionar surpreende quem quer o português e atrapalha quem
  compartilha o link da raiz.
- Página 404 traduzida. Não existe página 404 hoje.
- Tradução do código, dos comentários do código e dos documentos do repositório,
  incluindo esta especificação e o README, que permanecem em português.
- Gerador local com saída commitada. Registrado na seção 3.1 como a saída
  disponível caso a duplicação se torne cara, mas não faz parte deste trabalho.
