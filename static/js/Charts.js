function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("./static/data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("./static/data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

////// DELIVERABLE 1 ////////
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("./static/data/samples.json").then((data) => {
    console.log(data)
    // 3. Create a variable that holds the samples array. 
    let samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let resultsArray = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    let result = resultsArray[0]
    //console.log(result)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values =  result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse()
    //console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var barInfo = [{
      y: yticks,
      x: sample_values,
      text: otu_labels,
      type: "bar",
      orientation: "h",

    }
    ];
    // 9. Create the layout for the bar chart. 
    var barFormat = {
      title: `<b>Sample ${sample} Top ten bacterias found.</b>`,

     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barInfo, barFormat )

///////// DELIVERABLE 2 ///////////

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth",
        }

      }
    ];
   
    

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: `<b>Top Ten Bateria Cultures Found in Sample ${sample}</b>`,
      showlegend: false,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Bateria Count" },
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);



////// DELIVERABLE 3 ///////

  // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let metadata = data.metadata;
    let metadataResultsArray = metadata.filter(sampleObj => sampleObj.id == sample);
    
  // 2. Create a variable that holds the first sample in the metadata array.
    let metadataResult = metadataResultsArray[0];
    
  // Create variables that hold the otu_ids, otu_labels, and sample_values.
  // let otu_ids = result.otu_ids;
  // let otu_labels = result.otu_labels;
  // let sample_values =  result.sample_values;
    
  // 3. Create a variable that holds the washing frequency.
    
    let washFreq = parseFloat(metadataResult.wfreq);
       
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: washFreq,
        title: { text: "<b>Belly Button Wash Frequency</b> <br> Scrubs per Week", font: { size: 20}},
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
          bar: { color: "black" },
          borderwidth: 4,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "limegreen" },
            { range: [8, 10], color: "green" },
          ],

        }
      }

    ];
        
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: { t: 25, r: 25, l: 25, b: 25},
      paper_bgcolor: "white",
      font: {color: "black", family: "Arial"},
           
    };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",  gaugeData, gaugeLayout);
  });
}
