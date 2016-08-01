$(document).ready(function(){
	
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
		});

	});

	$('.local-store').on('click', function(){
		createStoredList();
	});

	$('.retrieve').on('click', function(){
		returnList();
	});

	$('.clear').on('click', function(){
		removeList();
	});

});

function buildNewTable(stockInfo){
	
	if(stockInfo.Change[0] == '+'){
		var upDown = "success";
	}else if(stockInfo.Change[0] == '-'){
		var upDown = "danger";
	}

		// stockInfo.Change.slice || stockInfo.Change.indexOf

	var htmlString = '';
	// var stockInfo = theDataJsFoundIfAny.query.results.quote;
	// console.log(stockInfo);
	htmlString = '<tr><td class="stock_index">' + stockInfo.Symbol + '</td>';
	htmlString += '<td>' + stockInfo.Name + '</td>';
	htmlString += '<td>' + stockInfo.Ask + '</td>';
	htmlString += '<td>' + stockInfo.Bid + '</td>';
	htmlString += '<td class="'+ upDown +'">' + stockInfo.Change + '</td></tr>';
	return htmlString;
}

function createStoredList(){
	var newList = {};
	for(var i =0; i < $('.stock_index').length; i++){
		newList.stock = $('.stock_index')[0].text();
		console.log(newList);
	};
	if(localStorage.getItem('stock')){
		stock = JSON.parse(localStorage.getItem('stock'));
	}else{
		stock = [];
	}
	stock.push(newList);
	localStorage.setItem('stock', JSON.stringify(stock));
	console.log(stock);
}

function returnList(){
	var stock = localStorage.getItem('stock');
	console.log('stock', JSON.parse(stock));
}

function removeList(){
	localStorage.removeItem('stock');
}