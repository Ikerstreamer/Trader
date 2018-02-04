var player = {
    version:0.001,
    Offers: [{
        item: "Dirt",
        type: "Buy",
        price: 0.1,
        amnt: 300,
        timer: 200000,
    }, {
        item: "Dirt",
        type: "Sell",
        price: 0.15,
        amnt: 300,
        timer: 200000,
    }],
    price: {min:1,max:2},
    Tax: { Buy: 0.1, Sell: 0.1 },
    Cash: 25,
    Items: {},
    Upgrades: [{
        name: "Increase max price",
        cost: 10,
        scaling: 0.5,
        effect: 0.1,
        variable: function () { return player.price.max },
        action: function () {
            if (player.Cash >= this.cost) {
                player.Cash -= this.cost;
                player.price.max += this.effect;
                this.cost *= this.scaling;
                UpdateTable();
            }
        },
    },
    {
        name: "Increase min price",
        cost: 10,
        scaling: 0.5,
        effect: 0.1,
        variable: function () { return player.price.min },
        action: function () {
            if (player.Cash >= this.cost) {
                player.Cash -= this.cost;
                player.price.min += this.effect;
                this.cost *= this.scaling;
                UpdateTable();
            }
        },
    }],
    NewOfferTimer: 100000,
}

var allUpgrades = [{
    name: "Increase max price",
    cost: 10,
    scaling: 0.5,
    effect: 0.1,
    variable: function () { return player.price.max },
    action: function () {
        if (player.Cash >= this.cost) {
            player.Cash -= this.cost;
            player.price.max += this.effect;
            this.cost *= this.scaling;
            UpdateTable();
        }
    },
},
    {
    name: "Increase min price",
    cost: 10,
    scaling: 0.5,
    effect: 0.1,
    variable: function () { return player.price.min },
    action: function () {
        if (player.Cash >= this.cost) {
            player.Cash -= this.cost;
            player.price.min += this.effect;
            this.cost *= this.scaling;
            UpdateTable();
        }
    },
} ];

function selectOffer(index) {
    var Offer = player.Offers[index];
    do {
        var temp = prompt('How many units do you want to ' + Offer.type.toLowerCase() + '? (You can sell all by entering "all")', 1)
        if (temp == null) return;
        if (temp == "all") temp = Offer.amnt.toString();
    }
    while (isNaN(temp) || Offer.amnt < temp || temp == "");
    var num = parseInt(temp);
    if (Offer.type == "Buy") {
        var TaxMulti = 1 + player.Tax[Offer.type]
        if ((num * Offer.price) * TaxMulti <= player.Cash) {
            if (confirm("Are you sure u want to buy " + num + " units of " + Offer.item.toLowerCase() + " for $" + (num * Offer.price).toFixed(2) + " with a sales tax of "+ player.Tax[Offer.type] +"% ($"+ (num * Offer.price * player.Tax[Offer.type]).toFixed(2) + ")? (This would make the net cost $" + (num * Offer.price * TaxMulti).toFixed(2) + ")"))
                player.Cash -= num * Offer.price * TaxMulti;
            if (isNaN(player.Items[Offer.item])) player.Items[Offer.item] = num;
            else player.Items[Offer.item] += num;
            Offer.amnt -= num;
        } else alert("You dont have enough cash!");
    } else if (player.Items[Offer.item] >= num) {
        var TaxMulti = 1 - player.Tax[Offer.type];
        if (confirm("Are you sure u want to sell " + num + " units of " + Offer.item.toLowerCase() + " for $" + (num * Offer.price).toFixed(2) + " with a sales tax of "+player.Tax[Offer.type]+"% ($" + (num * Offer.price * player.Tax[Offer.type]).toFixed(2) + ")? (This would make your net profit $" + (num * Offer.price * TaxMulti).toFixed(2) + ")")) {
            player.Cash += num * Offer.price * TaxMulti;
            player.Items[Offer.item] -= num;
            Offer.amnt -= num;
        }
    } else alert("You dont have enough of that item!");
    UpdateTable();
}

function buyUpgrade(index) {player.Upgrades[index].action()}

function UpdateTable() {
    var Table = document.getElementById("statsTable");
    Table.rows[0].cells[1].innerHTML = player.Cash.toFixed(2) + "$";
    var Table = document.getElementById("offersTable");
    player.Offers = player.Offers.filter((offer) => offer.amnt > 0 && offer.timer > 0)
    for (var i = 0; i < player.Offers.length; i++) {
        var Offer = player.Offers[i];
        if (Table.rows.length <= i) {
            var Row = Table.insertRow(i);
            for (var j = 0; j < 5; j++) Row.insertCell(j);
        }
        var Row = Table.rows[i]
        for (var j = 0; j < 4; j++) Row.cells[j].innerHTML = Object.values(Offer)[j];
        Row.cells[4].innerHTML = '<button style="width:100%;" onclick="selectOffer(' + i + ')">Select</button>';
    }
    for (var i = Table.rows.length; i > player.Offers.length; i--) Table.deleteRow(i-1);
    var Table = document.getElementById("itemsTable");
    if (Object.keys(player.Items).length > 0) Table.parentNode.parentNode.classList.remove("hidden");
    for (var i = 0; i < Object.keys(player.Items).length; i++) {
        if (Table.rows.length <= i) {
            var Row = Table.insertRow(i);
            for (var j = 0; j < 2; j++) Row.insertCell(j);
        }
        var Row = Table.rows[i]
        Row.cells[0].innerHTML = Object.keys(player.Items)[i];
        Row.cells[1].innerHTML = Object.values(player.Items)[i];
    }
    var Table = document.getElementById("upgradesTable");
    if (player.Upgrades.length > 0) Table.parentNode.parentNode.classList.remove("hidden");
    for (var i = 0; i < player.Upgrades.length; i++) {
        var Upgrade = player.Upgrades[i];
        if (Table.rows.length <= i) {
            var Row = Table.insertRow(i);
            for (var j = 0; j < 5; j++) Row.insertCell(j);
        }
        var Row = Table.rows[i]
        Row.cells[0].innerHTML = Upgrade.name;
        Row.cells[1].innerHTML = Math.round(Upgrade.variable() * 100) + "%";
        Row.cells[2].innerHTML = Upgrade.effect * 100 + "%";
        Row.cells[3].innerHTML = "$" + Upgrade.cost.toFixed(2);
        Row.cells[4].innerHTML = '<button style="width:100%;" onclick="buyUpgrade(' + i + ')">Buy</button>';
    }
}

function init() {
    window.resetPlayer = player;
    if (localStorage.playerSave != undefined || localStorage.playerSave != null) player = JSON.parse(atob(localStorage.playerSave));
    UpdateTable();
    window.start = Date.now();
    window.clock = 0;
    window.frameTime = 50;

    setInterval(function () {
        var now = Date.now();
        clock += frameTime;
        var dif = now - start - clock;

        NewOffers();

        while (dif >= frameTime) {
            NewOffers();
            clock += frameTime;
            dif -= frameTime;
        }
    }, 50)

    setInterval(function(){
        localStorage.setItem("playerSave",btoa(JSON.stringify(player)));
    },10000)
}

function NewOffers() {
    if (player.NewOfferTimer > 1) var rand = player.NewOfferTimer / (Math.random() * Math.pow(player.NewOfferTimer, 1.55));
    else var rand = 1;
    if (rand >= 0.25*player.Offers.length) {
        CreateOffer();
        player.NewOfferTimer += 60000;
        console.log("NewOffer")
    }
    player.NewOfferTimer -= frameTime;
    for (var i = 0; i < player.Offers.length; i++) {
        player.Offers[i].timer -= frameTime;
        if (player.Offers[i].timer <= 0) UpdateTable();
    }
    
}

function CreateOffer() {
    var temp = {
        item: "",
        type: "",
        price: 0,
        amnt: 0,
        timer: 800000,
    }
    temp.item = "Dirt";
    if (Math.round(Math.random()) === 0) temp.type = "Buy";
    else temp.type = "Sell";
    temp.price = parseFloat(Math.max(Math.min(Math.random() * 0.1 * player.price.max * 2, 0.1 * player.price.max), 0.1 * player.price.min).toFixed(2));
    temp.amnt = Math.max(Math.round(500 * Math.random()), 100);
    player.Offers.push(temp)
    UpdateTable()
}

function reset() {
    player = resetPlayer;
    UpdateTable();
}

