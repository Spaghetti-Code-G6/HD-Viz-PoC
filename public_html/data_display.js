let dataset = [];

const w = 1300;
const h = 850;
const padding = 30;
const space_between_charts = 15;
const vertical_space = 10;

function main(){

	const svg = d3.select("#scatter_plot_content")
			   	   .append("svg")
			   	   .attr("width", w)
			   	   .attr("height", h);
}

function send_data(){

	let file = document.getElementById("csvFile").files[0];

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
		 	.then(()=>{
		 	  	draw_scatter_plot(dataset);
		 	  })
		  });
}