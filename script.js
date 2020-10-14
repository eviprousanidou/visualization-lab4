d3.csv("wealth-health-2014.csv", d3.autoType).then((data) => {

    console.log("WealthHealth", data);
    Data = data

    //Margin convention
    const margin = {top:20, left:30, bottom:20, right:20};
    const width = 650 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    //Color encoding
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    //create the chart 
    const svg = d3.select('.chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate('+margin.left+','+margin.right+')')
        
    //Scales
    const xScale = d3
        .scaleLog()
        .domain(d3.extent(Data.map(function(item){
            return(item.Income);
        })))
        .range([0,width]);

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(Data.map(function(item){
        return(item.LifeExpectancy);
        })))
        .range([height,0]);
    
    
    // encoding countries into circles 
    svg
        .selectAll("dot")
        .data(Data)
        .enter()
        .append('circle')
        .attr("fill", d => colorScale(d.Region))
        .attr("fill-opacity","80%")
        .attr('stroke','black')
        .attr('cx', d=>xScale(d.Income))
        .attr('cy', d=>yScale(d.LifeExpectancy))
        .attr("r", function(d){
            if (d.Population > 1000000000){
                return 22;
            }
            else if (d.Population > 500000000){
                return 14;
            }
            else if(d.Population > 100000000){
                return 12;
            }
            else if (d.Population > 10000000){
                return 10;
            }
            else if (d.Population > 1,000,000){
                return 8;
            }
            else {
                return 6;
            }
        })
        .on("mouseenter", (event, d) => {
        const pos = d3.pointer(event, window)
           d3.select('.tooltip')
             .style("opacity", 0.9)
             .style("left", (pos[0] + 5 + "px"))
             .style("top", (pos[1] + 5 + "px"))
             .html(`Country:  ${d.Country} <br> Region: ${d.Region} <br> Population: ${d3.format(",d")(d.Population)} <br> Income:  ${d3.format("$,d")(d.Income)} <br> Life Expectancy:  ${d.LifeExpectancy} `);
         })
         .on("mouseleave", (event, d) => {
           d3.select('.tooltip').style("opacity", 0)
        });
     

    //Visualize thr scales using axes
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5,'s');

    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5,'s');

    svg.append('g')
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);
   
    svg.append('g')
        .attr("class", "axis y-axis")
        .call(yAxis);


    //x-axis label 
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 10)
        .text("Income");

    //y-axis label
    svg.append("text")
        .attr("class", "y label")
        .attr("x", - margin.left)
        .attr("y", -2)
        .attr("text-anchor", "start")
        .text("Life expectancy");

        var legendRectSize = 10;                                  
        var legendSpacing = 5;  
    

    //legend
    const legend = svg
        .selectAll('.legend')                     
        .data(colorScale.domain())                                   
        .enter()                                                
        .append('g')                                            
        .attr('class', 'legend')
        .attr('transform', function(d, i) {                     
              var height = legendRectSize + legendSpacing;          
              var offset =  height * colorScale.domain().length-90 ;     
              var horz = -2 * legendRectSize + 430;                       
              var vert = i * height - offset + 350;                       
              return 'translate(' + horz + ',' + vert + ')';        
            });        

        //add the rectangles
        legend.append('rect')
          .attr('width', legendRectSize)     
          .attr('height', legendRectSize)           
          .style('fill', colorScale) 

        // add the text
        legend.append('text')
          .attr('x', legendRectSize +10)
          .attr('y', legendRectSize)
          .text(function(d){ return d;});

});