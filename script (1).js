// ==================== JOGO 1: MATEMÁTICA - TABUADA ====================
let mathScore = 0;
let mathCurrent = 0;
let mathQuestions = [];

function generateMathQuestions() {
    const qs = [];
    for (let i = 0; i < 10; i++) {
        const a = Math.floor(Math.random() * 9) + 2;
        const b = Math.floor(Math.random() * 9) + 2;
        const correct = a * b;
        let options = [correct];

        while (options.length < 4) {
            let wrong = correct + (Math.floor(Math.random() * 12) - 6);
            if (wrong <= 0) wrong = correct + Math.floor(Math.random() * 6) + 1;
            if (!options.includes(wrong)) options.push(wrong);
        }
        options = options.sort(() => Math.random() - 0.5);
        qs.push({ a, b, correct, options });
    }
    return qs;
}

function startMathGame() {
    mathScore = 0;
    mathCurrent = 0;
    mathQuestions = generateMathQuestions();
    document.getElementById('math-score').textContent = '0';
    document.getElementById('math-question-num').textContent = '1';
    showMathQuestion();
}

function showMathQuestion() {
    if (mathCurrent >= 10) {
        showMathFinal();
        return;
    }

    const q = mathQuestions[mathCurrent];
    document.getElementById('math-question-num').textContent = mathCurrent + 1;
    document.getElementById('math-question').textContent = `${q.a} × ${q.b} = ?`;
    document.getElementById('math-feedback').textContent = '';
    document.getElementById('math-feedback').className = 'feedback';

    const optsDiv = document.getElementById('math-options');
    optsDiv.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => checkMathAnswer(opt, q.correct, btn);
        optsDiv.appendChild(btn);
    });
}

function checkMathAnswer(selected, correct, btn) {
    const buttons = document.querySelectorAll('#math-options .option-btn');
    buttons.forEach(b => b.disabled = true);

    if (selected === correct) {
        mathScore += 10;
        btn.classList.add('correct');
        document.getElementById('math-feedback').textContent = '🎉 Acertou! +10 pontos';
        document.getElementById('math-feedback').className = 'feedback correct';
    } else {
        btn.classList.add('wrong');
        buttons.forEach(b => {
            if (parseInt(b.textContent) === correct) b.classList.add('correct');
        });
        document.getElementById('math-feedback').textContent = `😕 Errado! A resposta era ${correct}`;
        document.getElementById('math-feedback').className = 'feedback wrong';
    }

    document.getElementById('math-score').textContent = mathScore;

    setTimeout(() => {
        mathCurrent++;
        showMathQuestion();
    }, 1200);
}

function showMathFinal() {
    const box = document.getElementById('math-question-box');
    let message = '';
    if (mathScore >= 80) message = '🌟 Incrível! Você é um gênio da tabuada!';
    else if (mathScore >= 50) message = '👏 Muito bem! Continue praticando!';
    else message = '💪 Bom esforço! Treine mais um pouco!';

    box.innerHTML = `
        <div class="final-screen">
            <h2>${message}</h2>
            <div class="final-score">${mathScore} pontos</div>
            <p style="margin-bottom:20px;">Você acertou ${mathScore / 10} de 10 perguntas!</p>
            <button class="btn btn-success" onclick="location.reload()">Jogar Novamente</button>
        </div>
    `;
}

// ==================== JOGO 2: PORTUGUÊS - FORCA ====================
const hangmanWords = [
    { word: 'SUBSTANTIVO', hint: 'Classe de palavra que nomeia seres, objetos e sentimentos' },
    { word: 'ADJETIVO', hint: 'Palavra que caracteriza o substantivo' },
    { word: 'VERBO', hint: 'Palavra que indica ação, estado ou fenômeno' },
    { word: 'PRONOME', hint: 'Palavra que substitui ou acompanha o substantivo' },
    { word: 'ADVERBIO', hint: 'Palavra que modifica o verbo, adjetivo ou outro advérbio' },
    { word: 'SINONIMO', hint: 'Palavra com significado semelhante a outra' },
    { word: 'ANTONIMO', hint: 'Palavra com significado contrário a outra' },
    { word: 'SUJEITO', hint: 'Termo da oração sobre o qual se diz algo' },
    { word: 'PREDICADO', hint: 'Tudo o que se declara sobre o sujeito' },
    { word: 'PARAGRAFO', hint: 'Cada uma das partes de um texto' },
    { word: 'ORACAO', hint: 'Frase com verbo' },
    { word: 'PONTO', hint: 'Sinal de pontuação que indica fim de frase' },
    { word: 'VIRGULA', hint: 'Sinal de pontuação que separa elementos' },
    { word: 'ARTIGO', hint: 'Palavra que determina o substantivo (o, a, os, as...)' }
];

const hangmanStages = [
    `  +---+
  |   |
      |
      |
      |
      |
=========`,
    `  +---+
  |   |
  O   |
      |
      |
      |
=========`,
    `  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
    `  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
    `  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
    `  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
    `  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
];

let currentWord = '';
let currentHint = '';
let guessedLetters = [];
let wrongGuesses = 0;
let gameOver = false;

function startHangman() {
    const random = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
    currentWord = random.word;
    currentHint = random.hint;
    guessedLetters = [];
    wrongGuesses = 0;
    gameOver = false;

    document.getElementById('hangman-hint').textContent = 'Dica: ' + currentHint;
    document.getElementById('hangman-message').textContent = '';
    document.getElementById('btn-new-hangman').style.display = 'none';

    updateHangmanDisplay();
    createLetterButtons();
}

function createLetterButtons() {
    const grid = document.getElementById('letters-grid');
    grid.innerHTML = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    letters.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'letter-btn';
        btn.textContent = letter;
        btn.onclick = () => guessLetter(letter, btn);
        grid.appendChild(btn);
    });
}

function guessLetter(letter, btn) {
    if (gameOver || guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);
    btn.disabled = true;

    if (currentWord.includes(letter)) {
        btn.classList.add('used-correct');
    } else {
        btn.classList.add('used-wrong');
        wrongGuesses++;
    }

    updateHangmanDisplay();
    checkHangmanWinLose();
}

function updateHangmanDisplay() {
    document.getElementById('hangman-drawing').textContent = hangmanStages[wrongGuesses];

    let display = '';
    for (let char of currentWord) {
        display += guessedLetters.includes(char) ? char : '_';
    }
    document.getElementById('hangman-word').textContent = display;
}

function checkHangmanWinLose() {
    const wordDisplay = document.getElementById('hangman-word').textContent;

    if (!wordDisplay.includes('_')) {
        gameOver = true;
        document.getElementById('hangman-message').textContent = '🎉 Parabéns! Você acertou!';
        document.getElementById('hangman-message').style.color = '#00b894';
        document.getElementById('btn-new-hangman').style.display = 'inline-block';
        disableAllLetters();
    } else if (wrongGuesses >= 6) {
        gameOver = true;
        document.getElementById('hangman-message').textContent = `😢 Game Over! A palavra era: ${currentWord}`;
        document.getElementById('hangman-message').style.color = '#e17055';
        document.getElementById('btn-new-hangman').style.display = 'inline-block';
        disableAllLetters();
    }
}

function disableAllLetters() {
    document.querySelectorAll('.letter-btn').forEach(btn => btn.disabled = true);
}

// ==================== JOGO 3: CIÊNCIAS - MEMÓRIA DO SISTEMA SOLAR ====================
const memoryPairs = [
    { id: 1, text: '☀️ Sol', pair: 'Estrela no centro' },
    { id: 2, text: 'Estrela no centro', pair: '☀️ Sol' },
    { id: 3, text: '🪐 Júpiter', pair: 'Maior planeta' },
    { id: 4, text: 'Maior planeta', pair: '🪐 Júpiter' },
    { id: 5, text: '🔴 Marte', pair: 'Planeta Vermelho' },
    { id: 6, text: 'Planeta Vermelho', pair: '🔴 Marte' },
    { id: 7, text: '🌍 Terra', pair: 'Planeta Azul' },
    { id: 8, text: 'Planeta Azul', pair: '🌍 Terra' },
    { id: 9, text: '💫 Saturno', pair: 'Tem anéis visíveis' },
    { id: 10, text: 'Tem anéis visíveis', pair: '💫 Saturno' },
    { id: 11, text: '🌙 Lua', pair: 'Satélite da Terra' },
    { id: 12, text: 'Satélite da Terra', pair: '🌙 Lua' }
];

let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let canFlip = true;

function startMemoryGame() {
    matchedCount = 0;
    moves = 0;
    flippedCards = [];
    canFlip = true;
    document.getElementById('memory-moves').textContent = '0';
    document.getElementById('memory-matched').textContent = '0';
    document.getElementById('memory-feedback').textContent = '';
    document.getElementById('btn-memory-restart').style.display = 'none';

    // Embaralhar
    const cards = [...memoryPairs].sort(() => Math.random() - 0.5);
    const board = document.getElementById('memory-board');
    board.innerHTML = '';

    cards.forEach((card, index) => {
        const div = document.createElement('div');
        div.className = 'memory-card';
        div.dataset.id = card.id;
        div.dataset.text = card.text;
        div.dataset.pair = card.pair;
        div.innerHTML = `
            <span class="card-back">❓</span>
            <span class="card-front">${card.text}</span>
        `;
        div.onclick = () => flipCard(div);
        board.appendChild(div);
    });
}

function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('memory-moves').textContent = moves;
        canFlip = false;

        const [c1, c2] = flippedCards;
        const match = (c1.dataset.text === c2.dataset.pair) || (c2.dataset.text === c1.dataset.pair);

        if (match) {
            setTimeout(() => {
                c1.classList.add('matched');
                c2.classList.add('matched');
                matchedCount += 2;
                document.getElementById('memory-matched').textContent = matchedCount / 2;
                flippedCards = [];
                canFlip = true;

                if (matchedCount === memoryPairs.length) {
                    document.getElementById('memory-feedback').textContent = '🌟 Parabéns! Você completou a memória!';
                    document.getElementById('memory-feedback').style.color = '#00b894';
                    document.getElementById('btn-memory-restart').style.display = 'inline-block';
                }
            }, 500);
        } else {
            setTimeout(() => {
                c1.classList.remove('flipped');
                c2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 900);
        }
    }
}

// ==================== JOGO 4: GEOGRAFIA - ASSOCIA ESTADO E CAPITAL ====================
const geoPairs = [
    { state: 'São Paulo', capital: 'São Paulo' },
    { state: 'Rio de Janeiro', capital: 'Rio de Janeiro' },
    { state: 'Minas Gerais', capital: 'Belo Horizonte' },
    { state: 'Bahia', capital: 'Salvador' },
    { state: 'Paraná', capital: 'Curitiba' },
    { state: 'Pernambuco', capital: 'Recife' },
    { state: 'Ceará', capital: 'Fortaleza' },
    { state: 'Amazonas', capital: 'Manaus' }
];

let selectedState = null;
let selectedCapital = null;
let geoMatched = 0;
let geoAttempts = 0;

function startGeoMatch() {
    geoMatched = 0;
    geoAttempts = 0;
    selectedState = null;
    selectedCapital = null;
    document.getElementById('geo-matched').textContent = '0';
    document.getElementById('geo-attempts').textContent = '0';
    document.getElementById('match-feedback').textContent = 'Clique em um estado e depois na capital correspondente!';
    document.getElementById('match-feedback').style.color = '#636e72';
    document.getElementById('btn-geo-restart').style.display = 'none';

    // Embaralhar estados e capitais separadamente
    const states = geoPairs.map(p => p.state).sort(() => Math.random() - 0.5);
    const capitals = geoPairs.map(p => p.capital).sort(() => Math.random() - 0.5);

    const stateCol = document.getElementById('states-column');
    const capCol = document.getElementById('capitals-column');
    stateCol.innerHTML = '<h3>Estados</h3>';
    capCol.innerHTML = '<h3>Capitais</h3>';

    states.forEach(state => {
        const div = document.createElement('div');
        div.className = 'match-item';
        div.textContent = state;
        div.dataset.value = state;
        div.dataset.type = 'state';
        div.onclick = () => selectMatchItem(div);
        stateCol.appendChild(div);
    });

    capitals.forEach(cap => {
        const div = document.createElement('div');
        div.className = 'match-item';
        div.textContent = cap;
        div.dataset.value = cap;
        div.dataset.type = 'capital';
        div.onclick = () => selectMatchItem(div);
        capCol.appendChild(div);
    });
}

function selectMatchItem(item) {
    if (item.classList.contains('matched')) return;

    if (item.dataset.type === 'state') {
        // Desselecionar anterior
        document.querySelectorAll('#states-column .match-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        selectedState = item;
    } else {
        document.querySelectorAll('#capitals-column .match-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        selectedCapital = item;
    }

    // Verificar se ambos selecionados
    if (selectedState && selectedCapital) {
        geoAttempts++;
        document.getElementById('geo-attempts').textContent = geoAttempts;

        const pair = geoPairs.find(p => p.state === selectedState.dataset.value);
        const isCorrect = pair && pair.capital === selectedCapital.dataset.value;

        if (isCorrect) {
            selectedState.classList.add('matched');
            selectedCapital.classList.add('matched');
            selectedState.classList.remove('selected');
            selectedCapital.classList.remove('selected');
            geoMatched++;
            document.getElementById('geo-matched').textContent = geoMatched;
            document.getElementById('match-feedback').textContent = '✅ Correto!';
            document.getElementById('match-feedback').style.color = '#00b894';

            if (geoMatched === geoPairs.length) {
                document.getElementById('match-feedback').textContent = '🗺️ Parabéns! Você associou todas as capitais!';
                document.getElementById('btn-geo-restart').style.display = 'inline-block';
            }
        } else {
            selectedState.classList.add('wrong-temp');
            selectedCapital.classList.add('wrong-temp');
            document.getElementById('match-feedback').textContent = '❌ Não corresponde. Tente de novo!';
            document.getElementById('match-feedback').style.color = '#e17055';

            setTimeout(() => {
                selectedState.classList.remove('selected', 'wrong-temp');
                selectedCapital.classList.remove('selected', 'wrong-temp');
            }, 700);
        }

        selectedState = null;
        selectedCapital = null;
    }
}

// ==================== JOGO 5: HISTÓRIA - LINHA DO TEMPO ====================
const timelineEvents = [
    { id: 1, year: 1500, text: '📜 Chegada dos portugueses ao Brasil (1500)' },
    { id: 2, year: 1822, text: '🇧🇷 Independência do Brasil (1822)' },
    { id: 3, year: 1888, text: '🔗 Abolição da Escravidão - Lei Áurea (1888)' },
    { id: 4, year: 1889, text: '🏛️ Proclamação da República (1889)' },
    { id: 5, year: 1960, text: '🏙️ Brasília se torna a capital (1960)' }
];

let playerOrder = [];
let timelineCompleted = false;

function startTimeline() {
    playerOrder = [];
    timelineCompleted = false;
    document.getElementById('timeline-feedback').textContent = '';
    document.getElementById('btn-check-order').style.display = 'inline-block';
    document.getElementById('btn-timeline-restart').style.display = 'none';

    // Embaralhar eventos
    const shuffled = [...timelineEvents].sort(() => Math.random() - 0.5);
    const container = document.getElementById('timeline-events');
    container.innerHTML = '';

    shuffled.forEach((ev, index) => {
        const div = document.createElement('div');
        div.className = 'timeline-event';
        div.dataset.id = ev.id;
        div.dataset.year = ev.year;
        div.innerHTML = `<span class="order-num">${index + 1}</span> <span>${ev.text}</span>`;
        div.onclick = () => selectTimelineEvent(div);
        container.appendChild(div);
    });
}

function selectTimelineEvent(el) {
    if (timelineCompleted) return;

    if (el.classList.contains('selected')) {
        // Desselecionar
        el.classList.remove('selected');
        playerOrder = playerOrder.filter(id => id !== el.dataset.id);
        updateOrderNumbers();
        return;
    }

    if (playerOrder.length >= timelineEvents.length) return;

    el.classList.add('selected');
    playerOrder.push(el.dataset.id);
    updateOrderNumbers();
}

function updateOrderNumbers() {
    const events = document.querySelectorAll('.timeline-event');
    events.forEach(ev => {
        const numSpan = ev.querySelector('.order-num');
        const pos = playerOrder.indexOf(ev.dataset.id);
        if (pos >= 0) {
            numSpan.textContent = pos + 1;
        } else {
            // Manter o número visual original ou limpar
            numSpan.textContent = '•';
        }
    });
}

function checkTimelineOrder() {
    if (playerOrder.length < timelineEvents.length) {
        document.getElementById('timeline-feedback').textContent = '⚠️ Selecione todos os eventos na ordem!';
        document.getElementById('timeline-feedback').style.color = '#e17055';
        return;
    }

    // Verificar se está em ordem cronológica
    const correctOrder = [...timelineEvents].sort((a, b) => a.year - b.year).map(e => String(e.id));
    const isCorrect = playerOrder.every((id, i) => id === correctOrder[i]);

    if (isCorrect) {
        timelineCompleted = true;
        document.getElementById('timeline-feedback').textContent = '🎉 Perfeito! Você ordenou a História corretamente!';
        document.getElementById('timeline-feedback').style.color = '#00b894';
        document.getElementById('btn-check-order').style.display = 'none';
        document.getElementById('btn-timeline-restart').style.display = 'inline-block';

        // Marcar todos como corretos
        document.querySelectorAll('.timeline-event').forEach(el => {
            el.classList.add('correct-pos');
            el.classList.remove('selected');
        });
    } else {
        document.getElementById('timeline-feedback').textContent = '❌ Ainda não está na ordem certa. Tente novamente!';
        document.getElementById('timeline-feedback').style.color = '#e17055';

        // Limpar seleção para tentar de novo
        document.querySelectorAll('.timeline-event').forEach(el => el.classList.remove('selected'));
        playerOrder = [];
        updateOrderNumbers();
    }
}
