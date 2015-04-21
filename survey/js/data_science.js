var w = 400,
    h = 380,
    buff = 0.35
    x_buffer = w * buff,
    y_buffer = h * buff,
    radius = h * 0.25,
    circle_delay = 350,
    text_delay = 0,
    out_opacity = 0.5,
    over_opacity = 0.85,
    clicks = 0,
    
    // Create an object that contains all of the data needed to draw the Venn Diagram circles
    circle_data = [{'color' : '#FF0000', 'x' : x_buffer, 'y' : y_buffer, 'id' : 'hacking' , 'delay' : circle_delay },
                   {'color' : '#008000', 'x' : w - x_buffer, 'y' : y_buffer, 'id' : 'stats', 'delay' : circle_delay * 2},
                   {'color' : '#0000FF', 'x' : w / 2, 'y' : h - y_buffer, 'id' : 'substance', 'delay' : text_delay}],
    
    // Create an object that contains all of the data for diagram's text
    text_data = [
                  [ {'text' : 'Hacking Skills', 'transform' : 'rotate(-45 ' + (x_buffer - 30) + ' ' + (y_buffer - 10) + ')', 
                    'x' : x_buffer - 70, 'y' : y_buffer - 10, 'id' : 'hacking_skills', 'class' : 'venn_text_big'}],
                  [ {'text' : 'Math & Statistics', 'transform' : 'rotate(45 ' + (w - (x_buffer - 50)) + ' '+ (y_buffer - 30) +')', 
                    'x' : w - (x_buffer) - 30, 'y' : (y_buffer - 20), 'id' : 'math_stats', 'class' : 'venn_text_big'}, 
                    {'text' : 'Knowledge', 'transform' :    'rotate(45 ' + (w - (x_buffer - 20)) + ' '+ (y_buffer - 10) +')', 
                    'x' : w - (x_buffer) - 30, 'y' : (y_buffer - 10), 'id' : 'math_stats', 'class' : 'venn_text_big'}],
                  [ {'text' : 'Substantive', 'transform' : 'rotate(0 0 0)', 'x' : w / 2 - 42, 
                    'y' : h - (y_buffer) + 20, 'id' : 'substantive_expertise', 'class' : 'venn_text_big'},
                    {'text' : 'Expertise', 'transform' : 'rotate(0 0 0)', 'x' : w / 2 - 34, 
                    'y' : h - (y_buffer) + 40, 'id' : 'substantive_expertise', 'class' : 'venn_text_big'}],
                // Intersection text
                  [ {'text' : 'Machine', 'transform' : 'rotate(0 0 0)', 'x' : (w / 2) - 28, 'y' : (y_buffer - 16), 
                    'id' : 'machine_learning', 'class' : 'venn_text_small'},
                    {'text' : 'Learning', 'transform' : 'rotate(0 0 0)', 'x' : (w / 2) - 28, 'y' : (y_buffer), 
                    'id' : 'machine_learning', 'class' : 'venn_text_small'}],
                  [ {'text' : 'Danger', 'transform' : 'rotate(-45 '+ ((x_buffer + (w / 2)) / 2.2) + ' ' + ((h / 2) + 20) + ')', 
                    'x' : ((x_buffer + (w / 2)) / 2.2) - 18, 'y' : (h / 2) + 5, 'id' : 'danger_zone', 'class' : 'venn_text_small'},
                    {'text' : 'Zone!', 'transform' : 'rotate(-45 '+ ((x_buffer + (w / 2)) / 2.15) + ' ' + ((h / 2) + 40) + ')', 
                    'x' : ((x_buffer + (w / 2)) / 2.15), 'y' : (h / 2) + 24, 'id' : 'danger_zone', 'class' : 'venn_text_small'}],
                  [ {'text' : 'Trad', 'transform' : 'rotate(45 '+ (w - (w * .40)) + ' ' + ((h / 2) + 20) + ')', 
                    'x' : w - (w * .39) - 20, 'y' : (h / 2), 'id' : 'traditional_research', 'class' : 'venn_text_small'},
                    {'text' : 'Research', 'transform' : 'rotate(45 '+ (w - (w * .41)) + ' ' + ((h / 2) + 40) + ')', 
                    'x' : w - (w * .40) - 45, 'y' : (h / 2) + 20, 'id' : 'traditional_research', 'class' : 'venn_text_small'}],
                  [ {'text' : 'Data', 'transform' : 'rotate(0 0 0)', 'x' : w / 2 - 16, 'y' : (h / 2) - 20, 
                    'id' : 'data_science', 'class' : 'venn_text_ds'},
                    {'text' : 'Science', 'transform' : 'rotate(0 0 0)', 'x' : w / 2 - 26, 'y' : (h / 2), 
                    'id' : 'data_science', 'class' : 'venn_text_ds'}]
                ]

    chart = d3.select('#venn')
        .append('svg:svg')
        .attr('height', h)
        .attr('width', w)
        .attr("xlink:href", "http://drewconway.com/zia/2013/3/26/the-data-science-venn-diagram")
     
    heading = chart.append('svg:text')
        .attr('class', 'clickExplore')
        .attr('x', 140)
        .attr('y', h - 20)
        .text('Click to explore'), 
  
    // Draw circles
    venn_circles = chart.selectAll('circle')
        .data(circle_data)
      .enter().append('svg:circle')
        .attr('id', function(d){ return d.id; })
        .attr('cx', function(d){ return d.x; })
        .attr('cy', function(d){ return d.y; })
        .attr('r', 0)
        .style('fill', '#FFFFFF')
        .style('opacity', 0.0)
        .on('click', function(){ nextText(); })
      .transition()
        .delay(function(d){ return d.delay; })
        .attr('r', radius)
        .style('fill', function(d){ return d.color; })
        .style('opacity', 0.3),

    context = d3.select("#context")
        .attr("class", "context_text")

    context_text = context.append("p")
        .attr("class", "context_text")
        .text("");

function nextText() {
    // Add text
    if(clicks < text_data.length) {
        venn_text = chart.selectAll('venn_text'+clicks+'.text')
            .data(text_data[clicks])
          .enter().append('svg:text')
            .attr('class', function(d){ return d.class; })
            .attr('id', function(d){ return d.id; })
            .attr('x', function(d){ return d.x; })
            .attr('y', function(d){ return d.y; })
            .attr('transform', function(d){ return d.transform; })
            .text(function(d){ return d.text; })
            .style('opacity', 0.0)
            .on("click", function(d) {
                showMiniHelp(d.id);
                // d3.select(this).attr("class", function(d){ return d.class+("_over"); });
            })
          .transition()
            .duration(400)
            .style('opacity', function(){ 
                if(clicks < (text_data.length - 1)) {
                    return out_opacity;
                }
                else {
                    return over_opacity;
                }
            });

        clicks += 1;
    }
}

window.setInterval(nextText, 1200)


