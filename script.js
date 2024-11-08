// Seletores de elementos
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const pontoSystem = document.getElementById('pontoSystem');
const loginForm = document.getElementById('loginForm');
const registrarEntrada = document.getElementById('registrarEntrada');
const registrarSaida = document.getElementById('registrarSaida');
const horasDisplay = document.getElementById('horasDisplay');
const historicoPontos = document.getElementById('historicoPontos');
const logoutBtn = document.getElementById('logoutBtn');
const valorHoraInput = document.getElementById('valorHora');
const calcularSalarioBtn = document.getElementById('calcularSalario');
const salarioTotalDisplay = document.getElementById('salarioTotal');
const baixarRelatorioPdf = document.getElementById('baixarRelatorioPdf');
const baixarRelatorioXlsx = document.getElementById('baixarRelatorioXlsx');
const verAtivosBtn = document.getElementById('verAtivos');
const aprovarPontoBtn = document.getElementById('aprovarPonto');
const verFolhaSalarialBtn = document.getElementById('verFolhaSalarial');
const adminControls = document.getElementById('adminControls');
let usuarioAtual = null;
let pontos = JSON.parse(localStorage.getItem('pontos')) || { 'Beatriz': [], 'narissa': [], 'João': [], 'Juliana': [], 'Gabrielly': [], 'Milena': [], 'Cristian': [] };

// Usuários e senhas
const usuarios = {
    'Beatriz': 'beatriz123',
    'narissa': 'narissa123',
    'João': 'joao123',
    'Juliana': 'juliana123',
    'Gabrielly': 'gabrielly123',
    'Milena': 'milena123',
    'Cristian': 'cristian123'  // Dono, pode acessar funcionalidades exclusivas
};

// Função de login
loginBtn.addEventListener('click', () => {
    const usuario = loginUsername.value;
    const senha = loginPassword.value;

    if (usuarios[usuario] && usuarios[usuario] === senha) {
        localStorage.setItem('usuario', usuario);
        usuarioAtual = usuario;
        loginForm.style.display = 'none';
        pontoSystem.style.display = 'block';
        document.getElementById('usuarioLogado').innerText = usuarioAtual;

        // Mostrar ou esconder o painel de administração
        if (usuarioAtual === 'Cristian') {
            adminControls.style.display = 'block';
            baixarRelatorioXlsx.style.display = 'inline-block';
            baixarRelatorioPdf.style.display = 'inline-block';
        } else {
            adminControls.style.display = 'none';
            baixarRelatorioXlsx.style.display = 'none';
            baixarRelatorioPdf.style.display = 'none';
        }

        atualizarHistorico();
    } else {
        document.getElementById('loginError').style.display = 'block'; // Exibir erro de login
    }
});

// Função para registrar entrada
registrarEntrada.addEventListener('click', () => {
    const horaEntrada = new Date();
    pontos[usuarioAtual].push({
        entrada: horaEntrada,
        horasTrabalhadas: 0,
        saida: null
    });
    localStorage.setItem('pontos', JSON.stringify(pontos));
    registrarSaida.disabled = false;
    atualizarHistorico();
});

// Função para registrar saída
registrarSaida.addEventListener('click', () => {
    const horaSaida = new Date();
    const ultimoPonto = pontos[usuarioAtual][pontos[usuarioAtual].length - 1];
    const horasTrabalhadas = (horaSaida - new Date(ultimoPonto.entrada)) / 3600000; // Converte para horas
    ultimoPonto.saida = horaSaida;
    ultimoPonto.horasTrabalhadas = horasTrabalhadas;

    localStorage.setItem('pontos', JSON.stringify(pontos));
    registrarSaida.disabled = true;
    atualizarHistorico();
    horasDisplay.innerText = `${horasTrabalhadas.toFixed(2)} horas`;
});

// Atualiza o histórico de ponto
function atualizarHistorico() {
    historicoPontos.innerHTML = '';
    pontos[usuarioAtual].forEach((ponto) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>Entrada:</strong> ${new Date(ponto.entrada).toLocaleString()}<br>
            <strong>Saída:</strong> ${ponto.saida ? new Date(ponto.saida).toLocaleString() : 'Não registrada'}<br>
            <strong>Horas Trabalhadas:</strong> ${ponto.horasTrabalhadas ? ponto.horasTrabalhadas.toFixed(2) : '0'} horas
        `;
        historicoPontos.appendChild(li);
    });
}

// Função de logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('usuario');
    usuarioAtual = null;
    loginForm.style.display = 'block';
    pontoSystem.style.display = 'none';
});

// Calcular salário
calcularSalarioBtn.addEventListener('click', () => {
    const valorHora = parseFloat(valorHoraInput.value);
    const totalHoras = pontos[usuarioAtual].reduce((acc, ponto) => acc + ponto.horasTrabalhadas, 0);
    const salario = valorHora * totalHoras;
    salarioTotalDisplay.innerText = `R$${salario.toFixed(2)}`;
});
