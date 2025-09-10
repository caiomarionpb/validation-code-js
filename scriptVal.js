// ============================================================
// REGRAS DE VALIDAÇÃO (regex e funções utilitárias)
// ============================================================

// Usuário: apenas letras, números e "_", com no mínimo 3 caracteres.
// ^            -> início da string
// [A-Za-z0-9_] -> classe de caracteres permitidos
// {3,}         -> 3 ou mais
// $            -> fim da string
const regexUsuario = /^[A-Za-z0-9_]{3,}$/;

// Senha forte:
// - Pelo menos 1 minúscula   (?=.*[a-z])
// - Pelo menos 1 maiúscula   (?=.*[A-Z])
// - Pelo menos 1 dígito      (?=.*\d)
// - Pelo menos 1 especial    (?=.*\W)  (qualquer não-alfanumérico)
// - Tamanho mínimo 8         .{8,}
const regexSenhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;

// Telefone BR (formas comuns):
// - (DD) 99999-9999
// - (DD) 9999-9999
// - DD999999999
// - 99999-9999
// Grupo 1 (opcional): DDD com ou sem parênteses + espaço opcional
// Grupo 2: prefixo com 4 ou 5 dígitos
// Hífen opcional e mais 4 dígitos
const regexTelefone = /^(\(?\d{2}\)?\s?)?(\d{4,5})-?\d{4}$/;

/**
 * Retorna apenas os dígitos de uma entrada.
 * Exemplos:
 *  - somenteDigitos("CPF: 123.456.789-00") -> "12345678900"
 *  - somenteDigitos(42.7)                  -> "427"
 *  - somenteDigitos(null)                  -> ""
 */
function somenteDigitos(entrada) {
  const texto = String(entrada || "");   // garante string mesmo com null/undefined/number
  return texto.replace(/\D/g, "");       // remove tudo que NÃO é dígito
}

/**
 * Valida CPF pelo cálculo dos dígitos verificadores.
 * Passos:
 * 1) Normaliza para apenas dígitos.
 * 2) Verifica tamanho = 11 e elimina sequências iguais (ex.: 00000000000).
 * 3) Calcula DV1 e DV2 e confere.
 */
function cpfEhValido(cpfEntrada) {
  const cpf = somenteDigitos(cpfEntrada);

  // Regras básicas
  if (cpf.length !== 11) return false;
  const todosIguais = /^(\d)\1{10}$/.test(cpf); // 11 repetições do mesmo dígito
  if (todosIguais) return false;

  // Cálculo do primeiro dígito verificador (DV1)
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    const digito = parseInt(cpf[i], 10);
    soma += digito * (10 - i);
  }
  let dv1 = (soma * 10) % 11;
  if (dv1 === 10) dv1 = 0;
  if (dv1 !== parseInt(cpf[9], 10)) return false;

  // Cálculo do segundo dígito verificador (DV2)
  soma = 0;
  for (let i = 0; i < 10; i++) {
    const digito = parseInt(cpf[i], 10);
    soma += digito * (11 - i);
  }
  let dv2 = (soma * 10) % 11;
  if (dv2 === 10) dv2 = 0;

  return dv2 === parseInt(cpf[10], 10);
}

// ============================================================
// ELEMENTOS DO DOM
// ============================================================

const formulario = document.getElementById("formDemo");
const campoUsuario = document.getElementById("username");
const campoSenha = document.getElementById("password");
const campoConfirmacaoSenha = document.getElementById("confirm");
const campoCpf = document.getElementById("cpf");
const campoTelefone = document.getElementById("tel");
const campoDataInicio = document.getElementById("inicio");
const campoDataFim = document.getElementById("fim");

// Áreas de mensagem ao lado/abaixo dos campos
const msgUsuario = document.getElementById("usernameMsg");
const msgSenha = document.getElementById("passwordMsg");
const msgConfirmacao = document.getElementById("confirmMsg");
const msgCpf = document.getElementById("cpfMsg");
const msgTelefone = document.getElementById("telMsg");
const msgDatas = document.getElementById("dateMsg");
const msgGlobal = document.getElementById("globalMsg");

// ============================================================
// HELPER PARA MENSAGENS
// ============================================================

/**
 * Atualiza a mensagem de um elemento e aplica classe "ok" ou "error".
 * - element: nó de mensagem (ex.: <small id="usernameMsg">)
 * - mensagem: texto a exibir (string). Se vazio, limpa o texto e classes.
 * - estaValido: booleano indicando se é mensagem de sucesso (true) ou erro (false)
 */
function definirMensagem(element, mensagem, estaValido = false) {
  // Limpa sempre o conteúdo e as classes antes
  element.textContent = "";
  element.classList.remove("error", "ok");

  // Se não há mensagem, encerramos (fica sem classe e sem texto)
  if (!mensagem) return;

  // Define o texto
  element.textContent = mensagem;

  // Define a classe de estado
  if (estaValido === true) {
    element.classList.add("ok");
  } else {
    element.classList.add("error");
  }
}

// ============================================================
// VALIDAÇÕES POR CAMPO (cada função seta a mensagem e retorna boolean)
// ============================================================

function validarUsuario() {
  const valor = (campoUsuario.value || "").trim();

  // limpa mensagem antes de validar
  definirMensagem(msgUsuario, "");

  if (valor.length === 0) {
    definirMensagem(msgUsuario, "Informe o usuário.");
    return false;
  }

  if (!regexUsuario.test(valor)) {
    definirMensagem(msgUsuario, "Usuário inválido. Use ao menos 3 caracteres, apenas letras, números ou _.");
    return false;
  }

  definirMensagem(msgUsuario, "Usuário válido.", true);
  return true;
}

function validarSenha() {
  const valor = campoSenha.value || "";

  definirMensagem(msgSenha, "");

  if (valor.length === 0) {
    definirMensagem(msgSenha, "Informe a senha.");
    return false;
  }

  if (!regexSenhaForte.test(valor)) {
    definirMensagem(
      msgSenha,
      "Senha fraca. Use ao menos 8 caracteres, com minúscula, maiúscula, número e símbolo."
    );
    return false;
  }

  definirMensagem(msgSenha, "Senha forte.", true);
  return true;
}

function validarConfirmacaoSenha() {
  const senha = campoSenha.value || "";
  const confirmacao = campoConfirmacaoSenha.value || "";

  definirMensagem(msgConfirmacao, "");

  if (confirmacao.length === 0) {
    definirMensagem(msgConfirmacao, "Confirme a senha.");
    return false;
  }

  if (senha !== confirmacao) {
    definirMensagem(msgConfirmacao, "As senhas não coincidem.");
    return false;
  }

  definirMensagem(msgConfirmacao, "Senhas conferem.", true);
  return true;
}

function validarCpf() {
  const valor = (campoCpf.value || "").trim();

  definirMensagem(msgCpf, "");

  if (valor.length === 0) {
    definirMensagem(msgCpf, "Informe o CPF.");
    return false;
  }

  if (!cpfEhValido(valor)) {
    definirMensagem(msgCpf, "CPF inválido.");
    return false;
  }

  definirMensagem(msgCpf, "CPF válido.", true);
  return true;
}

function validarTelefone() {
  const valor = (campoTelefone.value || "").trim();

  definirMensagem(msgTelefone, "");

  if (valor.length === 0) {
    definirMensagem(msgTelefone, "Informe o telefone.");
    return false;
  }

  if (!regexTelefone.test(valor)) {
    definirMensagem(msgTelefone, "Telefone inválido. Exemplos: (19) 98888-7777 ou 1988887777.");
    return false;
  }

  definirMensagem(msgTelefone, "Telefone válido.", true);
  return true;
}

/**
 * Converte "YYYY-MM-DD" em Date usando ISO (T como separador) para evitar ambiguidades.
 * Retorna um objeto Date válido ou null.
 */
function criarDataSegura(yyyyMmDd) {
  if (!yyyyMmDd) return null;
  const data = new Date(yyyyMmDd + "T00:00:00");
  if (isNaN(data.getTime())) return null;
  return data;
}

function validarDatas() {
  const inicioStr = (campoDataInicio.value || "").trim();
  const fimStr = (campoDataFim.value || "").trim();

  definirMensagem(msgDatas, "");

  // campos obrigatórios
  if (inicioStr.length === 0 || fimStr.length === 0) {
    definirMensagem(msgDatas, "Informe as duas datas (início e fim).");
    return false;
  }

  // parsing seguro
  const dataInicio = criarDataSegura(inicioStr);
  const dataFim = criarDataSegura(fimStr);

  if (dataInicio === null || dataFim === null) {
    definirMensagem(msgDatas, "Data inválida. Use o seletor de data.");
    return false;
  }

  // regra de negócio comum: início não pode ser maior que fim
  if (dataInicio.getTime() > dataFim.getTime()) {
    definirMensagem(msgDatas, "A data de início não pode ser posterior à data de fim.");
    return false;
  }

  definirMensagem(msgDatas, "Intervalo de datas válido.", true);
  return true;
}