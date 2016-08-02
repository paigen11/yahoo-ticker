//make an array to stash the symbols we want to save for later
var symbolGroup = [];
// global for retrieve and save buttons
var content;


$(document).ready(function(){
	// the container for the number of symbols, so you know how many are saved
	var savedList = document.getElementsByClassName('number-of-symbols')[0];
	savedList.innerHTML == localStorage.length;

	// add a submit handler for our form
	$('.yahoo-form').on('submit',function(){
		// stop the form from submitting when the user clicks or pushes enter
		event.preventDefault();
		// get whatever the user put in the input field
		var symbol = $('#symbol').val();

		var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("' + symbol + '")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
		console.log(url);

		$.getJSON(url, function(theDataJsFoundIfAny){
			// console.log(theDataJsFoundIfAny);
			var stockInfo = theDataJsFoundIfAny.query.results.quote;
			var stockCount = theDataJsFoundIfAny.query.count;
			var newHTML = '';
			// if there's more than one stock being searched for, loop through
			if (stockCount > 1){
				for(var i = 0; i <stockInfo.length; i++){
					newHTML += buildNewTable(stockInfo[i]);
				}
				// $('.yahoo-body').append(newHTML);
			}else{
				// otherwise, just go through it once
				newHTML += buildNewTable(stockInfo);
			}
			$('.yahoo-body').html(newHTML);
			$('.table').DataTable();

			$('.save-button').click(function(){
                //go up to the parent of the this button(the + button), then back down to the symbol child to get its letters
                content = $(this).parents('tr').children('.symbol')[0].innerHTML;
                console.log(content);
                console.log($(this));
                symbolGroup.push(content);
                localStorage.setItem(symbolGroup.length, content);
                savedList.innerHTML++;
            });

            $('.retrieve-button').click(function(){
            	if(savedList.innerHTML == 0){	
            		alert("You have no items in your watchlist. Click + to add some");
            	}else{
            		$('.watchlist-wrapper').removeClass('.watchlist-wrapper');
            		var symbol = '';
            		for(var prop in localStorage){
            			symbol += localStorage[prop] + ', ';
            			}
            		var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("' + symbol + '")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
						console.log(url);

					$.getJSON(url, function(theDataJsFoundIfAny){
						// console.log(theDataJsFoundIfAny);
						var stockInfo = theDataJsFoundIfAny.query.results.quote;
						var stockCount = theDataJsFoundIfAny.query.count;
						var newHTML = '';
						// if there's more than one stock being searched for, loop through
						if (stockCount > 1){
							for(var i = 0; i <stockInfo.length; i++){
								newHTML += buildWatchTable(stockInfo[i]);
							}
							// $('.yahoo-body').append(newHTML);
						}else{
							// otherwise, just go through it once
							newHTML += buildWatchTable(stockInfo);
						}
						$('.watch-body').html(newHTML);
						$('.table').DataTable();	
					})
				}
			});		
        });
	});

});

function buildNewTable(stockInfo){
	if(stockInfo.Change){
		if(stockInfo.Change[0] == '+'){
			var upDown = "success";
		}else if(stockInfo.Change[0] == '-'){
			var upDown = "danger";
		}
	}else{
		var upDown = '';
		stockInfo.Change = 0;
	}

		// stockInfo.Change.slice || stockInfo.Change.indexOf

	var htmlString = '';
	// var stockInfo = theDataJsFoundIfAny.query.results.quote;
	// console.log(stockInfo);
	htmlString = '<tr>';
	htmlString += '<td><button type="button" class="btn btn-default save-button">+</button></td>';
	htmlString += '<td class="symbol">' + stockInfo.Symbol + '</td>';
	htmlString += '<td>' + stockInfo.Name + '</td>';
	htmlString += '<td>' + stockInfo.Ask + '</td>';
	htmlString += '<td>' + stockInfo.Bid + '</td>';
	htmlString += '<td class="'+ upDown +'">' + stockInfo.Change + '</td>';
	htmlString += '</tr>';
	return htmlString;
}

function buildWatchTable(stockInfo){
	if(stockInfo.change){
		if(stockInfo.Change[0] == '+'){
			var upDown = "success";
		}else if(stockInfo.Change[0] == '-'){
			var upDown = "danger";
		}
	}else{
		var upDown = '';
		stockInfo.Change = 0;
	}

		// stockInfo.Change.slice || stockInfo.Change.indexOf

	var htmlString = '';
	// var stockInfo = theDataJsFoundIfAny.query.results.quote;
	// console.log(stockInfo);
	htmlString = '<tr>';
	htmlString += '<td><button type="button" class="btn btn-default save-button">+</td>';
	htmlString += '<td>' + stockInfo.Symbol + '</td>';
	htmlString += '<td>' + stockInfo.Name + '</td>';
	htmlString += '<td>' + stockInfo.Ask + '</td>';
	htmlString += '<td>' + stockInfo.Bid + '</td>';
	htmlString += '<td class="'+ upDown +'">' + stockInfo.Change + '</td>';
	htmlString += '</tr>';
	return htmlString;
}

// function createStoredList(){
// 	var newList = {};
// 	for(var i =0; i < $('.stock_index').length; i++){
// 		newList.stock = $('.stock_index')[0].text();
// 		console.log(newList);
// 	};
// 	if(localStorage.getItem('stock')){
// 		stock = JSON.parse(localStorage.getItem('stock'));
// 	}else{
// 		stock = [];
// 	}
// 	stock.push(newList);
// 	localStorage.setItem('stock', JSON.stringify(stock));
// 	console.log(stock);
// }

// function returnList(){
// 	var stock = localStorage.getItem('stock');
// 	console.log('stock', JSON.parse(stock));
// }

// function removeList(){
// 	localStorage.removeItem('stock');
// }