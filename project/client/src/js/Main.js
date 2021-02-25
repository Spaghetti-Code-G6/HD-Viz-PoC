
    function send_data(){

        let file = document.getElementById("csvFile").files[0];

        const formData = new FormData();
        formData.append('csvFile', file);

        const options = {
            method: 'POST', body: formData, port: 8085
        };
        document.write(options)

        fetch('/csv/upload', options)
            .then(response=> response.json())
            .then(json => {
                document.write(json)
                console.log(json)
            });
    }