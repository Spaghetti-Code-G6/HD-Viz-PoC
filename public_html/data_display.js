let dataset = [];

const w = 1300;
const h = 650;
const padding = 30;

//sepal length, sepal width, petal length, petal width

function main(){

	const svg = d3.select("#scatter_plot_content")
			   	   .append("svg")
			   	   .attr("width", w)
			   	   .attr("height", h);

	const min_sepal_length = d3.min(dataset, (d)=>d[0]);
	const max_sepal_length = d3.max(dataset, (d)=>d[0]);

	const min_sepal_width = d3.min(dataset, (d)=>d[1]);
	const max_sepal_width = d3.max(dataset, (d)=>d[1]);

	const min_petal_length = d3.min(dataset, (d)=>d[2]);
	const max_petal_length = d3.max(dataset, (d)=>d[2]);

	const min_petal_width = d3.min(dataset, (d)=>d[3]);
	const max_petal_width = d3.max(dataset, (d)=>d[3]);

	const x_scale_sepal_length = d3.scaleLinear()
		   					     .domain([min_sepal_length, max_sepal_length])
								 .range([padding, w - padding]);

	const x_scale_sepal_width = d3.scaleLinear()
								.domain([min_sepal_width, max_sepal_length])
								.range([padding, w - padding])

	const x_scale_petal_length = d3.scaleLinear()
								 .domain([min_petal_length, max_petal_length])
								 .range([padding, w - padding])

	const x_scale_petal_width = d3.scaleLinear()
								 .domain([min_petal_width, max_petal_width])
								 .range([padding, w - padding])


	const y_scale_sepal_length = d3.scaleLinear()
		   					     .domain([min_sepal_length, max_sepal_length])
								 .range([padding, h - padding]);

	const y_scale_sepal_width = d3.scaleLinear()
								.domain([min_sepal_width, max_sepal_length])
								.range([padding, h - padding])

	const y_scale_petal_length = d3.scaleLinear()
								 .domain([min_petal_length, max_petal_length])
								 .range([padding, h - padding])

	const y_scale_petal_width = d3.scaleLinear()
								 .domain([min_petal_width, max_petal_width])
								 .range([padding, h - padding])

	//console.log("cose");

}

function send_data(){

	let file = document.getElementById("csvFile").files[0];
	console.log(file);

	const formData = new FormData();

	formData.append('csvFile', file);

	const options = {
  		method: 'POST',
  		body: formData,
  		};

	fetch('/file', options)
		 .then(response=> response.json())
		 .then(json => {

		 	dataset = [];
		 	d3.csv(json.url, (data)=> {
		 		dataset.push(data);
		 	})
		 	  .then(()=>draw(dataset));
		  });
}