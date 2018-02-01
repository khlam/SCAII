google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(dummy);
var chart;
var dummy = function(){
	
}
var channels = [];

var updateSaliency = function() {
	console.log("called updateSaliency()");
	for (explanationIndex in explanations) {
		exp = explanations[explanationIndex]
		console.log("explanation step  " + exp.getStep());
		console.log("explanation id    " + exp.getId());
		console.log("explanation title " + exp.getTitle());
		var channelList = exp.getLayersList();
		for (channelIndex in channelList){
			var chan = channelList[channelIndex];
			var width = chan.getWidth();
			var length = chan.getLength();
			console.log("channel name  :" + chan.getName());
			var cellList = chan.getCellsList();
			console.log("channel cell list length :" + cellList.length);
			console.log("ta da!");
			
			
		}
	}
}

var renderSaliency = function() {
	var channel1Selected = $("#saliency-unittype-check")[0].checked;
	var channel2Selected = $("#saliency-hitpoints-check")[0].checked;
	var channel3Selected = $("#saliency-enemyfriendly-check")[0].checked;
	var heatMapList = [];
	if (channel1Selected) {
		heatMapList.push(getHeatMap1());
	}
	if (channel2Selected) {
		heatMapList.push(getHeatMap2());
	}
	if (channel3Selected) {
		heatMapList.push(getHeatMap3());
	}
	var normalizedHeatMap = normalizeHeatMaps(heatMapList);
	renderSaliencyHeatMap(normalizedHeatMap);
}

var normalizeHeatMaps = function(heatMapList){
	if (heatMapList.length == 1){
		return heatMapList[0];
	}
	var maxValue = 0;
	var tempHeatMap = [];
	for (j=0; j < 400; j++){
		var row = [];
		for (i =0;i < 400; i++){
			var sum = 0;
			for (z = 0; z < heatMapList.length ; z++){
				var hm = heatMapList[z];
				var heatMapVal = hm[j][i];
				sum = sum + heatMapVal;
			}
			if (sum > maxValue){
				maxValue = sum;
			}
			row[i] = sum;
		}
		tempHeatMap[j] = row;
	}
	for (j=0; j < 400; j++){
		for (i =0;i < 400; i++){
			tempHeatMap[j][i] = tempHeatMap[j][i] / maxValue;
		}
	}
	console.log("maxValue from heatmaps was " + maxValue);
	return tempHeatMap;
}
var getDistance = function(x1, y1, x2, y2){
	return Math.sqrt(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2));
}

var getValueForPoint= function(x,y,coordsList){
	var maxValue = 0;
	for (coordsListIndex in coordsList){
		coords = coordsList[coordsListIndex];
		var distance = getDistance(x,y,coords.x, coords.y);
		if (distance < 15){
			value = (1 - distance/15) * coords.intensity;
			if (value > maxValue) {
				maxValue = value;
			}
		}
	}
	return maxValue;
}
var get2dArrayWithMaxima = function(coordsList) {
	var rows = [];
	for (j=0; j < 400; j++){
		var row = [];
		for (i =0;i <400; i++){
			value = getValueForPoint(i,j,coordsList);
			row[i] = value;
		}
		rows[j] = row;
	}
	return rows;
}
var getHeatMap1 = function(){
	var coordsList = [];
	var coord = {};
	coord.x = 40;
	coord.y = 50;
	coord.intensity = 1.0;
	coordsList[0] = coord;
	var coord2 = {};
	coord2.x = 190;
	coord2.y = 260;
	coord2.intensity = 0.7;
	coordsList[1] = coord2;
	return get2dArrayWithMaxima(coordsList);
}

var getHeatMap2 = function(){
	var coordsList = [];
	var coord = {};
	coord.x = 40;
	coord.y = 50;
	coord.intensity = 0.5;
	coordsList[0] = coord;
	var coord2 = {};
	coord2.x = 50;
	coord2.y = 300;
	coord2.intensity = 0.4;
	coordsList[1] = coord2;
	return get2dArrayWithMaxima(coordsList);
}

var getHeatMap3 = function(){
	var coordsList = [];
	var coord = {};
	coord.x = 390;
	coord.y = 100;
	coord.intensity = 0.3;
	coordsList[0] = coord;
	var coord2 = {};
	coord2.x = 330;
	coord2.y = 300;
	coord2.intensity = 1.0;
	coordsList[1] = coord2;
	return get2dArrayWithMaxima(coordsList);
}

var renderHeatMap2 = function(){
	var hm = getHeatMap2();
	renderSaliencyHeatMap(hm);
}
var renderHeatMap1 = function(){
	var hm = getHeatMap1();
	renderSaliencyHeatMap(hm);
}
var renderHeatMap3 = function(){
	var hm = getHeatMap3();
	renderSaliencyHeatMap(hm);
}
var renderSaliencyHeatMap = function(heatMap){
	var ctx = gameboard_overlay_canvas.getContext("2d");
	ctx.clearRect(0,0, gameboard_overlay_canvas.width, gameboard_overlay_canvas.height);
	for (j=0; j < 400; j++){
		for (i =0;i < 400; i++){
			var value = heatMap[j][i];
			ctx.fillStyle = "rgba(255,0,0,"+value+")";
			ctx.fillRect( i, j, 1, 1 );
		}
	}
}
var renderSaliencyTest = function() {
	var ctx = gameboard_overlay_canvas.getContext("2d");
	for (i=0; i < 300; i++){
		for (j =0;j < 200; j++){
			ctx.fillStyle = "rgba(255,0,0,"+(j/255)+")";
			ctx.fillRect( j, i, 1, 1 );
		}
	}
	//ctx.putImageData(myImageData, 0, 0);
}






















var drawBarChart = function(chartData, options) {
      var data = google.visualization.arrayToDataTable(chartData);
	  if (chart == undefined){
		  chart = new google.visualization.BarChart(document.getElementById('explanations-interface'));
	  }
      chart.draw(data, options);
}
/*var redrawChart = function() {
	console.log("trigger button clicked...");
        var data = google.visualization.arrayToDataTable([
        ['Decision', 'Probability'],
        ['unit victorious', 0.77],
        ['unit loses', 0.39],
        ['adversary flees', 0.2]
      ]);

      var options = {
		legend: { position: "none" },
        title: 'Probable outcomes for action',
        chartArea: {width: '50%'},
        hAxis: {
          title: 'outcome probability',
          minValue: 0
        },
        vAxis: {
          title: 'decision'
        },
		'width':600,
        'height':400
      };

      chart.draw(data, options);
}
*/
var getOptionsFromChartInfo = function(chartInfo, gameboardHeight){
	var chartTitle = "explanations";
	if (chartInfo.hasChartTitle){
		chartTitle = chartInfo.getChartTitle();
	}
	
	var hAxisTitle = "?";
	if (chartInfo.hasHAxisTitle){
		hAxisTitle = chartInfo.getHAxisTitle();
	}
	
	var vAxisTitle = "?";
	if (chartInfo.hasVAxisTitle){
		vAxisTitle = chartInfo.getVAxisTitle();
	}
	
	var options = {
		//legend: { position: "none" },
        title: chartTitle,
        //chartArea: {width: '50%', left:70},
        chartArea: {width: '50%', left:"15%"},
        hAxis: {
          title: hAxisTitle,
          //minValue: 0
        },
        vAxis: {
          title: vAxisTitle
        },
		'width':600,
        'height':gameboardHeight
      };
	  return options;
}
var getChartDataFromChartInfo = function(chartInfo){
	var actions = "?";
	if (chartInfo.hasActions){
		actions = chartInfo.getActions();
	}
	
	var actionsLabel = "?";
	if (actions.hasActionsLabel()){
		actionsLabel = actions.getActionsLabel();
	}
	var actionNames = actions.getActionNamesList();
	var grid = [];
	var headerArray = [actionsLabel];
	grid.push(headerArray);
	for (var i = 0; i < actionNames.length; i++) {
		var actionName = actionNames[i];
		var row = [actionName];
		grid.push(row);
	}
	// by now the left column of the grid is in place
	var valueVectors = chartInfo.getValueVectorsList();
	for (var i = 0; i < valueVectors.length ; i++){
		var label = "?";
		var valueVector = valueVectors[i];

		if (valueVector.hasLabel()){
			label = valueVector.getLabel();
		}
		var headerArray = grid[0];
		headerArray.push(label);
		
		var actionValues = valueVector.getActionValuesList();
		var index = 1;
		for (var j = 0; j < actionValues.length; j++){
			var actionValue = actionValues[j];
			var rowArray = grid[index];
			rowArray.push(actionValue);
			index = index + 1;
		}
	}
	// gridArray should look something like this now:
	//var chartData = [
    //    ['Decision', 'r1', 'r2'],
    //    ['unit victorious', 0.77, 0.4],
    //    ['unit loses', -0.39, 0.6],
    //    ['adversary flees', 0.2, 0.3]
    //  ];  
	return grid;
}
var renderChartInfo = function(chartInfo, gameboardHeight){
	var options = getOptionsFromChartInfo(chartInfo, gameboardHeight);
	var chartData = getChartDataFromChartInfo(chartInfo);
	drawBarChart(chartData, options);
}
/*
message ChartInfo {

	repeated ChartRow chart_rows = 5;
}
message ChartDataLabels {
	optional string label_type = 1;
	repeated string labels = 2;
}
message ChartRow {
	optional string header = 1;
	repeated double row_values = 2;
}
*/