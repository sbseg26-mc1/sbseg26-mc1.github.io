# sbseg26-mc1.github.io

Site do **Minicurso 1 do SBSeg 2026**, "Inteligência Artificial aplicada à
Resposta a Incidentes", publicado em <https://sbseg26-mc1.github.io/>.

O site reúne a visão geral do minicurso, o roteiro das três práticas e um
catálogo consultável das ferramentas, repositórios, modelos e padrões citados no
capítulo. Está publicado em três idiomas: português do Brasil, inglês e
espanhol.

## Estrutura

```
index.html               Início: tese, pipeline, números e trilhas por perfil
catalogo.html            Catálogo de ferramentas e repositórios, com busca e filtros
praticas.html            As três práticas, com objetivos e artefatos de saída
sobre.html               Resumo, autores, conclusões, leituras e como citar
en/                      As mesmas quatro páginas em inglês
es/                      As mesmas quatro páginas em espanhol
assets/css/site.css      Folha de estilo única, compartilhada pelos três idiomas
assets/js/site.js        Tema claro e escuro, menu em telas pequenas
assets/js/catalogo.js    Busca e filtros do catálogo
assets/img/favicon.svg   Marca do site
assets/minicurso-sbseg2026.pdf   O capítulo em PDF, servido pelo site
docs/superpowers/specs/  Documentos de especificação do site
```

Os nomes de arquivo são idênticos nas três árvores. `/en/catalogo.html`, não
`/en/catalog.html`. Assim o bloco de navegação é o mesmo HTML em toda parte,
mudando apenas os rótulos visíveis, e o seletor de idioma é uma troca de
prefixo, sem mapa de equivalência página a página.

## Rodar localmente

Não há etapa de build nem dependências para instalar. Qualquer servidor estático
serve:

```bash
python3 -m http.server 8000
```

Depois, abra <http://localhost:8000>.

Abrir os arquivos diretamente pelo sistema de arquivos (`file://`) também
funciona, porque nenhuma página faz requisições de rede além das fontes e todos
os caminhos internos são relativos.

## Os três idiomas

Cada idioma é uma árvore estática independente. Não há JavaScript envolvido na
troca de idioma: o seletor no cabeçalho é um grupo de três links.

**Ao editar qualquer conteúdo, aplique a mudança nas três árvores.** É o preço
consciente desta arquitetura, aceito porque o conteúdo acompanha um capítulo de
livro já escrito e portanto é estável. A alternativa, trocar texto por
JavaScript, quebraria o funcionamento sem JavaScript, a indexação por idioma e a
possibilidade de compartilhar um link em espanhol ou inglês.

Ao criar ou mover uma página, confira em cada um dos três arquivos:

| Item | O que precisa estar certo |
| --- | --- |
| `<html lang>` | `pt-BR`, `en` ou `es` |
| `<link rel="canonical">` | URL absoluta da própria página |
| Os quatro `hreflang` | `pt-BR`, `en`, `es` e `x-default`, com URLs absolutas; `x-default` sempre aponta para a versão em português |
| `og:locale` | `pt_BR`, `en_US` ou `es_ES`, com os outros dois em `og:locale:alternate` |
| Caminhos de `assets/` | `assets/…` na raiz, `../assets/…` em `en/` e `es/` |
| Seletor de idioma | Três links, com `aria-current="true"` apenas no idioma corrente |

### Textos que o JavaScript escreve

O JavaScript é compartilhado pelas três árvores e por isso não contém texto de
idioma algum. Os textos que ele escreve na página vêm de atributos `data-*` no
HTML:

| Atributo | Onde | Para que serve |
| --- | --- | --- |
| `data-rotulo-claro`, `data-rotulo-escuro` | Botão `.theme-toggle` | `aria-label` do botão de tema |
| `data-tpl-total`, `data-tpl-um`, `data-tpl-varios` | `#contagem` | Contagem de resultados do catálogo |
| `data-tpl-grupo-total`, `data-tpl-grupo-parcial` | `#contagem` | Contador de cada grupo do catálogo |

Os marcadores são `{n}` e `{total}`. Quando um atributo falta, o JavaScript usa
o texto em português como padrão, de modo que uma página ainda não atualizada
degrada em vez de exibir `undefined`.

## Editar o catálogo

Os itens do catálogo são HTML estático em `catalogo.html`. Não há arquivo de
dados separado, e isso é deliberado: o catálogo continua completo quando o
JavaScript está desligado, é indexável por buscadores e imprime bem.

Para adicionar um item, copie um bloco `<article class="tool">` existente dentro
do grupo apropriado e ajuste:

| Atributo         | Para que serve                                                        |
| ---------------- | --------------------------------------------------------------------- |
| `data-categoria` | Um de `grupo`, `privacidade`, `modelos`, `soar`, `padroes`, `dados`.  |
| `data-estagio`   | Estágios do pipeline, separados por espaço: `ec1`, `ec2`, `ec3`.      |
| `data-termos`    | Palavras extras de busca, sem acento, que não aparecem no texto visível. |

`data-categoria` e `data-estagio` são identificadores de filtro, não texto:
permanecem **idênticos** nas três árvores. Traduzi-los faria os chips de filtro
deixarem de casar com os cartões.

`data-termos`, ao contrário, é **reescrito no idioma de cada árvore**, sempre sem
acento. O índice de busca é montado a partir de `textContent + data-termos`, de
modo que traduzir só o texto visível deixaria a busca funcionando por acidente
para nomes próprios e falhando para qualquer conceito, sem que nenhum teste de
carregamento de página revelasse o problema.

Depois de adicionar ou remover itens, atualize o número em
`.catalog-group__count` do grupo e o total no elemento `#contagem`, nos três
idiomas. Ambos são recalculados pelo JavaScript quando há filtro ativo, mas o
valor escrito no HTML é o que aparece sem JavaScript.

## Convenções

- Texto impecável nos três idiomas, em UTF-8: acentuação completa em português e
  espanhol, com `¿` e `¡` de abertura no espanhol.
- Sem travessões, em qualquer idioma, inclusive no inglês: use vírgula,
  dois-pontos, parênteses ou ponto. O traço de intervalo numérico é permitido.
- Nenhum texto de conteúdo abaixo de 16px.
- Nomes de ferramentas, modelos e padrões nunca são traduzidos. Os rótulos
  `EC1`, `EC2` e `EC3` são identificadores e permanecem iguais nos três idiomas.
- A referência de "Como citar" permanece em português nas três árvores, porque é
  a citação formal do capítulo publicado.
- O código, os comentários do código e os documentos do repositório são escritos
  em português. Apenas o conteúdo do site muda de idioma.
- Só entram links presentes no capítulo ou endereços oficiais verificáveis. Onde
  não existe repositório público, o cartão informa onde o trabalho foi publicado,
  em vez de apontar para um endereço inventado.

## O PDF do capítulo

O site serve `assets/minicurso-sbseg2026.pdf`, a versão dos autores do capítulo,
com 50 páginas, em português. Ele é alcançável pelo botão do topo da Home, pelo
botão da página Sobre e por um cartão do catálogo, nas três árvores. Nas versões
em inglês e espanhol o rótulo do link avisa que o capítulo está em português.

O `.gitignore` continua ignorando `*.pdf` e abre exceção apenas para esse
arquivo, de modo que originais de trabalho, como `minicurso_texto.pdf`, seguem
fora do versionamento. Para atualizar o capítulo, sobrescreva o arquivo em
`assets/` mantendo o nome, e os links nas doze páginas continuam válidos.

O capítulo será publicado no livro de minicursos do SBSeg 2026, pela Sociedade
Brasileira de Computação. Quando isso ocorrer, complete o campo de páginas e o
identificador digital na referência da página Sobre, nos três idiomas.

## Licença

Apache 2.0. Veja o arquivo [LICENSE](LICENSE).
