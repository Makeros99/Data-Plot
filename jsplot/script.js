
$(document).ready(function () {
    $('#fileInput').on('change', function (e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();

            reader.onload = function (event) {
                var fileContent = event.target.result;
                var lines = fileContent.split('\n');
                var dataArray = [];


                for (var i = 0; i < lines.length; i++) {
                    var columns = lines[i].split(',');
                    dataArray = dataArray.concat(columns);
                }

                var data_values = dataArray.map(function (value) {
                    return parseFloat(value);
                });

                var trace = {
                    x: [...Array(data_values.length).keys()],
                    y: data_values,
                    mode: "lines",
                    type: "scatter",
                };
                var layout = {
                    title: "Data Table",
                    font: {
                        family: ' Poppins , sans-serif',
                        size: 18,
                        color: '#000000'
                    },
                    xaxis: { title: "Index" },
                    yaxis: { title: "Value" },
                };
                var annotations = [
                    {
                        x: 0.99,
                        y: 0.95,
                        xref: "paper",
                        yref: "paper",
                        xanchor: "right",
                        yanchor: "top",
                        text: "",
                        showarrow: false,
                    },
                    {
                        x: 0.99,
                        y: 0.9,
                        xref: "paper",
                        yref: "paper",
                        xanchor: "right",
                        yanchor: "top",
                        text: "",
                        showarrow: false,
                    },
                ];

                Plotly.newPlot("plot", [trace], layout).then(function () {
                    // Calculate function for button click
                    function calculate(xMin, xMax) {
                        var startValue = xMin;
                        var endValue = xMax;

                        if (!isNaN(startValue) && !isNaN(endValue)) {
                            var selectedValue = data_values.slice(startValue, endValue + 1);

                            var rmsValue = Math.sqrt(
                                selectedValue.reduce(function (sum, value) {
                                    return sum + Math.pow(value, 2);
                                }, 0) / selectedValue.length
                            );

                            var meanValue =
                                selectedValue.reduce(function (sum, value) {
                                    return sum + value;
                                }, 0) / selectedValue.length;

                            annotations[0].text = "Mean: " + meanValue.toFixed(2);
                            annotations[1].text = "RMS: " + rmsValue.toFixed(2);
                            Plotly.relayout("plot", { annotations: annotations });
                        }
                    }

                    calculate(0, data_values.length);

                    // Attach the zoom event listener to the x-axis

                    // var plotElement = document.getElementById("plot");
                    var plotElement = $("#plot")[0]
                    plotElement.on("plotly_relayout", function (eventdata) {
                        if (
                            eventdata["xaxis.range[0]"] !== undefined &&
                            eventdata["xaxis.range[1]"] !== undefined
                        ) {
                            var xMin = Math.max(0, Math.floor(eventdata["xaxis.range[0]"]));
                            var xMax = Math.min(
                                data_values.length - 1,
                                Math.floor(eventdata["xaxis.range[1]"])
                            );
                            calculate(xMin, xMax);
                        }
                    });

                    plotElement.on('plotly_doubleclick', function (eventdata) {
                        calculate(0, data_values.length);
                    });

                    document.querySelector('[data-title="Autoscale"]').addEventListener('click', function () {
                        calculate(0, data_values.length);
                    });

                    document.querySelector('[data-title="Reset axes"]').addEventListener('click', function () {
                        calculate(0, data_values.length);
                    });
                });
            };

            reader.readAsText(file);

            $('#fileButton').hide();
        }
    });
});
