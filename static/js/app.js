//plotly app
var isFirstPaint = true

d3.json("./data/samples.json").then(function (data) {
    var particpants_demographics = Object.values(data.metadata)
    var participants_id = Object.values(data.names)
    var participants_samples = Object.values(data.samples)
    const placeholderID = "940";
    var sample_val = participants_samples.map((row) => row.sample_values)
    var bacter_id = participants_samples.map((row) => (row.otu_ids))
    var bacter_labels = participants_samples.map((row) => row.otu_labels)
    var wfreqs = particpants_demographics.map(r => r.wfreq)
    var selection = d3.select("#selDataset")
    var demographics = d3.select("#sample-metadata")

    for (id of participants_id){
        selection.append("option").attr("value", id).text(id)
    }


    function optionChanged(id){
        
        var part_id = id
        id = id.toString()
        var index = participants_id.indexOf(id)
        var trace1 = {
            x: sample_val[index].slice(0, 10).reverse(),
            y: bacter_id[index].slice(0, 10).map((id) => `OTU ${id}`).reverse(),
            text: bacter_id[index].slice(0, 10).map((id) => `OTU ID: ${id}`).reverse(),
            type: "bar",
            orientation: "h"
        };
        var chartData = [trace1];
        var layout = {
            title: `Top 10 Bacteria in Subject #${id}`,
            margin: {
                 l: 100,
                 r: 100,
                 t: 50,
                 b: 50
             },
             yaxis: {type: "string"}
        }
        Plotly.newPlot("bar", chartData, layout)
        var demoString = ""
        for (pair of Object.entries(particpants_demographics[index])){
            demoString += `<li><b>${pair[0]}</b>: ${pair[1]}</li><br>`
        }
        var list = d3.select("#demographics")
        list._groups[0][0].innerHTML = (demoString)

        console.log(bacter_id[index])
        console.log(sample_val[index])

        colorArr =[]
        for (id of bacter_id[index]){
            let idNum = id;
            idNum /= 10;
            if (idNum > 255){
                idNum = 255
            }
            colorArr.push(`rgb(50, ${idNum}, 120)`)
        }

        bubbledata = [{
            x: bacter_id[index],
            y: sample_val[index],
            text: bacter_labels[index],
            mode: "markers",
            marker: {
                size: sample_val[index],
                color: colorArr
            },
            type: "scatter"

        }]
        console.log("-----")
        console.log()
        bubLabel = {
            title: `Bacteria Intensity of Subject #${part_id}`,
            xaxis: {title: "OTU_id"}}

        Plotly.newPlot("bubble", bubbledata, bubLabel)
        

        gaugedata = [{
            values: [100/9, 100/9, 100/9, 100/9, 100/9, 100/9, 100/9, 100/9, 100/9, 100],
            rotation: 90,
            text:
            ["8+", "7", "6", "5", "4", "3", "2", "1", "0", ""],
            textinfo: "text",
            textposition: "inside",
            marker: {colors: [
                "rgba(0, 180, 0, .95)",
                "rgba(0, 200, 0, .80)",
                "rgba(0, 255, 0, .58)",
                "rgba(0, 255, 0, .37)",
                "rgba(0, 255, 0, .17)",
                "rgba(184, 154, 0, .15)",
                "rgba(199, 100, 0, .30)",
                "rgba(227, 28, 0, .60)",
                "rgba(255, 0, 0, .90)",
                "rgba(255, 255, 255, 0)"
            ],
            line: {width: [0, 0, 0, 0, 0, 0, 5, 0, 0, 0]}}, // order [8+, 7, 6, 5, 4, 3, 2, 1, 0, blank]
            hole: 0.5,
            type: "pie",
            showlegend: false,
            hoverinfo: "skip"
        }]

        glayout = {
            height: 600,
            width: 600,
            title: `<b>Belly Button Washes per Week</b>`
        }
        var washes = particpants_demographics[index].wfreq
        if (washes > 7){
            washes = 1
        } else {
            washes = 9 - washes
        }

        const pieSlice = 5;
        function pie(){
            if (isFirstPaint){
                Plotly.newPlot("gauge", gaugedata, glayout, {staticPlot: true})
            } else {
                var sliceGroups = d3.selectAll(".surface")._groups[0]
                var count=0;
                for(slice of sliceGroups){
                    if (slice.style.strokeWidth != 0){
                        slice.style.strokeWidth = 0
                    } else {
                        count++;
                    }
                }
                sliceGroups[washes].style.strokeWidth = 5
                
            }
            
        }
        pie()
        isFirstPaint = false;
        
    }
    
    optionChanged("940");

    selection.on("change", function(e) {
        for (sel of selection._groups[0][0]){
            if (sel.selected){
                optionChanged(sel.value)
            }
        }
    })

});


