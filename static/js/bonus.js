const file = '/data/samples.json'

const dataPromise = d3.json(file)
console.log("Data Promise: ", dataPromise)

d3.json(file).then(data => console.log(data));