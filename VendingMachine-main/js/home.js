var value = 0;
changeQuarters = 0;
changeDimes = 0;
changeNickels = 0;
changePennies = 0;

$(document).ready(function () {

    loadItems();
    $('#TotalMoneyIn').val('');
    $('#Messages').val('');
    $('#ItemId').val('');
    $('#Change').val('');

});


// load items from REST API service to an HTML table
function loadItems() {

    var vendingTable = $('#vendingTable');
    $('#vendingTable').empty();

    // retrieve and display existing data using GET request
    $.ajax({
        type: 'GET',
        url: 'http://tsg-vending.herokuapp.com/items',
        success: function (itemArray) {
            $.each(itemArray, function (index, item) {
                //retrieve and store the values
                var id = item.id;
                var name = item.name;
                var price = item.price;
                var quantity = item.quantity;

                // build a table using the retrieved values
                var info = '<div class="vendingTable col-md-4 float-left" style="text-align: center; margin-top 30 px width="30%"><button6 class="btn7" onclick = "selectItem(' + id + ')" > ';
                info += '<p style= "text-align: left">' + id + '</p>';
                info += '<p>' + name + '</p>';
                info += '<p>' + '$' + price + '</p>';
                info += '<p>' + 'Quantity left: ' + quantity + '</p>';
                info += '</button></div>';

                vendingTable.append(info); 

            })
        },

        // create error function to display API error messages
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
        }
    });
}


//adding the money value to the buttons//
function addDollar() {
        value += 1;
    $('#TotalMoneyIn').val(value.toFixed(2));
}

function addQuarter() {
    value += .25;
    $('#TotalMoneyIn').val(value.toFixed(2));
}

function addDime() {
    value += .10;
    $('#TotalMoneyIn').val(value.toFixed(2));
}

function addNickel() {
    value += .05;
    $('#TotalMoneyIn').val(value.toFixed(2));
}


//This allows the id to pass through to the ItemId input
function selectItem(id) {
    $('#ItemId').val(id);
    $('#TotalMoneyIn').val('');
        value = 0;
    $('#Messages').val('');
    $('#Change').val('');
}


// Vending an Item
function vendItem() {
    id = $('#ItemId').val()

    // Ajax call to POST 
    $.ajax({

        type: 'POST',
        url: 'http://tsg-vending.herokuapp.com/money/' + value + '/item/' + id,
        'success': function (data) {

            changeQuarters = data.quarters;
            changeDimes = data.dimes;
            changeNickels = data.nickels;
            changePennies = data.pennies;

                //This helps to determine if there is an 's' or not
                quarterStr = changeQuarters == 1 ? 'quarter' : 'quarters';
                dimeStr = changeDimes == 1 ? 'dime' : 'dimes';
                nickelStr = changeNickels == 1 ? 'nickel' : 'nickels';
                pennyStr = changePennies == 1 ? 'penny' : 'pennies';
       
                formatChange = "";

                //This would determine if variable would show or not plus formats the change in the order that is needed
                 if (changeQuarters >  0) {
                formatChange += quarterStr + ':' + changeQuarters + ',';
                  };

                 if (changeDimes > 0) {
                formatChange += dimeStr + ':' + changeDimes + ',';
                 };

                 if (changeNickels > 0) {
                formatChange += nickelStr + ':' + changeNickels + ',';
                 };

                if (changePennies > 0) {
                formatChange += pennyStr + ':' + changePennies;
                };

            loadItems();
            $('#Change').val(formatChange);
            $('#Messages').val('Thank You!!!')
            $('#TotalMoneyIn').val('');   
            value = 0;
        },

        'error': function (xhr, status, error) {
            $('#Messages').val(xhr.responseJSON['message'])
        }
    })
}

function returnChange() {

    //To find how many coins are in the total
    quarterNum = Math.floor(value / .25)
    value = value - quarterNum * .25

    dimesNum = Math.floor(value / .10)
    value = value - dimesNum * .10

    nickelNum = Math.floor(value / .05)
    value = value - nickelNum * .05

    penniesNum = Math.floor(value)

   

    //This helps to determine if there is an 's' or not
    quarterNumStr = quarterNum == 1 ? 'quarter' : 'quarters';
    dimeNumStr = dimesNum == 1 ? 'dime' : 'dimes';
    nickelNumStr = nickelNum == 1 ? 'nickel' : 'nickels';
    penniesNumStr = penniesNum == 1 ? 'penny' : 'pennies';

    formatChange = "";

    //This would determine if variable would show or not plus formats the change in the order that is needed
    if (quarterNum > 0) {
        formatChange += quarterNumStr + ':' + quarterNum + ',';
    };

    if (dimesNum > 0) {
        formatChange += dimeNumStr + ':' + dimesNum + ',';
    };

    if (nickelNum > 0) {
        formatChange += nickelNumStr + ':' + nickelNum + ',';
    };

    if (penniesNum > 0) {
        formatChange += penniesNumStr + ':' + penniesNum;
    };

    $('#Change').val(formatChange);

    $('#Messages').val('');
    $('#ItemId').val('');
    $('#TotalMoneyIn').val('');
    value = 0;
};
