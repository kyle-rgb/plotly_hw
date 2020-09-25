//plotly app
d3.json("./data/samples.json").then(function (data) {
    console.log(data)
    var participants_id = Object.values(data.names)
    var participants_samples = Object.values(data.samples)
    const placeholderID = "940";
    var sample_val = participants_samples.map((row) => row.sample_values)
    var bacter_id = participants_samples.map((row) => (row.otu_ids))
    var bacter_labels = participants_samples.map((row) => row.otu_labels)
    // var duf = bacter_id[0].slice(0, 10)
    // console.log(sample_val[0].slice(0, 10))
    // console.log(duf)
    //console.log(participants_id)
    var selection = d3.select("#selDataset")
    console.log(participants_id.indexOf("940"))

    for (id of participants_id){
        selection.append("option").attr("value", id).text(id)
    }


    function optionChanged(id){
        console.log(id)
        id = id.toString()
        var index = participants_id.indexOf(id)
        var trace1 = {
            x: sample_val[index].slice(0, 10).reverse(),
            y: bacter_id[index].slice(0, 10).map((id) => `OTU ${id}`).reverse(),
            text: bacter_id[index].slice(0, 10).map((id) => `OTU ID: ${id}`).reverse(),
            //text: bacter_labels[0].slice(0,10),
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


