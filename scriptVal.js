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

const msgUsuario = document.getElementById("usernameMsg");
const msgSenha = document.getElementById("passwordMsg");
const msgConfirmacao = document.getElementById("confirmMsg");
const msgCpf = document.getElementById("cpfMsg");
const msgTelefone = document.getElementById("telMsg");
const msgDatas = document.getElementById("dateMsg");
const msgGlobal = document.getElementById("globalMsg");

// ============================================================
// REGEX
// ============================================================
const regexUsuario = /^[A-Za-z0-9_]{3,}$/;
const regexSenhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
const regexTelefone = /^(\(?\d{2}\)?\s?)?(\d{4,5})-?\d{4}$/;

// ============================================================
// HELPER DE MENSAGENS
// ============================================================
function definirMensagem(element, mensagem, estaValido = false) {
  element.textContent = mensagem || "";
  element.classList.remove("error", "ok");
  if (!mensagem) return;
  element.classList.add(estaValido ? "ok" : "error");
}

// ============================================================
// FUNÇÕES DE VALIDAÇÃO
// ============================================================
function validarUsuario() {
  const valor = (campoUsuario.value || "").trim();
  if (!valor) return definirMensagem(msgUsuario, "Informe o usuário."), false;
  if (!regexUsuario.test(valor)) return definirMensagem(msgUsuario, "Usuário inválido."), false;
  definirMensagem(msgUsuario, "Usuário válido.", true);
  return true;
}

function validarSenha() {
  const valor = (campoSenha.value || "").trim();
  if (!valor) return definirMensagem(msgSenha, "Informe a senha."), false;
  if (!regexSenhaForte.test(valor)) return definirMensagem(msgSenha, "Senha fraca."), false;
  definirMensagem(msgSenha, "Senha forte.", true);
  return true;
}

function validarConfirmacaoSenha() {
  const senha = campoSenha.value || "";
  const confirmacao = campoConfirmacaoSenha.value || "";
  if (!confirmacao) return definirMensagem(msgConfirmacao, "Confirme a senha."), false;
  if (senha !== confirmacao) return definirMensagem(msgConfirmacao, "As senhas não coincidem."), false;
  definirMensagem(msgConfirmacao, "Senhas conferem.", true);
  return true;
}

function validarCpf() {
  const valor = (campoCpf.value || "").trim();
  if (!valor) return definirMensagem(msgCpf, "Informe o CPF."), false;
  if (!cpfEhValido(valor)) return definirMensagem(msgCpf, "CPF inválido."), false;
  definirMensagem(msgCpf, "CPF válido.", true);
  return true;
}

function validarTelefone() {
  const valor = (campoTelefone.value || "").trim();
  if (!valor) return definirMensagem(msgTelefone, "Informe o telefone."), false;
  if (!regexTelefone.test(valor)) return definirMensagem(msgTelefone, "Telefone inválido."), false;
  definirMensagem(msgTelefone, "Telefone válido.", true);
  return true;
}

function validarDatas() {
  const inicio = campoDataInicio.value, fim = campoDataFim.value;
  if (!inicio || !fim) return definirMensagem(msgDatas, "Informe as datas."), false;
  const dtInicio = new Date(inicio+"T00:00:00");
  const dtFim = new Date(fim+"T00:00:00");
  if (dtInicio > dtFim) return definirMensagem(msgDatas, "Data de início maior que a de fim."), false;
  definirMensagem(msgDatas, "Datas válidas.", true);
  return true;
}

// ============================================================
// SUBMIT
// ============================================================
formulario.addEventListener("submit", e => {
  e.preventDefault();
  const valido = validarUsuario() && validarSenha() && validarConfirmacaoSenha() &&
                 validarCpf() && validarTelefone() && validarDatas();
  if (!valido) return definirMensagem(msgGlobal, "Corrija os erros antes de enviar.");
  definirMensagem(msgGlobal, "Formulário enviado com sucesso!", true);
});

// ============================================================
// VALIDAÇÃO EM TEMPO REAL
// ============================================================
campoUsuario.addEventListener("input", validarUsuario);
campoSenha.addEventListener("input", validarSenha);
campoConfirmacaoSenha.addEventListener("input", validarConfirmacaoSenha);
campoCpf.addEventListener("input", validarCpf);
campoTelefone.addEventListener("input", validarTelefone);
campoDataInicio.addEventListener("change", validarDatas);
campoDataFim.addEventListener("change", validarDatas);
