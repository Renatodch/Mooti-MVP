
//<link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css" />
//<script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js"></script>

/*Amchar library*/
import * as am5 from '@amcharts/amcharts5/index'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

var series;
var xAxis;
var yAxis;
var counter = 0;
function addData(newValue, date) {

	if(counter > 6){
		var lastDataItem = series.dataItems[series.dataItems.length - 1];
		var lastValue = lastDataItem.get("valueY");
		var lastDate = new Date(lastDataItem.get("valueX"));
		var time = am5.time.add(new Date(date), "second", 1).getTime();
		series.data.removeIndex(0);
		series.data.push({
		  date: time,
		  value: newValue
		})
	  
		var newDataItem = series.dataItems[series.dataItems.length - 1];
		newDataItem.animate({
		  key: "valueYWorking",
		  to: newValue,
		  from: lastValue,
		  duration: 600,
		  easing: am5.ease.linear,
		  loops:1
		});
	  
		var animation = newDataItem.animate({
		  key: "locationX",
		  to: 0.5,
		  from: -0.5,
		  duration: 600,
		
		});
		if (animation) {
		  var tooltip = xAxis.get("tooltip");
		  if (tooltip && !tooltip.isHidden()) {
			animation.events.on("stopped", function () {
			  xAxis.updateTooltip();
			})
		  }
		}
	}else{
		var time = am5.time.add(date, "second", 1).getTime()
		series.data.push({
			date: time,
			value: newValue
		})
		console.log(series.data)
		counter++;
	}
}

/*########################################  amchart5  #####################################*/
function LiveChart(obj){
	const {chartID , lowIndicator, highIndicator, maxValue, minValue, unit, name, paramId} = obj;

	let root;
	am5.ready(function() {
		root = am5.Root.new(chartID);
		root.setThemes([
		  am5themes_Animated.new(root)
		]);	

		var value = 22;

		function generateChartData() {
		  var chartData = [];
		  var firstDate = new Date();
		  firstDate.setDate(firstDate.getDate() - 10);
		  firstDate.setHours(0, 0, 0, 0);
		
		  for (var i = 0; i < 16; i++) {
			var newDate = new Date(firstDate);
			newDate.setSeconds(newDate.getSeconds() + i);
		
			value += (Math.random() < 0.5 ? 1 : -1) * Math.random() * 10;
		
			chartData.push({
			  date: newDate.getTime(),
			  value: value
			});
		  }
		  return chartData;
		}
		
		//var data = [{date: new Date().getTime(),value:23}]//generateChartData();

		var chart = root.container.children.push(am5xy.XYChart.new(root, {
		  focusable: true,
		  panX: true,
		  panY: true,
		  wheelX: "panY",
		  wheelY: "zoomY",		  
		  layout:root.verticalLayout,
		}));
		
		
		var legend = chart.children.push(am5.Legend.new(root, {
			nameField: "name",
			fillField: "color",
			strokeField: "color",
			centerX: am5.percent(50),
			//centerY: am5.percent(50),
			x: am5.percent(50),
			y:am5.percent(95),
			height:30,

		}));

		legend.data.setAll([{
			name: "Ventana Indicadora",
			color: am5.color(0xff0000)
		  }, {
			name: "Dato Capturado",
			color: am5.color(0x00aae4)
		  }]);

		var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
		xRenderer.labels.template.setAll({
			minGridDistance: 10, //cambiar
			rotation: 45,
			centerY: am5.p50,
			centerX: am5.p50,
			paddingRight: 15
		});
		  
		// Create axes
		// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
		
		xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
		  maxDeviation: 0.5,
		  extraMin:-0.1,
		  extraMax:0.1,
		  groupData: false,
		  baseInterval: {
			timeUnit: "second",
			count: 1,
		  },
		  
		  renderer:xRenderer, 
		  tooltip: am5.Tooltip.new(root, {})
		}));
		
		/*
		xAxis = chart.xAxes.push(
			am5xy.GaplessDateAxis.new(root, {
			  baseInterval: { timeUnit: "day", count: 1 },
			  renderer: am5xy.AxisRendererX.new(root, {})
			})
		);
		*/
		xAxis.get("dateFormats")["second"] = "HH:mm:ss dd/MM/yyyy ";
		//xAxis.get("dateFormats")["second"] = "1 ";
		
		yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
			renderer: am5xy.AxisRendererY.new(root, {}),
			maxDeviation: 0.3,
			min: minValue,
			max: maxValue,
		}));

		yAxis.axisHeader.children.push(am5.Label.new(root,{
			text : unit,
			height:1,
			fontWeight: 500,
		}))
		
	
		/* TITULO vertical */
		var title = am5.Label.new(root, {
			rotation: -90,
			text: `${name} (${paramId})`,
			y: am5.p50,
			centerX: am5.p50,
			fontSize:20,
			fontWeight: 500
		})
		
		yAxis.children.unshift(title);
		
		// Add series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
		series = chart.series.push(am5xy.LineSeries.new(root, {
		  minBulletDistance: 10,
		  name: "Series 1",
		  xAxis: xAxis,
		  yAxis: yAxis,
		  valueYField: "value",
		  valueXField: "date",
		  tooltip: am5.Tooltip.new(root, {
			pointerOrientation: "horizontal",
			labelText: "{valueY}",
		  })
		}));
		//series.data.setAll(data);
		
		series.bullets.push(function () {
		  return am5.Bullet.new(root, {
			locationX:undefined,
			sprite: am5.Circle.new(root, {
			  radius: 4,
			  fill: series.get("fill")
			})
		  })
		});
		
		
		// Add cursor
		// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
		
		var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
		  xAxis: xAxis
		}));
		cursor.lineY.set("visible", false);
		
		
		//set Data
		

		function createRange(value, endValue, color) {
			var rangeDataItem = yAxis.makeDataItem({
			  value: value,
			  endValue: endValue
			});
			
			var range = yAxis.createAxisRange(rangeDataItem);
			
			if (endValue) {
			  range.get("axisFill").setAll({
				fill: color,
				fillOpacity: 0.2,
				visible: true
			  });
			  
			  range.get("label").setAll({
				fill: am5.color(0xffffff),
				text: value + "-" + endValue,
				location: 1,
				background: am5.RoundedRectangle.new(root, {
				  fill: color
				})
			  });
			}
			else {
			  range.get("label").setAll({
				fill: am5.color(0xffffff),
				text: value,
				background: am5.RoundedRectangle.new(root, {
				  fill: color
				})
			  });
			}
		  
			range.get("grid").setAll({
			  stroke: color,
			  strokeOpacity: 1,
			  location: 1
			});
			
		}
		  
		createRange(lowIndicator, highIndicator, am5.color(0xff0000));
		//createRange(60.5, undefined, am5.color(0xff0FF0));
		//createRange(130, undefined, am5.color(0xff621f));
		// Make stuff animate on load
		// https://www.amcharts.com/docs/v5/concepts/animations/
		chart.appear(1000, 100);
		
	}); // end am5.ready()
	return root;
}


export { LiveChart, addData }