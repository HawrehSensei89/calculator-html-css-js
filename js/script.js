document.addEventListener('DOMContentLoaded', () => {
    const output = document.querySelector('.Output h1');
    const buttons = document.querySelectorAll('.buttons button');

    let expression = '';
    let justEvaluated = false;

    const updateDisplay = () => {
        output.textContent = expression === '' ? '0' : expression;
    };

    const isOperator = (ch) => ['+', '-', '×', '÷'].includes(ch);

    const appendValue = (val) => {
        if (justEvaluated) {
            if (isOperator(val)) {
                justEvaluated = false; // continue from result
            } else {
                expression = ''; // start fresh
                justEvaluated = false;
            }
        }

        if (val === '.') {
            const parts = expression.split(/[\+\-\×\÷]/);
            const lastPart = parts[parts.length - 1];
            if (lastPart.includes('.')) return;
            if (expression === '' || isOperator(expression.slice(-1))) {
                expression += '0.';
            } else {
                expression += '.';
            }
            updateDisplay();
            return;
        }

        if (isOperator(val)) {
            if (expression === '') return; // no leading operator
            if (isOperator(expression.slice(-1))) {
                expression = expression.slice(0, -1) + val; // replace last operator
            } else {
                expression += val;
            }
            updateDisplay();
            return;
        }

        // digit
        expression += val;
        updateDisplay();
    };

    const clearAll = () => {
        expression = '';
        justEvaluated = false;
        updateDisplay();
    };

    const backspace = () => {
        if (justEvaluated) {
            clearAll();
            return;
        }
        expression = expression.slice(0, -1);
        updateDisplay();
    };

    const percent = () => {
        const match = expression.match(/(\d+\.?\d*)$/);
        if (!match) return;
        const num = parseFloat(match[0]);
        const percentVal = num / 100;
        expression = expression.slice(0, expression.length - match[0].length) + percentVal;
        updateDisplay();
    };

    const toggleParens = () => {
        const openCount = (expression.match(/\(/g) || []).length;
        const closeCount = (expression.match(/\)/g) || []).length;

        if (openCount === closeCount) {
            expression += (isOperator(expression.slice(-1)) || expression === '') ? '(' : '×(';
        } else {
            expression += ')';
        }
        updateDisplay();
    };

    const evaluate = () => {
        try {
            const safeExpr = expression.replace(/×/g, '*').replace(/÷/g, '/');
            if (safeExpr.trim() === '') return;

            const result = Function('"use strict"; return (' + safeExpr + ')')();

            if (result === undefined || Number.isNaN(result) || !Number.isFinite(result)) {
                expression = 'Error';
            } else {
                expression = String(result);
            }
            justEvaluated = true;
            updateDisplay();
        } catch (err) {
            expression = 'Error';
            justEvaluated = true;
            updateDisplay();
        }
    };

    buttons.forEach((btn) => {
        const icon = btn.querySelector('i');
        const text = btn.textContent.trim();

        btn.addEventListener('click', () => {
            if (icon && icon.classList.contains('ri-delete-back-2-line')) return backspace();
            if (icon && icon.classList.contains('ri-divide-line')) return appendValue('÷');
            if (icon && icon.classList.contains('ri-add-line')) return appendValue('+');

            switch (text) {
                case 'Ac': clearAll(); break;
                case '%': percent(); break;
                case '×': appendValue('×'); break;
                case '-': appendValue('-'); break;
                case '=': evaluate(); break;
                case '()': toggleParens(); break;
                case '.': appendValue('.'); break;
                default:
                    if (/^[0-9]$/.test(text)) appendValue(text);
                    break;
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (/^[0-9]$/.test(key)) appendValue(key);
        else if (key === '.') appendValue('.');
        else if (key === '+') appendValue('+');
        else if (key === '-') appendValue('-');
        else if (key === '*') appendValue('×');
        else if (key === '/') { e.preventDefault(); appendValue('÷'); }
        else if (key === 'Enter' || key === '=') { e.preventDefault(); evaluate(); }
        else if (key === 'Backspace') backspace();
        else if (key === 'Escape') clearAll();
        else if (key === '%') percent();
    });

    const moonBtn = document.querySelector('.dark-light-btn .ri-moon-fill');
    const sunBtn = document.querySelector('.dark-light-btn .ri-sun-line');
    if (moonBtn && sunBtn) {
        moonBtn.parentElement.addEventListener('click', () => document.body.classList.remove('light-mode'));
        sunBtn.parentElement.addEventListener('click', () => document.body.classList.add('light-mode'));
    }

    const lightTheme = document.getElementById('light-theme');
const darkTheme = document.getElementById('dark-theme');

moonBtn.parentElement.addEventListener('click', () => {
    darkTheme.disabled = false;
    lightTheme.disabled = true;
});
sunBtn.parentElement.addEventListener('click', () => {
    lightTheme.disabled = false;
    darkTheme.disabled = true;
});

    updateDisplay();
});