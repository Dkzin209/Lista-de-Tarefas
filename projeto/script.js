const url = "http://localhost:3010/tarefas";

const form = document.getElementById("form-tarefa");
const input = document.getElementById("input-tarefa");
const lista = document.getElementById("lista-tarefas");
const msgVazia = document.getElementById("msg-vazia");


window.addEventListener("DOMContentLoaded", carregarTarefas);

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const texto = input.value.trim();
    if (texto === "") return;


    const resposta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto })
    });

    if (resposta.ok) {
        criarTarefa(texto);
        input.value = "";
        input.focus();
        atualizarMensagem();
    } else {
        console.error("Erro ao salvar tarefa no servidor");
    }
});

async function carregarTarefas() {
    try {
        const resposta = await fetch(url);
        const tarefas = await resposta.json();

        lista.innerHTML = "";
        tarefas.forEach(t => criarTarefa(t));
        atualizarMensagem();
    } catch (erro) {
        console.error("Erro ao carregar tarefas:", erro);
    }
}

function criarTarefa(texto) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = texto;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", function () {
        li.classList.toggle("concluida");
    });

    const divAcoes = document.createElement("div");
    divAcoes.className = "acoes";

    const btnEditar = document.createElement("button");
    btnEditar.innerHTML = "✏️";
    btnEditar.className = "edit";
    btnEditar.addEventListener("click", function () {
        editarTarefa(span);
    });

    const btnExcluir = document.createElement("button");
    btnExcluir.innerHTML = "🗑️";
    btnExcluir.className = "delete";
    btnExcluir.addEventListener("click", function () {
        li.remove();
        atualizarMensagem();
    });

    divAcoes.appendChild(btnEditar);
    divAcoes.appendChild(btnExcluir);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(divAcoes);

    lista.appendChild(li);
}

function editarTarefa(span) {
    const textoAtual = span.textContent;
    const inputEdicao = document.createElement("input");
    inputEdicao.type = "text";
    inputEdicao.value = textoAtual;

    span.replaceWith(inputEdicao);
    inputEdicao.focus();

    inputEdicao.addEventListener("blur", salvarEdicao);
    inputEdicao.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            salvarEdicao();
        }
    });

    function salvarEdicao() {
        const novoTexto = inputEdicao.value.trim() || textoAtual;
        span.textContent = novoTexto;
        inputEdicao.replaceWith(span);
    }
}

function atualizarMensagem() {
    msgVazia.style.display = lista.children.length === 0 ? "block" : "none";
}
