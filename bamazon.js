var mysql = require("mysql");
var inquire = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("Connection established! id: " + connection.threadId);
    runBamazon();
})

var items = [];
var itemsIDArray = [];
var itemBought = 0;

function runBamazon() {
    inquire
        .prompt([
            {
                type: "list",
                message: "Are you looking to shop for items?",
                choices: ["Yes", "No"],
                name: "isShopping"
            }
        ]).then(function (shopping) {

            switch (shopping.isShopping) {
                case "Yes":
                    showItems();
                    function showItems() {
                        connection.query("SELECT * FROM items", function (err, res) {
                            if (err) throw err;
                            for (var i = 0; i < res.length; i++) {
                                console.log("ID #" + res[i].id);
                                console.log("Name: " + res[i].NAME)
                                console.log("Category: " + res[i].TYPE)
                                console.log("Price: $" + res[i].PRICE);
                                console.log("");
                                items = res;
                            }
                            console.log("-----------------------------------");

                        });

                        inquire.prompt({
                            name: "selectedItem",
                            message: "Please select the number of the item you wish to purchase",
                            type: "list",
                            choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
                        }).then(function (buyItem) {
                            itemBought = parseInt(items[buyItem.selectedItem - 1].quantity);
                            
                            inquire.prompt({
                                name: "quanitity",
                                message: "How many do you want to purchase?",
                                type: "list",
                                choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
                            }).then(function (updateQuantity) {
                                connection.query("UPDATE items SET quantity = ?  WHERE id = ?", [itemBought-updateQuantity.quanitity, buyItem.selectedItem],
                                    function (err, res) {
                                        if (err) throw err;

                                    });
                                console.log("Your Order Has Been Placed!")
                                runBamazon();
                            });

                        });
                    };
            
                case "No":
            console.log("Thank you for visiting Bamazon!")
            connection.end;
                };
        });
}

