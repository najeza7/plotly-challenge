// Function to create the initial plot and metadata
function init() {
    d3.json("data/samples.json").then((data) => {
        var idNames = data.names;
        var dropdownMenu = d3.select("#selDataset");
        
        // Fill drop down menu with the id's
        idNames.forEach((id) => {
            dropdownMenu.append("option").text(id).property("value", id);
        });
        var id = idNames[0];
        plotsAndMetadata(id);
    });
    
}

// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", updatePlotly);

function updatePlotly() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var id = dropdownMenu.property("value");
    plotsAndMetadata(id)
}

// Function to plot and get the demographic info
function plotsAndMetadata(id) {
    d3.json("data/samples.json").then((data) => {
        
        // Get data needed for plots and for Demographic Info box
        var dataMetadata = data.metadata; 
        var filteredMetadata = dataMetadata.filter(subject => subject.id == id)[0];

        console.log(Object.entries(filteredMetadata));
        
        var dataSamples = data.samples;
        var filteredData = dataSamples.filter(subject => subject.id == id)[0];
        var sampleValues = filteredData.sample_values;    
        var otuIds = filteredData.otu_ids;
        var otuLabels = filteredData.otu_labels; 
       
        // Get top 10 OTU's for the subject selected
        var sliceValues = sampleValues.slice(0,10).reverse();
        var sliceOtuIds = otuIds.slice(0,10).reverse();
        var sliceOtuLabels =  otuLabels.slice(0,10).reverse();
        
        // Convert the ID's into strings
        var modifiedOtuIds = sliceOtuIds.map(oId => "OTU " + oId);    
         
        //----------- Bar chart ------------ \\
        var trace1 = {
            x: sliceValues,
            y: modifiedOtuIds,
            text: sliceOtuLabels,
            type: "bar",
            orientation: "h"
        }; 
    
        var data1 = [trace1];
    
        var layout1 = {
            title: "Top 10 OTU's found "
          };
        
        Plotly.newPlot("bar", data1, layout1);
    
        //-------------- Bubble chart ------------ \\

        var trace2 = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale:'Picnic'
            }
        };

        var data2 = [trace2];

        var layout2 = {
            title: "OTU's found",
            height: 600,
            width: 1200,
            xaxis: {
                title: {text: 'OTU ID'}
            }
        };

        Plotly.newPlot("bubble", data2, layout2)

        //-------------- Demographic Info ------------ \\

        var demographicInfo = d3.select("#sample-metadata")
        demographicInfo.html("");

        Object.entries(filteredMetadata).forEach(([key,value]) => {
            demographicInfo.append('h6').text(`${key}: ${value}`);    
        });

    })    
}

// Call the init function so we have an initial output
init();

