console.log(data[0])

let metadata = data[0].metadata
let names = data[0].names
let samples = data[0].samples

let sortbyotu = samples.sort((a, b) => b.sample_values - a.sample_values);

// let person_id = sortbyotu.map(sample => sample.id)
// let otu_ids = sortbyotu.map(sample => sample.otu_ids);
// let sample_values = sortbyotu.map(sample => sample.sample_values);

function filterid(indiv) {
    let person = samples.filter(person => person.id == indiv);
    let person_data = person[0]
    let otu_id = person_data.otu_ids

    let top_10_otu_id = otu_id.slice(0, 10);
    let top_10_otuid_label = top_10_otu_id.map(item => `OTU-${item}`)

    let otu_val = person_data.sample_values
    let top_10_otu_val = otu_val.slice(0, 10);

    let dataset = {
        "otulabel": top_10_otuid_label,
        "otuid": top_10_otu_id,
        "values": top_10_otu_val
    }

    plotbar(dataset);
    plotbubble(dataset);
}

function plotbar(dataset) {
    let barchart = {
        y: dataset.otulabel.reverse(),
        x: dataset.values.reverse(),
        orientation: 'h',
        type: "bar"
    };

    let datasets = [barchart];

    Plotly.newPlot("bar", datasets);
}

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

console.log(filterid("940"))
