# sbseg26-mc1.github.io

Site do **Minicurso 1 do SBSeg 2026**, "Inteligência Artificial aplicada à
Resposta a Incidentes", publicado em <https://sbseg26-mc1.github.io/>.

O site reúne a visão geral do minicurso, o roteiro das três práticas e um
catálogo consultável das ferramentas, repositórios, modelos e padrões citados no
capítulo.

## Estrutura

```
index.html               Início: tese, pipeline, números e trilhas por perfil
catalogo.html            Catálogo de ferramentas e repositórios, com busca e filtros
praticas.html            As três práticas, com objetivos e artefatos de saída
sobre.html               Resumo, autores, conclusões, leituras e como citar
assets/css/site.css      Folha de estilo única
assets/js/site.js        Tema claro e escuro, menu em telas pequenas
assets/js/catalogo.js    Busca e filtros do catálogo
assets/img/favicon.svg   Marca do site
docs/superpowers/specs/  Documento de especificação do site
```

## Rodar localmente

Não há etapa de build nem dependências para instalar. Qualquer servidor estático
serve:

```bash
python3 -m http.server 8000
```

Depois, abra <http://localhost:8000>.

Abrir os arquivos diretamente pelo sistema de arquivos (`file://`) também
funciona, porque nenhuma página faz requisições de rede além das fontes.

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

Depois de adicionar ou remover itens, atualize o número em
`.catalog-group__count` do grupo e o total no elemento `#contagem`. Ambos são
recalculados pelo JavaScript quando há filtro ativo, mas o valor escrito no HTML
é o que aparece sem JavaScript.

## Convenções

- Todo o texto do site está em português, em UTF-8, com acentuação completa.
- Sem travessões: use vírgula, dois-pontos, parênteses ou ponto.
- Nenhum texto de conteúdo abaixo de 16px.
- Só entram links presentes no capítulo ou endereços oficiais verificáveis. Onde
  não existe repositório público, o cartão informa onde o trabalho foi publicado,
  em vez de apontar para um endereço inventado.

## O PDF do capítulo

O arquivo `minicurso.pdf` está no `.gitignore` e não é versionado aqui. O
capítulo será publicado no livro de minicursos do SBSeg 2026, pela Sociedade
Brasileira de Computação.

## Licença

Apache 2.0. Veja o arquivo [LICENSE](LICENSE).
