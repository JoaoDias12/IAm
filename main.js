const register = document.getElementById("register");
const whatTime = document.getElementById("whatTime"); // Mostrará H1 ou H2
const whatHours = document.getElementById("whatHours"); // Mostrará o horário

let btnHome = document.getElementById("btnHome")
let btnEscala = document.getElementById("btnEscala")

let home = document.querySelector(".home")
let escala = document.querySelector('.escala')
let Opening = document.querySelector('.Opening')

let footer = document.getElementById("footer")

setTimeout(function() {
 footer.classList.remove("hidden")
 Opening.classList.add("hidden")
},1500)

btnHome.addEventListener("click", function() {
    // Animação de saída da escala
    escala.classList.add('saindo');
    
    // Remove a classe hidden da home após um pequeno delay
    setTimeout(() => {
      escala.classList.add('hidden');
      home.classList.remove('hidden');
      
      // Remove a classe de animação após a transição
      setTimeout(() => escala.classList.remove('saindo'), 500);
    }, 300);
  });
  
  btnEscala.addEventListener("click", function() {
    // Animação de saída da home
    home.classList.add('saindo');
    
    // Remove a classe hidden da escala após um pequeno delay
    setTimeout(() => {
      home.classList.add('hidden');
      escala.classList.remove('hidden');
      
      // Remove a classe de animação após a transição
      setTimeout(() => home.classList.remove('saindo'), 500);
    }, 300);
  });

if (register.textContent == '') {
    let oldRegister = localStorage.getItem("register")

    register.value = oldRegister
}
// Dados formatados corretamente: Matrícula + sequência de dias

let allText = [
  "8843\tF,F,1,2,1,1,F,2,1,2,1,1,2,F,F,2,1,2,1,2,1,f,1,2,1,2,1,1,F,F",
  "27029\tF,2,1,1,2,1,2,F,F,2,1,2,1,2,1,F,2,1,2,1,2,2,F,F,2,1,2,2,2,2",
  "27436\tF,2,1,1,1,2,1,F,F,2,1,1,2,1,2,F,2,1,1,2,1,2,F,F,2,1,2,1,2,1",
  "98014\t2,F,2,2,F,F,2,2,1,F,2,1,1,1,2,1,F,F,2,1,2,1,1,1,F,2,1,1,1,2",
  "25137\t1,F,F,2,1,2,1,1,2,F,2,2,1,1,1,2,F,F,2,1,2,1,2,1,F,2,1,2,1,1",
  "24633\t1,1,2,F,2,1,1,2,1,1,F,F,2,1,2,1,1,2,F,2,1,1,2,1,1,F,F,2,1,1",
  "27215\t2,1,1,1,F,F,2,1,2,1,1,2,F,2,1,2,1,2,1,F,F,2,1,2,1,1,2,F,2,2"
];


// Definições dos turnos
const schedules = {
    '1': { 
        code: 'H1',
        hours: '16:15 às 22:15'
    },
    '2': { 
        code: 'H2',
        hours: '17:30 às 23:30'
    },
    'F': { 
        code: 'Folga',
        hours: 'Folga'
    }
};

function updateSchedule() {
    // Verifica se os elementos existem
    if (!register || !whatTime || !whatHours) {
        console.error("Elementos não encontrados no DOM");
        return;
    }

    // Pega o valor do input
    const registerValue = register.value.trim();
    if (registerValue != '') {
        localStorage.setItem("register", registerValue)
    }
    
    if (!registerValue) {
        whatTime.textContent = "?";
        whatHours.textContent = "?";
        return;
    }

    // Pega o dia atual (1-31)
    const currentDay = new Date().getDate();
    
    // Procura pelo registro
    for (const record of allText) {
        const [matricula, dias] = record.split('\t');
        
        if (matricula === registerValue) {
            const daysArray = dias.split(',');
            
            if (currentDay <= daysArray.length) {
                const dayCode = daysArray[currentDay - 1];
                const schedule = schedules[dayCode] || schedules['F'];
                
                // Atualiza os elementos
                whatTime.textContent = schedule.code;
                whatHours.textContent = schedule.hours;
            } else {
                whatTime.textContent = "Dia inválido";
                whatHours.textContent = `Fora da escala (máx ${daysArray.length} dias)`;
            }
            return;
        }
    }
    
    // Se não encontrou
    whatTime.textContent = "?";
    whatHours.textContent = "?";
}

// Atualiza quando o input muda
register.addEventListener("change", function() {
    updateSchedule()
})


updateSchedule();


// Lista completa de funcionários com matrícula e nome
const funcionarios = [
    { matricula: '8843', nome: 'Jhonata de Oliveira' },
    { matricula: '27029', nome: 'Daiana Félix de Souza' },
    { matricula: '27436', nome: 'Pedro Henrique Sorilha Cordeiro' },
    { matricula: '98014', nome: 'Flavio Lourenço Souza' },
    { matricula: '25137', nome: 'João Vitor Dias' },
    { matricula: '24633', nome: 'Ramon Mendonca Reis' },
    { matricula: '27215', nome: 'Marya Eduarda dos Santos Rocha' }
];

// Elementos onde vamos mostrar as listas
const firstTime = document.getElementById("firstTime");
const secondTime = document.getElementById("secondTime");
const slackDay = document.getElementById("slackDay");

function atualizarListasPorTurno() {
    // Limpa as listas antes de atualizar
    firstTime.innerHTML = '';
    secondTime.innerHTML = '';
    slackDay.innerHTML = '';
    
    // Pega o dia atual (1-31)
    const currentDay = new Date().getDate();
    
    // Para cada registro no allText
    allText.forEach(record => {
        const [matricula, dias] = record.split('\t');
        const daysArray = dias.split(',');
        
        // Verifica se o dia atual existe no array
        if (currentDay <= daysArray.length) {
            const dayCode = daysArray[currentDay - 1];
            
            // Encontra o funcionário correspondente
            const funcionario = funcionarios.find(f => f.matricula === matricula);
            
            if (funcionario) {
                const item = document.createElement('h2');
                item.textContent = `${funcionario.nome}`; //(${matricula})
                
                // Adiciona ao grupo correto
                if (dayCode === '1') {
                    firstTime.appendChild(item);
                } else if (dayCode === '2') {
                    secondTime.appendChild(item);
                } else if (dayCode === 'F') {
                    slackDay.appendChild(item);
                }
            }
        }
    });
    
    // Se alguma lista estiver vazia, mostra uma mensagem
    if (firstTime.children.length === 0) {
        firstTime.innerHTML = '<div>Nenhum funcionário neste turno</div>';
    }
    if (secondTime.children.length === 0) {
        secondTime.innerHTML = '<div>Nenhum funcionário neste turno</div>';
    }
    if (slackDay.children.length === 0) {
        slackDay.innerHTML = '<div>Nenhum funcionário de folga</div>';
    }
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    atualizarListasPorTurno();
    
    // Atualiza a cada minuto (opcional)
    setInterval(atualizarListasPorTurno, 60000);
});






