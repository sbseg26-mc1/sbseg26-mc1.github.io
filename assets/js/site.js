/* Comportamentos globais do site: tema, menu em telas pequenas e ano do rodapé.
   Tudo opcional: sem JavaScript, o site continua legível e navegável. */

(function () {
  "use strict";

  var raiz = document.documentElement;

  /* ---- Tema claro e escuro ------------------------------------------- */

  var botaoTema = document.querySelector(".theme-toggle");

  function temaAtual() {
    var salvo = raiz.getAttribute("data-theme");
    if (salvo) return salvo;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function aplicarTema(tema) {
    raiz.setAttribute("data-theme", tema);
    try {
      localStorage.setItem("tema", tema);
    } catch (e) {
      /* Navegação privativa pode bloquear o armazenamento. Ignoramos. */
    }
    if (botaoTema) {
      botaoTema.setAttribute(
        "aria-label",
        tema === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
      );
    }
  }

  if (botaoTema) {
    aplicarTema(temaAtual());
    botaoTema.addEventListener("click", function () {
      aplicarTema(temaAtual() === "dark" ? "light" : "dark");
    });
  }

  /* ---- Menu em telas pequenas ----------------------------------------- */

  var botaoMenu = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".nav");

  if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", function () {
      var aberto = menu.getAttribute("data-open") === "true";
      menu.setAttribute("data-open", aberto ? "false" : "true");
      botaoMenu.setAttribute("aria-expanded", aberto ? "false" : "true");
    });

    menu.addEventListener("click", function (evento) {
      if (evento.target.tagName === "A") {
        menu.setAttribute("data-open", "false");
        botaoMenu.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && menu.getAttribute("data-open") === "true") {
        menu.setAttribute("data-open", "false");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.focus();
      }
    });
  }

  /* ---- Ano corrente no rodapé ----------------------------------------- */

  var ano = document.querySelector("[data-ano]");
  if (ano) {
    ano.textContent = String(new Date().getFullYear());
  }
})();
