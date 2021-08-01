console.log("import:", data[0])

// create variables for each json key
let metadata = data[0].metadata
let names = data[0].names
let samples = data[0].samples

// create function to initiate the entry display
function init() {
    console.log(filterid("940"))

    // set dropdown menu to display patient ids
    names.forEach(id => {
        let dropdownmenu = d3.select("#selDataset")
        dropdownmenu.append("option").text(id).property("value", id);
    });

    // set patient 940 as first displayed
    let first_id = "940"
    filterid(first_id)
}

/// change the display when a patient is selected
d3.selectAll("#selDataset").on("change", updateplot);

/// create a function that updates the graphs
function updateplot() {
    let update_id = d3.select("#selDataset").node().value;

    d3.selectAll("#table").remove();

    filterid(update_id);
}

/// create a function that calls for the patient data and displays it
function filterid(indiv) {
    /// filter for the demographic data of the patient of interest
    let identifiers = metadata.filter(person => person.id == indiv);

    /// create variables that hold demographic data
    let ethnicity = identifiers[0].ethnicity;
    let gender = identifiers[0].gender;
    let age = identifiers[0].age;
    let location = identifiers[0].location;
    let id = identifiers[0].id;
    let num_wash = identifiers[0].wfreq;

    /// filter patient sample data for the patient of interest
    let person = samples.filter(person => person.id == indiv);

    /// create variables to hold the sample data
    let person_data = person[0]
    let otu_id = person_data.otu_ids
    let otu_val = person_data.sample_values
    let otu_labels = person_data.otu_labels
    let otuid_label = otu_id.map(item => `OTU-${item}`);

    /// create a dictionary to recall demographics data
    let demoset = {
        "patientid": id,
        "ethnicity": ethnicity,
        "gender": gender,
        "age": age,
        "location": location,
        "num_wash": num_wash
    }

    /// create a dictionary to recall sample data
    let dataset = {
        "otulabel": otu_labels,
        "otuid": otu_id,
        "otuid_label": otuid_label,
        "values": otu_val
    };

    /// plot the graphs based on the sample and demographics data
    plotbar(dataset);
    plotbubble(dataset);
    plotdemographics(demoset);
    plotgauge(demoset);
}

/// create a bar plot that displays top 10 sample OTUs
function plotbar(dataset) {
    let barchart = {
        y: dataset.otuid_label.slice(0, 10).reverse(),
        x: dataset.values.slice(0, 10).reverse(),
        orientation: 'h',
        type: "bar"
    };

    let datasets = [barchart];

    Plotly.newPlot("bar", datasets);
}

/// create a bubble chart that displays all sample data for the patient
function plotbubble(dataset) {
    let bubblechart = {
        x: dataset.otuid,
        y: dataset.values,
        mode: 'markers',
        text: dataset.otulabel,
        marker: {
            color: dataset.otuid,
            size: dataset.values,
        },
        type: "bubble"
    }

    let datasets = [bubblechart];

    Plotly.newPlot("bubble", datasets);
}

/// create a list of patient demographics data to display
function plotdemographics(demoset) {
    let table = d3.select('#sample-metadata');
    table.selectAll('li').remove();

    table.append("li").text(`Patient ID: ${demoset.patientid}`);
    table.append("li").text(`Ethnic: ${demoset.ethnicity}`);
    table.append("li").text(`Gender: ${demoset.gender}`);
    table.append("li").text(`Age: ${demoset.age}`);
    table.append("li").text(`Area: ${demoset.location}`);
}


/// create a handwashing gauge
function plotgauge(demoset) {
    let data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: demoset.num_wash,
            title: { text: "Handwashing Times" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 10] },
                bar: { color: "#FFFFFF" },
                steps: [
                    { range: [0, 2], color: "#AAC9CE" },
                    { range: [2, 4], color: "#B6B4C2" },
                    { range: [4, 6], color: "#C9BBC8" },
                    { range: [6, 8], color: "#E5C1CD" },
                    { range: [8, 10], color: "#F3DBCF" },
                ]
            }
        }
    ];

    let layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', data, layout);
}

/// run first display upon opening the webpage
init();
