var player = {
    Offers: [{
        item: "Dirt",
        type: "Sell",
        price: 0.15,
        amnt: 100,
        timer: 100000,
    }, {
        item: "Dirt",
        type: "Buy",
        price: 0.1,
        amnt: 100,
        timer: 100000,
    }],
    Tax: { Buy: 0.1, Sell: 0.1 },
    Cash: 10,
    Items: {},
    NewOfferTimer: 100000,
}


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
            if (confirm("Are you sure u want to buy " + num + " units of " + Offer.item.toLowerCase() + " for " + (num * Offer.price).toFixed(2) + "$ with a sales tax of " + (num * Offer.price * player.Tax[Offer.type]).toFixed(2) + "$? (This would make the net cost " + (num * Offer.price * TaxMulti).toFixed(2) + "$)"))
                player.Cash -= num * Offer.price * TaxMulti;
            if (isNaN(player.Items[Offer.item])) player.Items[Offer.item] = num;
            else player.Items[Offer.item] += num;
            Offer.amnt -= num;
        } else alert("You dont have enough cash!");
    } else if (player.Items[Offer.item] >= num) {
        var TaxMulti = 1 - player.Tax[Offer.type];
        if (confirm("Are you sure u want to sell " + num + " units of " + Offer.item.toLowerCase() + " for " + (num * Offer.price).toFixed(2) + "$ with a sales tax of " + (num * Offer.price * player.Tax[Offer.type]).toFixed(2) + "$? (This would make your net profit " + (num * Offer.price * TaxMulti).toFixed(2) + "$)")) {
            player.Cash += num * Offer.price * TaxMulti;
            player.Items[Offer.item] -= num;
            Offer.amnt -= num;
        }
    } else alert("You dont have enough of that item!");
    UpdateTable();
}


function UpdateTable() {
    var Table = document.getElementById("statsTable");
    Table.rows[0].cells[1].innerHTML = player.Cash.toFixed(2) + "$";
    var Table = document.getElementById("offersTable");
    for (var i = 0; i < player.Offers.length; i++) {
        var Offer = player.Offers[i];
        if (Offer.amnt <= 0 || Offer.timer <= 0) {
            player.Offers.splice(i, 1);
            Table.deleteRow(i);
            continue;
        }
        if (Table.rows.length <= i) {
            var Row = Table.insertRow(i);
            for (var j = 0; j < 5; j++) Row.insertCell(j);
        }
        var Row = Table.rows[i]
        for (var j = 0; j < 4; j++) Row.cells[j].innerHTML = Object.values(Offer)[j];
        Row.cells[4].innerHTML = '<button style="width:100%;" onclick="selectOffer(' + i + ')">Select</button>';
    }
    var Table = document.getElementById("itemsTable");
    for (var i = 0; i < Object.keys(player.Items).length; i++) {
        if (Table.rows.length <= i) {
            var Row = Table.insertRow(i);
            for (var j = 0; j < 2; j++) Row.insertCell(j);
        }
        var Row = Table.rows[i]
        Row.cells[0].innerHTML = Object.keys(player.Items)[i];
        Row.cells[1].innerHTML = Object.values(player.Items)[i];
    }
}

function init() {
    if(localStorage.playerSave != undefined) player = JSON.parse(atob(localStorage.playerSave));
    UpdateTable();
    setInterval(NewOffers, 50);
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
    if (rand >= 1) {
        CreateOffer();
        player.NewOfferTimer += 60000;
        console.log("NewOffer")
    }
    player.NewOfferTimer -= frameTime;
    for (var i = 0; i < player.Offers.length; i++) {
        player.Offers[i].timer -= frameTime;
        if (player.Offers[i] <= 0) UpdateTable();
    }
    
}

function CreateOffer() {
    var temp = {
        item: "",
        type: "",
        price: 0,
        amnt: 0,
        timer: 100000,
    }
    temp.item = "Dirt";
    if (Math.round(Math.random()) === 0) temp.type = "Buy";
    else temp.type = "Sell";
    temp.price = parseFloat((0.1 + Math.random() * 0.05).toFixed(2));
    temp.amnt = Math.max(Math.round(500 * Math.random()), 100);
    player.Offers.push(temp)
    UpdateTable()
}

function reset() {
    player = {
        Offers: [{
            item: "Dirt",
            type: "Sell",
            price: 0.15,
            amnt: 100,
            timer: 100000,
        }, {
            item: "Dirt",
            type: "Buy",
            price: 0.1,
            amnt: 100,
            timer: 100000,
        }],
        Tax: { Buy: 0.1, Sell: 0.1 },
        Cash: 10,
        Items: {},
        NewOfferTimer: 100000,
    }
    UpdateTable();
}

