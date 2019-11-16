# lineRangeChart
Fork of https://github.com/rgabs/lineRangeChart, which is a great way to display evolutions, but way too specific.<br />
This version can receive custom markers, scales, and titles.<br />
This plugin has been developed for my platform: https://www.probant-systems.fr

## Example
![Example](/example/demo.png?raw=true "Example Code")

## Dependencies:
* jQuery >1.11.3

## Usage:
* In your page header, add the required files.
```html
<script src="./../lib/jQuery.min.js" type="text/javascript"></script>
<script src="./../lib/lineRangeChart.js" type="text/javascript"></script>
```

* In your html, add the container area, typically a div.
```html
<div id="chartDemo"></div>
```

* Then add the javascript directives.
```javascript
let options = {
    min: 0,     // Scale minimum, mandatory
    max: 4,     // Scale maximum, mandatory
    step: 1,    // Scale separation (draw a line each 1 step), mandatory
    markers: {  // List of markers, mandatory. You can add as many markers as you wish.
        marker1: "Criteria 1",      // markerId: markerTitle. The markerId can be anything, but it needs to match with subjets values.
        marker2: {                  // Define the marker as an object to specifiy a custom color.
            title: "Criteria 2",    // The marker title, mandatory.
            color: "#fed330"        // The marker color, optional. If not defined, the color will be chosen for you.
        }
    },
    mode: "last",   // Which value to display in the subject header. Can be "last", "first", or "average". Optional. Defaults to "last".
    subjectTitle: "Projects",   // Left column title. Optional. Defaults to "".
    lowTitle: "Inexisting",     // Scale low title. Optional. Defaults to "Basic".
    highTitle: "Excellent",     // Scale high title. Optional. Defaults to "Advanced".
    subjects: [                 // List of subjects. Mandatory.
        {
            title: "Starter",   // Subject title. Mandatory.
            values: [           // List of values for the subject. Mandatory. Each value is a line in the accordion details.
                {
                    title: "Test 1",            // Title, which appears on the left part.
                    description: "Description", // Description, which appears on the right part.
                    marker1: 1,                 // A value for each marker specified in the markers object. Optional.
                    marker2: 3
                },
                {
                    title: "Test 2",
                    description: "Description 2",
                    marker1: 3,
                    marker2: 2
                }
            ]
        },
        {
            title: "Probant",
            values: [
                {
                    title: "Other test",
                    description: "Other description",
                    marker1: 0,
                    marker2: 4
                },
                {
                    title: "Other test 2",
                    description: "Other description 2",
                    marker1: 0,
                    marker2: 3
                }
            ]
        }
    ]
}

$("#chartDemo").lineRangeChart(options);
```