# Site e catálogo do Minicurso 1 do SBSeg 2026

**Data:** 2026-08-05
**Repositório:** `sbseg26-mc1/sbseg26-mc1.github.io`
**Publicação:** https://sbseg26-mc1.github.io/

## 1. Objetivo

Publicar um site estático que sirva de porta de entrada para o minicurso "Inteligência
Artificial aplicada à Resposta a Incidentes" (SBSeg 2026, Capítulo 1) e que funcione,
por si só, como um catálogo consultável de ferramentas, repositórios, modelos e padrões
citados no capítulo.

O público é deliberadamente heterogêneo: estudantes de graduação, docentes,
pesquisadores e profissionais de CSIRT e SOC. O site precisa atender aos quatro perfis
sem diluir o conteúdo, o que se resolve com trilhas de entrada distintas sobre o mesmo
material, e não com quatro versões do material.

## 2. Restrições

1. **Sem etapa de build.** O GitHub Pages serve a raiz do branch padrão. HTML, CSS e
   JavaScript escritos à mão, sem framework, sem empacotador, sem GitHub Actions.
2. **O PDF do capítulo não entra no repositório.** Ele vai para o `.gitignore`. O site,
   portanto, não hospeda nem oferece download do capítulo; aponta para a publicação
   oficial nos anais.

   > **Revisto em 2026-09-01, por decisão dos autores.** O site passa a hospedar
   > `assets/minicurso-sbseg2026.pdf`, a versão dos autores do capítulo, anterior à
   > publicação oficial pela SBC. O `.gitignore` mantém `*.pdf` e abre exceção apenas
   > para esse arquivo, de modo que originais de trabalho continuam fora do
   > versionamento. A indicação da publicação oficial nos anais permanece.
3. **Português impecável.** Acentuação, gramática e pontuação corretas em todo o site.
   Sem travessões.
4. **Sem links inventados.** Só entram URLs presentes no capítulo ou endereços oficiais
   verificáveis. Onde não existe repositório público, o cartão aponta para o artigo.
5. **Legibilidade em tela pequena.** Parte do público consultará pelo celular.

## 3. Arquitetura

```
index.html               Home
catalogo.html            Catálogo de ferramentas e repositórios
praticas.html            As três práticas, passo a passo
sobre.html               Capítulo, autores, leituras, como citar
assets/css/site.css      Design system único
assets/js/site.js        Menu mobile, tema claro/escuro, ano do rodapé
assets/js/catalogo.js    Busca e filtros do catálogo
.nojekyll                Desliga o processamento Jekyll
.gitignore               Ignora minicurso.pdf e artefatos locais
README.md                Como editar e rodar localmente
```

**Decisão central:** os cartões do catálogo são HTML estático anotado com atributos
`data-*`. O JavaScript apenas mostra e esconde nós que já existem no DOM. Consequências:
o catálogo funciona com JavaScript desligado, é indexável por buscadores, imprime bem, e
não há requisição de rede nem estado assíncrono para depurar.

**Dependência externa única:** as fontes Inter e JetBrains Mono, servidas pelo Google
Fonts, com fallback declarado para a pilha de fontes do sistema. Nenhuma outra
biblioteca, CDN ou script de terceiros.

## 4. Sistema visual

Base neutra fria, primária azul-petróleo profundo, e três cores de acento que
identificam os três estudos de caso de forma consistente em todas as páginas:

| Estágio | Estudo de caso | Acento |
| --- | --- | --- |
| EC1 | Pseudonimização de tickets | Verde-azulado |
| EC2 | Classificação de incidentes | Âmbar |
| EC3 | Geração de playbooks | Violeta |

O acento é recurso didático, não decoração: uma etiqueta âmbar no catálogo comunica, sem
texto adicional, que a ferramenta pertence ao estágio de classificação.

Modo claro e escuro por `prefers-color-scheme`, com botão de alternância que persiste a
escolha em `localStorage`. Tipografia fluida com `clamp()`. Transições curtas, suprimidas
sob `prefers-reduced-motion`.

Acessibilidade: contraste mínimo AA, link "pular para o conteúdo", foco visível,
navegação por teclado nos filtros, `aria-pressed` nos botões de filtro e `aria-live` na
contagem de resultados.

## 5. Conteúdo por página

### 5.1 Home (`index.html`)

1. **Hero.** Título, tese do capítulo ("a IA não substitui a resposta a incidentes:
   amplia a capacidade de triagem, análise e documentação"), etiquetas do evento e três
   chamadas para ação.
2. **O pipeline em três estágios.** Seção própria, de largura inteira, logo abaixo do
   hero: ticket bruto, pseudonimização, classificação, playbook, com a validação humana
   marcada entre os estágios. O diagrama é HTML e CSS, com SVG apenas nas setas. A fila
   horizontal precisa de cerca de 860px, e abaixo disso o diagrama empilha na vertical.
   Quem decide é uma container query sobre a largura do próprio componente, e não uma
   media query sobre a janela, porque o diagrama pode ocupar uma coluna bem mais estreita
   do que a tela.
3. **Números que motivam.** Dados extraídos do capítulo: 516.556 notificações ao CERT.br
   em 2024 (1.411 por dia); 48.448 CVEs em 2025; déficit global de 4 milhões de
   profissionais; 35% de omissões e 42% de imprecisões factuais em operação autônoma;
   92,27% de acurácia com Progressive-Hint Prompting e Gemini 2; cerca de 60% com
   modelos abertos locais de 8B a 20B; aceleração superior a 738 vezes no AnonShield.
4. **Por onde começar, pelo seu perfil.** Quatro trilhas curtas (graduação, docência,
   pesquisa, operação em CSIRT/SOC), cada uma com destinos diretos dentro do site.
5. **Prepare o ambiente.** Python, notebooks, sem GPU e sem credenciais de API.
6. **Rodapé.** Licença, autores, repositório.

### 5.2 Catálogo (`catalogo.html`)

Busca por texto somada a filtros por categoria e por estágio do pipeline. Cerca de 37
entradas em seis grupos:

- **Ferramentas do grupo proponente:** AnonShield, AnonLFI 2.0, ANON-LFI, AutoClass-LFI,
  SecLINC, FrameworkPE, ecossistema GT-LFI, HIKARI, repositório do minicurso.
- **Privacidade e anonimização:** Microsoft Presidio, ARX, sdcMicro, CryptoPAn.
- **Modelos e execução local:** Ollama, Transformers, `Davlan/xlm-roberta-base-ner-hrl`,
  `attack-vector/SecureModernBERT-NER`, `paraphrase-MiniLM-L6-v2`, Foundation-Sec-8B,
  `deepseek-r1:14b`, `phi3:14b`, `qwen3:4b`.
- **SOAR e resposta:** Shuffle, TheHive, Cortex, Wazuh, AI4SOAR.
- **Padrões, frameworks e taxonomias:** NIST SP 800-61r3, NIST CSF 2.0, NIST AI RMF,
  NIST SP 1270, FIRST CSIRT Services Framework v2.1, CACAO 2.0, MITRE ATT&CK, taxonomia
  ENISA, taxonomia do CERT.br, LGPD, Ansible.
- **Dados e estatísticas:** estatísticas do CERT.br, CVE Details.

Cada cartão traz nome, uma linha sobre o que a ferramenta faz, etiqueta de estágio, papel
no minicurso e os links disponíveis.

### 5.3 Práticas (`praticas.html`)

As três práticas em cartões sequenciais, cada uma com os dois tempos previstos no
capítulo (demonstração da ferramenta e execução do notebook), duração, objetivos
numerados, perguntas de discussão guiada e o artefato de saída que alimenta a prática
seguinte: `saida/tickets_pseudonimizados.csv`, depois
`saida/incidentes_classificados.csv`, depois o playbook avaliado criticamente.

Encerra com "se algo der errado", cobrindo a degradação elegante prevista nos notebooks:
reconhecedor léxico simplificado quando a biblioteca Transformers não estiver
disponível, e provedor simulado determinístico quando não houver modelo.

### 5.4 Sobre (`sobre.html`)

Resumo em português e abstract em inglês; autores e instituições (UFU, UNIPAMPA, ITA);
estrutura das oito seções do capítulo; as cinco conclusões; cerca de doze leituras
recomendadas com link; agradecimentos (CAPES código 001, RNP por meio do Programa
Hackers do Bem e do GT-LFI, FAPERGS, CNPq, ANATEL por meio do termo com o ITA); e um
bloco "como citar" com BibTeX.

## 6. Critérios de aceitação

1. As quatro páginas abrem sem erro de console e sem requisição de rede além das fontes.
2. O catálogo lista todas as entradas com JavaScript desligado.
3. Busca e filtros combinam entre si e a contagem de resultados é anunciada.
4. Nenhum travessão em nenhum texto do site.
5. Todo texto em português está corretamente acentuado, com o arquivo em UTF-8.
6. Nenhum texto de conteúdo abaixo de 16px no corpo do site.
7. `minicurso.pdf` está no `.gitignore` e não é rastreado pelo git.
8. Layout sem rolagem horizontal em viewport de 360px.
9. Modo claro e modo escuro legíveis, com contraste AA no texto corrido.

## 7. Fora de escopo

Versão em inglês, mecanismo de busca global, formulário de inscrição, analytics,
hospedagem dos notebooks (que vivem no repositório da organização) e qualquer conteúdo
que dependa de dados reais de incidentes.
