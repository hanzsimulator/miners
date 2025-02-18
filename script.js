let coins = 0;
let incomePerTap = 1;
let miniAutoTapActive = false;
let miniAutoTapInterval;
let farmLevel = 1;
let farmIncome = 5;
let farmActive = false;
let farmInterval;
let ownedCryptos = {};

const cryptos = [
    { id: 1, name: "Bitcoin", price: 3000000, profit: 1500 },
    { id: 2, name: "Ethereum", price: 200000, profit: 1000 },
    { id: 3, name: "Litecoin", price: 15000, profit: 500 },
    { id: 4, name: "Usd", price: 10000, profit: 300 },
    { id: 5, name: "Tron", price: 1000, profit: 50 },
    { id: 6, name: "Dogecoin", price: 50, profit: 25 }
];

const coinsDisplay = document.getElementById("coins");
const tapButton = document.getElementById("tapButton");
const autoTapButton = document.getElementById("autoTapButton");
const farmLevelDisplay = document.getElementById("farmLevel");
const farmIncomeDisplay = document.getElementById("farmIncome");
const upgradeFarmButton = document.getElementById("upgradeFarmButton");
const autoFarmButton = document.getElementById("autoFarmButton");
const cryptoContainer = document.getElementById("cryptoContainer");

// 📌 Load data dari localStorage
function loadGame() {
    const savedCoins = localStorage.getItem("coins");
    const savedFarmLevel = localStorage.getItem("farmLevel");
    const savedFarmIncome = localStorage.getItem("farmIncome");
    const savedMiniAutoTap = localStorage.getItem("miniAutoTapActive");
    const savedFarmActive = localStorage.getItem("farmActive");
    const savedOwnedCryptos = localStorage.getItem("ownedCryptos");

    if (savedCoins) coins = parseInt(savedCoins);
    if (savedFarmLevel) farmLevel = parseInt(savedFarmLevel);
    if (savedFarmIncome) farmIncome = parseInt(savedFarmIncome);
    if (savedMiniAutoTap === "true") enableAutoTap();
    if (savedFarmActive === "true") enableAutoFarm();
    if (savedOwnedCryptos) ownedCryptos = JSON.parse(savedOwnedCryptos);

    updateUI();
}

// 📌 Simpan data ke localStorage
function saveGame() {
    localStorage.setItem("coins", coins);
    localStorage.setItem("farmLevel", farmLevel);
    localStorage.setItem("farmIncome", farmIncome);
    localStorage.setItem("miniAutoTapActive", miniAutoTapActive);
    localStorage.setItem("farmActive", farmActive);
    localStorage.setItem("ownedCryptos", JSON.stringify(ownedCryptos));
}

// 📌 Update tampilan UI
function updateUI() {
    coinsDisplay.innerText = `Money : ${coins}`;
    farmLevelDisplay.innerText = `Farm Level: ${farmLevel}`;
    farmIncomeDisplay.innerText = `Income: +${farmIncome} Coins/10s`;

    // Update jumlah crypto yang dimiliki
    document.querySelectorAll(".crypto-card").forEach(card => {
        const cryptoName = card.getAttribute("data-name");
        const amountDisplay = card.querySelector(".crypto-amount");
        amountDisplay.innerText = `Owned: ${ownedCryptos[cryptoName] || 0}`;
    });
}

// 📌 Tap untuk mendapatkan koin
tapButton.addEventListener("click", () => {
    coins += incomePerTap;
    updateUI();
    saveGame();
});

// 📌 Aktifkan Auto Tap
function enableAutoTap() {
    if (!miniAutoTapActive) {
        miniAutoTapActive = true;
        miniAutoTapInterval = setInterval(() => {
            coins += incomePerTap;
            updateUI();
            saveGame();
        }, 1000);
        autoTapButton.innerText = "✅ Auto Tap Active!";
        autoTapButton.disabled = true;
    }
}

autoTapButton.addEventListener("click", () => {
    if (coins >= 100) {
        coins -= 100;
        enableAutoTap();
        saveGame();
    }
});

// 📌 Upgrade Farm
upgradeFarmButton.addEventListener("click", () => {
    if (coins >= 500) {
        coins -= 500;
        farmLevel++;
        farmIncome += 5;
        updateUI();
        saveGame();
    }
});

// 📌 Aktifkan Auto Farm
function enableAutoFarm() {
    if (!farmActive) {
        farmActive = true;
        farmInterval = setInterval(() => {
            coins += farmIncome;
            updateUI();
            saveGame();
        }, 10000);
        autoFarmButton.innerText = "✅ Auto Farm Active!";
        autoFarmButton.disabled = true;
    }
}

autoFarmButton.addEventListener("click", () => {
    if (coins >= 1000) {
        coins -= 1000;
        enableAutoFarm();
        saveGame();
    }
});

// 📌 Beli Crypto untuk Passive Income
function buyCrypto(cryptoId) {
    const crypto = cryptos.find(c => c.id === cryptoId);
    if (!crypto || coins < crypto.price) return;

    coins -= crypto.price;
    if (!ownedCryptos[crypto.name]) {
        ownedCryptos[crypto.name] = 0;
    }
    ownedCryptos[crypto.name]++;
    updateUI();
    saveGame();
}

// 📌 Generate Kartu Crypto
function generateCryptoCards() {
    cryptos.forEach(crypto => {
        const card = document.createElement("div");
        card.classList.add("crypto-card");
        card.setAttribute("data-name", crypto.name);
        card.innerHTML = `
            <h3>${crypto.name}</h3>
            <p>Price: ${crypto.price} Coins</p>
            <p>Profit: +${crypto.profit} Coins/s</p>
            <p class="crypto-amount">Owned: 0</p>
            <button class="buy-button" data-id="${crypto.id}">Buy</button>
        `;
        cryptoContainer.appendChild(card);
    });

    // 📌 Tambahkan event listener ke semua tombol beli
    document.querySelectorAll(".buy-button").forEach(button => {
        button.addEventListener("click", (event) => {
            const cryptoId = parseInt(event.target.getAttribute("data-id"));
            buyCrypto(cryptoId);
        });
    });
}

// 📌 Passive income dari crypto setiap detik
setInterval(() => {
    let totalProfit = 0;
    Object.keys(ownedCryptos).forEach(cryptoName => {
        const crypto = cryptos.find(c => c.name === cryptoName);
        if (crypto) {
            totalProfit += ownedCryptos[cryptoName] * crypto.profit;
        }
    });
    coins += totalProfit;
    updateUI();
    saveGame();
}, 1000);

// 🔥 Load game dan generate UI
loadGame();
generateCryptoCards();
