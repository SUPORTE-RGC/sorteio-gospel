document.addEventListener('DOMContentLoaded', function() {
    let dados = [];
    
    const dddToCityMap = {
        '11': 'São Paulo',
        '12': 'São José dos Campos',
        '13': 'Santos',
        '14': 'Bauru',
        '15': 'Sorocaba',
        '16': 'Ribeirão Preto',
        '17': 'São José do Rio Preto',
        '18': 'Presidente Prudente',
        '19': 'Campinas',
        '21': 'Rio de Janeiro',
        '22': 'Campos dos Goytacazes',
        '24': 'Volta Redonda',
        '27': 'Vitória',
        '28': 'Cachoeiro de Itapemirim',
        '31': 'Belo Horizonte',
        '32': 'Juiz de Fora',
        '33': 'Governador Valadares',
        '34': 'Uberlândia',
        '35': 'Poços de Caldas',
        '37': 'Divinópolis',
        '38': 'Montes Claros',
        '41': 'Curitiba',
        '42': 'Ponta Grossa',
        '43': 'Londrina',
        '44': 'Maringá',
        '45': 'Cascavel',
        '46': 'Francisco Beltrão',
        '47': 'Joinville',
        '48': 'Florianópolis',
        '49': 'Chapecó',
        '51': 'Porto Alegre',
        '53': 'Pelotas',
        '54': 'Caxias do Sul',
        '55': 'Santa Maria',
        '61': 'Brasília',
        '62': 'Goiânia',
        '63': 'Tocantins',
        '64': 'Rio Verde',
        '65': 'Cuiabá',
        '66': 'Rondonópolis',
        '67': 'Campo Grande',
        '68': 'Acre',
        '69': 'Rondônia',
        '71': 'Salvador',
        '73': 'Ilhéus',
        '74': 'Juazeiro',
        '75': 'Feira de Santana',
        '77': 'Vitória da Conquista',
        '79': 'Aracaju',
        '81': 'Recife',
        '82': 'Maceió',
        '83': 'João Pessoa',
        '84': 'Natal',
        '85': 'Fortaleza',
        '86': 'Teresina',
        '87': 'Petrolina',
        '88': 'Juazeiro do Norte',
        '89': 'Picos',
        '91': 'Belém',
        '92': 'Manaus',
        '93': 'Santarém',
        '94': 'Marabá',
        '95': 'Roraima',
        '96': 'Amapá',
        '97': 'Tefé',
        '98': 'São Luís',
        '99': 'Imperatriz'
    };
    
    const sortearIcon = document.getElementById('sortearIcon');
    const reiniciarIcon = document.getElementById('reiniciarIcon');
    const fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', handleFile);
    sortearIcon.addEventListener('click', iniciarSorteio);
    reiniciarIcon.addEventListener('click', reiniciar);
    
    sortearIcon.disabled = true;
    reiniciarIcon.disabled = true;

    function handleFile(event) {
        const file = event.target.files;
        if (!file.length) return;
        const selectedFile = file.item(0);

        const reader = new FileReader();
        reader.onload = function(e) {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            
            // Ler a planilha para um array de arrays
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            
            // Ignorar a primeira linha (cabeçalho) e mapear o restante dos dados
            dados = json
                .filter(row => row && row.length >= 2 && row[0] !== undefined && row[1] !== undefined)
                .map(row => ({ nome: row[0], numero: row[1] }));
            
            if (dados.length > 0) {
                alert("✅ Arquivo carregado! Pronto para sortear.");
                sortearIcon.disabled = false;
                reiniciarIcon.disabled = true;
            } else {
                alert("❌ Planilha vazia ou inválida.");
                sortearIcon.disabled = true;
            }
        };
        reader.readAsBinaryString(selectedFile);
    }

    function iniciarSorteio() {
        if (sortearIcon.disabled || dados.length === 0) return;

        const resultadoDiv = document.getElementById('resultado');
        
        reiniciarIcon.disabled = true;
        sortearIcon.disabled = true;
        
        resultadoDiv.classList.remove('show', 'ganhador');
        document.querySelector('h1').classList.remove('ganhador-titulo');
        resultadoDiv.innerHTML = '⏳ Sorteando...';
        resultadoDiv.style.opacity = 1;
        resultadoDiv.style.transform = 'scale(1)';

        let tempo = 0;
        const duracao = 8000;
        const intervalo = setInterval(() => {
            const random = dados[Math.floor(Math.random() * dados.length)];
            if (random) {
                const numeroString = random.numero.toString();
                const ddd = numeroString.substring(0, 2);
                const ultimos4 = numeroString.substring(numeroString.length - 4);
                const numeroOculto = `(${ddd}) xxxx-${ultimos4}`;

                const cidade = dddToCityMap[ddd] || 'Cidade não encontrada';
                
                resultadoDiv.innerHTML = `
                    <div>Nome: <span class="highlight">${random.nome}</span></div>
                    <div>Número: <span class="highlight">${numeroOculto}</span></div>
                    <div>Cidade: <span class="highlight">${cidade}</span></div>
                `;
            }
            tempo += 100;
            if (tempo >= duracao) {
                clearInterval(intervalo);
                mostrarResultadoFinal();
            }
        }, 100);
    }

    function mostrarResultadoFinal() {
        const sorteado = dados[Math.floor(Math.random() * dados.length)];
        const resultadoDiv = document.getElementById('resultado');

        if (sorteado) {
            const numeroString = sorteado.numero.toString();
            const ddd = numeroString.substring(0, 2);
            const ultimos4 = numeroString.substring(numeroString.length - 4);
            const numeroOculto = `(${ddd}) xxxx-${ultimos4}`;

            const cidade = dddToCityMap[ddd] || 'Cidade não encontrada';
            
            resultadoDiv.innerHTML = `
                <div>Nome: <span class="highlight">${sorteado.nome}</span></div>
                <div>Número: <span class="highlight">${numeroOculto}</span></div>
                <div>Cidade: <span class="highlight">${cidade}</span></div>
            `;
            resultadoDiv.classList.add('ganhador');
            document.querySelector('h1').classList.add('ganhador-titulo');
        } else {
            resultadoDiv.innerHTML = 'Não foi possível sortear. Recarregue a planilha.';
        }

        resultadoDiv.classList.add('show');
        reiniciarIcon.disabled = false;
    }

    function reiniciar() {
        if (reiniciarIcon.disabled) return;

        const resultadoDiv = document.getElementById('resultado');
        
        resultadoDiv.innerHTML = '';
        resultadoDiv.classList.remove('show', 'ganhador');
        document.querySelector('h1').classList.remove('ganhador-titulo');
        resultadoDiv.style.opacity = 0;
        resultadoDiv.style.transform = 'scale(0.8)';
        sortearIcon.disabled = dados.length === 0;
        reiniciarIcon.disabled = true;
        document.getElementById('fileInput').value = '';
    }
});