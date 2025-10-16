// Canvas cyber background (simple animated lines)
const canvas = document.getElementById('cyber-bg-canvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawCyberBg() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 25; i++) {
        ctx.strokeStyle = `rgba(46,216,255,${0.07 + Math.random()*0.03})`;
        ctx.beginPath();
        ctx.moveTo(Math.random()*canvas.width, Math.random()*canvas.height);
        ctx.lineTo(Math.random()*canvas.width, Math.random()*canvas.height);
        ctx.stroke();
    }
    requestAnimationFrame(drawCyberBg);
}
drawCyberBg();

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
function setTheme(light) {
    if (light) {
        document.body.classList.add('light');
        document.getElementById('theme-icon').textContent = '🌞';
    } else {
        document.body.classList.remove('light');
        document.getElementById('theme-icon').textContent = '🌙';
    }
}
themeToggle.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('light'));
});
if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    setTheme(true);
}

// Policy panel toggle & save
const policyToggle = document.getElementById('policy-toggle');
const policyPanel = document.getElementById('policy-panel');
policyToggle.addEventListener('click', () => {
    policyPanel.classList.toggle('hidden');
    policyToggle.setAttribute('aria-expanded', !policyPanel.classList.contains('hidden'));
});
document.getElementById('save-policy').addEventListener('click', () => {
    policyPanel.classList.add('hidden');
    policyToggle.setAttribute('aria-expanded', false);
    updateCriteria();
});

// Password strength and policy
function updateCriteria() {
    const password = document.getElementById('password').value;
    const minLength = parseInt(document.getElementById('min-length').value, 10);
    const requireUpper = document.getElementById('require-upper').checked;
    const requireLower = document.getElementById('require-lower').checked;
    const requireNumber = document.getElementById('require-number').checked;
    const requireSymbol = document.getElementById('require-symbol').checked;
    const criteriaList = document.getElementById('criteria-list');
    criteriaList.innerHTML = '';
    let passed = 0, total = 5;

    function addCriteria(text, ok) {
        const li = document.createElement('li');
        li.textContent = (ok ? "✅ " : "❌ ") + text;
        criteriaList.appendChild(li);
        if (ok) passed++;
    }

    addCriteria(`Min length: ${minLength}`, password.length >= minLength);
    addCriteria(`Uppercase`, /[A-Z]/.test(password) || !requireUpper);
    addCriteria(`Lowercase`, /[a-z]/.test(password) || !requireLower);
    addCriteria(`Number`, /[0-9]/.test(password) || !requireNumber);
    addCriteria(`Symbol`, /[^A-Za-z0-9]/.test(password) || !requireSymbol);

    // Strength meter
    const strengthBar = document.getElementById('strength-bar');
    strengthBar.style.width = (passed/total*100) + "%";
    strengthBar.style.background =
        ["#e74c3c","#e67e22","#f1c40f","#2ecc71","#3498db"][passed-1] || "#e74c3c";
    document.getElementById('strength-text').textContent =
        ["Very Weak","Weak","Medium","Strong","Excellent"][passed-1] || "";
}
document.getElementById('password').addEventListener('input', updateCriteria);
document.getElementById('min-length').addEventListener('input', updateCriteria);
document.getElementById('require-upper').addEventListener('change', updateCriteria);
document.getElementById('require-lower').addEventListener('change', updateCriteria);
document.getElementById('require-number').addEventListener('change', updateCriteria);
document.getElementById('require-symbol').addEventListener('change', updateCriteria);
updateCriteria();

// Show/hide password
document.getElementById('toggle-password-visibility').addEventListener('click', function () {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
});

// Copy password
document.getElementById('copy-password').addEventListener('click', function () {
    const password = document.getElementById('password').value;
    if (password) navigator.clipboard.writeText(password);
});

// Breach check
// ... rest of your code ...

document.getElementById('breach-check').addEventListener('click', function () {
    document.getElementById('breach-result').textContent = "Coming soon!";
});
// Password generator
function generatePassword(length, upper, lower, number, symbol) {
    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (number) chars += '0123456789';
    if (symbol) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) return '';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
}
document.getElementById('gen-password').addEventListener('click', function () {
    const length = parseInt(document.getElementById('gen-length').value, 10);
    const upper = document.getElementById('gen-upper').checked;
    const lower = document.getElementById('gen-lower').checked;
    const number = document.getElementById('gen-number').checked;
    const symbol = document.getElementById('gen-symbol').checked;
    const pwd = generatePassword(length, upper, lower, number, symbol);
    document.getElementById('suggestion-output').value = pwd; // Show in box
    document.getElementById('password').value = pwd; // Also put in main input for analysis
    updateCriteria();
});

// Copy generated password
document.getElementById('copy-gen').addEventListener('click', function () {
    const pwd = document.getElementById('suggestion-output').value;
    if (pwd) navigator.clipboard.writeText(pwd);
});

// Password history
function addToHistory(password, result) {
    const historyList = document.getElementById('history-list');
    const li = document.createElement('li');
    li.textContent = password + ' – ' + result;
    historyList.insertBefore(li, historyList.firstChild);
}

// PDF export

// PDF export - ONLY password and its quality
document.getElementById('export-pdf').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.text("Password Report", 10, y);
    y += 12;
    doc.setFontSize(12);
    doc.text("Password: " + document.getElementById('password').value, 10, y);
    y += 8;
    doc.text("Quality: " + document.getElementById('strength-text').textContent, 10, y);
    doc.save("PasswordReport.pdf");
});

// Export as image (dummy)
document.getElementById('export-img').addEventListener('click', function () {
    alert('Image export coming soon!');
});
