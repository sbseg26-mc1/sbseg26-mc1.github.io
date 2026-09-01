/* Busca e filtragem do catálogo.

   Princípio de projeto: todos os cartões já existem no HTML. Este arquivo
   apenas esconde e mostra nós que o navegador já renderizou. Com o
   JavaScript desligado, o catálogo continua completo e legível. */

(function () {
  "use strict";

  var campoBusca = document.getElementById("busca");
  var listaChips = Array.prototype.slice.call(
    document.querySelectorAll(".chip[data-filtro]")
  );
  var cartoes = Array.prototype.slice.call(document.querySelectorAll(".tool"));
  var grupos = Array.prototype.slice.call(
    document.querySelectorAll(".catalog-group")
  );
  var contagem = document.getElementById("contagem");
  var vazio = document.getElementById("vazio");
  var botaoLimpar = document.getElementById("limpar");

  if (!campoBusca || cartoes.length === 0) return;

  /* Remove acentos para que "anonimizacao" encontre "anonimização". */
  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  /* Todo texto que este arquivo escreve na página vem de um modelo declarado
     no HTML, que é traduzido por idioma. Assim o mesmo catalogo.js serve as
     árvores pt-BR, en e es sem conter texto de nenhuma delas. Os padrões
     abaixo valem para uma página que ainda não declare os atributos. */
  function modelo(nome, padrao) {
    return (contagem && contagem.dataset[nome]) || padrao;
  }

  var tplTotal = modelo("tplTotal", "{n} itens no catálogo");
  var tplUm = modelo("tplUm", "1 item encontrado");
  var tplVarios = modelo("tplVarios", "{n} itens encontrados");
  var tplGrupoTotal = modelo("tplGrupoTotal", "{n} itens");
  var tplGrupoParcial = modelo("tplGrupoParcial", "{n} de {total}");

  function preencher(texto, n, total) {
    return texto
      .replace("{n}", String(n))
      .replace("{total}", total == null ? "" : String(total));
  }

  /* Índice de busca montado uma única vez, a partir do conteúdo do cartão. */
  cartoes.forEach(function (cartao) {
    cartao.dataset.indice = normalizar(
      cartao.textContent + " " + (cartao.dataset.termos || "")
    );
  });

  function selecionados(filtro) {
    return listaChips
      .filter(function (chip) {
        return (
          chip.dataset.filtro === filtro &&
          chip.getAttribute("aria-pressed") === "true"
        );
      })
      .map(function (chip) {
        return chip.dataset.valor;
      });
  }

  function aplicar() {
    var termo = normalizar(campoBusca.value.trim());
    var categorias = selecionados("categoria");
    var estagios = selecionados("estagio");
    var visiveis = 0;

    cartoes.forEach(function (cartao) {
      var casaTermo = termo === "" || cartao.dataset.indice.indexOf(termo) !== -1;

      var casaCategoria =
        categorias.length === 0 ||
        categorias.indexOf(cartao.dataset.categoria) !== -1;

      var estagiosDoCartao = (cartao.dataset.estagio || "").split(/\s+/);
      var casaEstagio =
        estagios.length === 0 ||
        estagios.some(function (estagio) {
          return estagiosDoCartao.indexOf(estagio) !== -1;
        });

      var mostrar = casaTermo && casaCategoria && casaEstagio;
      cartao.hidden = !mostrar;
      if (mostrar) visiveis += 1;
    });

    /* Um grupo sem nenhum cartão visível sai da página inteira. */
    grupos.forEach(function (grupo) {
      var doGrupo = Array.prototype.slice.call(grupo.querySelectorAll(".tool"));
      var abertos = doGrupo.filter(function (cartao) {
        return !cartao.hidden;
      }).length;

      grupo.hidden = abertos === 0;

      var marcador = grupo.querySelector(".catalog-group__count");
      if (marcador) {
        marcador.textContent =
          abertos === doGrupo.length
            ? preencher(tplGrupoTotal, doGrupo.length)
            : preencher(tplGrupoParcial, abertos, doGrupo.length);
      }
    });

    if (contagem) {
      contagem.textContent =
        visiveis === cartoes.length
          ? preencher(tplTotal, cartoes.length)
          : visiveis === 1
          ? tplUm
          : preencher(tplVarios, visiveis);
    }

    if (vazio) vazio.hidden = visiveis !== 0;

    var filtrando =
      termo !== "" || categorias.length > 0 || estagios.length > 0;
    if (botaoLimpar) botaoLimpar.hidden = !filtrando;
  }

  campoBusca.addEventListener("input", aplicar);

  campoBusca.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      campoBusca.value = "";
      aplicar();
    }
  });

  listaChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var ativo = chip.getAttribute("aria-pressed") === "true";
      chip.setAttribute("aria-pressed", ativo ? "false" : "true");
      aplicar();
    });
  });

  if (botaoLimpar) {
    botaoLimpar.addEventListener("click", function () {
      campoBusca.value = "";
      listaChips.forEach(function (chip) {
        chip.setAttribute("aria-pressed", "false");
      });
      aplicar();
      campoBusca.focus();
    });
  }

  aplicar();
})();
