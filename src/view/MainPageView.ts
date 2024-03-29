import { writeFile } from "../gateway/file/FileGateway";

export class MainPageView {
  generate() {
    const page: string = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Football predictor</title>
</head>
<body>

    <h2>Create at:  <span id="date"></span></h2>

    <script>
        document.getElementById('date').innerHTML = new Date().toLocaleString()
    </script>

    <button onclick="loadContent('statistic.html')">Load Statistic Page</button>
    <button onclick="loadContent('prediction.html')">Load Prediction Page</button>

    <div id="content-container">
        <!-- Content will be loaded here -->
    </div>

    <script>
        function loadContent(page) {
            var xhttp = new XMLHttpRequest()
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById('content-container').innerHTML = this.responseText
                }
            }
            xhttp.open('GET', page, true)
            xhttp.send()
        }
        loadContent('statistic.html')
    </script>

</body>
</html>`;
    writeFile("index.html", page);
  }
}
