$(document).ready(function(){
 // newBubbleChart(bubbles);

 //   $("#newBubbleButton").click(function(){
 //    console.log("chart deleted from jquery button");
 //    //var newBubbles = [{text: 'NewJava', count: '150'}, {text: 'New.Net', count: '402'}, {text: 'NewPhp', count: '321'}];
 //    //newBubbleChart(newBubbles);
 // });
});

var bubbles = [  {text: "Java", count: "236"}, {text: ".Net", count: "500"}, {text: "Php", count: "170"},
{text: "Ruby", count: "123"}, {text: "D", count: "12"}, {text: "Python", count: "170"},
{text: "C/C++", count: "382"}, {text: "Pascal", count: "10"}, {text: "Something", count: "170"}];

function newBubbleChart(obj) {

  $(".bubbleChart").empty();
  var bubbleChart = new d3.svg.BubbleChart({
    supportResponsive: true,
    //container: => use @default
    size: 600,
    //viewBoxSize: => use @default
    innerRadius: 600 / 3.5,
    //outerRadius: => use @default
    radiusMin: 50,
    //radiusMax: use @default
    //intersectDelta: use @default
    //intersectInc: use @default
    //circleColor: use @default
    data: {
      items: obj,
      eval: function (item) {return item.count;},
      classed: function (item) {return item.text.split(" ").join("");}
    },
    plugins: [
      {
        name: "central-click",
        options: {
          style: {
            "font-size": "18px",
            "font-style": "italic",
            "font-family": "Source Sans Pro, sans-serif",
            //"font-weight": "700",
            "text-anchor": "middle",
            "fill": "white"
          },
          attr: {dy: "65px"},
          centralClick: function() {
            alert("Here is more details!!");
          }
        }
      },
      {
        name: "lines",
        options: {
          format: [
            {// Line #0
              textField: "text",
              classed: {text: true},
              style: {
                "font-size": "15px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "0px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            },
            {// Line #1
              textField: "count",
              classed: {count: true},
              style: {
                "font-size": "14px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "20px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            }
          ],
          centralFormat: [
            {// Line #0
              style: {"font-size": "50px"},
              attr: {}
            },
            {// Line #1
              style: {"font-size": "30px"},
              attr: {dy: "40px"}
            }
          ]
        }
      }]
  });
  console.log("created bubble chart");
}
