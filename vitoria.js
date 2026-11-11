// ==========================================================
// MENSAGEM DE FIM DE JOGO (compartilhada por todos os jogos)
// Cada jogo recebe uma CÓPIA deste arquivo como vitoria.js
// (o ferramentas/montar_jogos.py copia). Mudou aqui? Rode o montar.
//
// Como usar dentro de um jogo (depois de <script src="vitoria.js">):
//   Vitoria.mostrar({
//       tipo: 'vitoria',              // 'vitoria' | 'derrota' | 'empate'
//       titulo: 'Você venceu!',       // opcional (tem um padrão por tipo)
//       mensagem: 'Em 12 jogadas',    // opcional: detalhes da partida
//       aoJogarDeNovo: novaPartida,   // opcional: função do botão
//   });
// ==========================================================
(function () {
    const PADRAO = {
        vitoria: { emoji: '🏆', titulo: 'Você venceu!' },
        derrota: { emoji: '💪', titulo: 'Não foi dessa vez' },
        empate:  { emoji: '🤝', titulo: 'Empate!' },
    };
    let caixa = null, acao = null;

    // Monta a caixa uma vez só, na primeira vitória
    function montar() {
        caixa = document.createElement('div');
        caixa.className = 'fim-fundo';
        caixa.setAttribute('role', 'dialog');
        caixa.setAttribute('aria-modal', 'true');
        caixa.innerHTML =
            '<div class="fim-caixa">' +
            '  <div class="fim-emoji" aria-hidden="true"></div>' +
            '  <h2 class="fim-titulo"></h2>' +
            '  <p class="fim-mensagem"></p>' +
            '  <div class="fim-botoes">' +
            '    <button type="button" class="btn-primario fim-de-novo">Jogar de novo</button>' +
            '    <button type="button" class="fim-fechar">Ver tabuleiro</button>' +
            '  </div>' +
            '</div>';
        document.body.appendChild(caixa);
        caixa.querySelector('.fim-de-novo').addEventListener('click', () => { esconder(); if (acao) acao(); });
        caixa.querySelector('.fim-fechar').addEventListener('click', esconder);
        // Clicar fora da caixa ou apertar Esc também fecha
        caixa.addEventListener('click', ev => { if (ev.target === caixa) esconder(); });
        document.addEventListener('keydown', ev => { if (ev.key === 'Escape') esconder(); });
    }

    function esconder() { if (caixa) caixa.classList.remove('mostrar'); }

    // Confete: 40 pedacinhos coloridos caindo com tempos aleatórios
    function confete() {
        const cores = ['#1E3A8A', '#60A5FA', '#F59E0B', '#FB923C', '#34D399', '#F472B6'];
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'confete';
            p.style.left = Math.random() * 100 + 'vw';
            p.style.background = cores[Math.floor(Math.random() * cores.length)];
            p.style.width = p.style.height = 6 + Math.random() * 8 + 'px';
            p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            p.style.animationDuration = 1.8 + Math.random() * 1.6 + 's';
            p.style.animationDelay = Math.random() * 0.4 + 's';
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 4000);
        }
    }

    function mostrar(opcoes) {
        const o = opcoes || {};
        const tipo = PADRAO[o.tipo] ? o.tipo : 'vitoria';
        if (!caixa) montar();
        acao = o.aoJogarDeNovo || null;
        caixa.querySelector('.fim-emoji').textContent = o.emoji || PADRAO[tipo].emoji;
        caixa.querySelector('.fim-titulo').textContent = o.titulo || PADRAO[tipo].titulo;
        const msg = caixa.querySelector('.fim-mensagem');
        msg.textContent = o.mensagem || '';
        msg.hidden = !o.mensagem;
        caixa.querySelector('.fim-de-novo').hidden = !acao;
        caixa.className = 'fim-fundo mostrar fim-' + tipo;
        // pequena pausa: deixa a última jogada aparecer antes da caixa
        if (tipo === 'vitoria') confete();
        setTimeout(() => caixa.querySelector(acao ? '.fim-de-novo' : '.fim-fechar').focus(), 50);
    }

    window.Vitoria = { mostrar, esconder };
})();
