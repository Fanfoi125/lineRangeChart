/*jshint multistr: true */
(function($, window) {
    'use strict';
    let DriverChartModule = {
        getBlockWidth: function() {
            return $('.scale').outerWidth();
        },
        getBlocksWidth: function() {
            return $('.scales').outerWidth();
        },
        driverCheckboxStates: {},
        setdriverCheckboxStatesToDom: function() {
            localStorage.setItem('driverCheckboxStates', JSON.stringify(this.driverCheckboxStates));
        },
        alignMarkers: function(options) { // filter1,filter2,filter3
            let width = this.getBlocksWidth();

            for (let i=0; i<options.subjects.length; i++) {
                let subject = options.subjects[i];

                let value = {};

                if (options.mode == "last") {
                    value = subject.values[subject.values.length-1];
                }
                else if (options.mode == "first") {
                    value = subject.values[0];
                }
                else if (options.mode == "average") {

                    let values = [];

                    for(let j=0; j<subject.values.length; j++) {

                        for(let marker in options.markers) {
                            if (typeof values[marker] == "undefined") values[marker] = {sum:0, nb:0};
                            values[marker].sum += subject.values[j][marker];
                            values[marker].nb++;
                        }
                    }

                    value = {};

                    for(let marker in options.markers) {
                        value[marker] = values[marker].sum / values[marker].nb;
                    }
                }

                for(let marker in options.markers) {

                    if (typeof value != "undefined" && typeof value[marker] != "undefined") {

                        let left = width * value[marker] / options.max - 6.5;

                        let title = options.markers[marker]+": "+value[marker];

                        $(DriverChartModule.chartDom).find('.'+marker+'.head-marker').eq(i).css('left', left).attr("title", title).addClass("bs-tooltip");
                    }else{
                        $(DriverChartModule.chartDom).find('.'+marker+'.head-marker').eq(i).css('display', 'none');
                    }
                }
            }
        },
        alignDescMarkers: function(options) {

            let width = this.getBlocksWidth();

            for (let i = 0; i < options.subjects.length; i++) {
                let subject = options.subjects[i];

                for(let j=0; j<subject.values.length; j++) {
                    let value = subject.values[j];

                    for(let marker in options.markers) {

                        if (typeof value != "undefined" && typeof value[marker] != "undefined") {

                            let left = width * value[marker] / options.max -5;

                            let title = options.markers[marker]+": "+value[marker];

                            $(DriverChartModule.chartDom).find('.driver-row').eq(i).find('.'+marker+'.desc-marker').eq(j).css('left', left).attr("title", title).addClass("bs-tooltip");
                        }else{
                            $(DriverChartModule.chartDom).find('.driver-row').eq(i).find('.'+marker+'.desc-marker').eq(j).css('display', 'none');
                        }
                    }
                }
            }
        },
        connectTheDots: function(jQueryDotsContainer) {
            let markers = {};

            for(let key in DriverChartModule.options.markers) {
                markers[key] = $(jQueryDotsContainer).find('.'+key+'.desc-marker');
            }

            let lineDom, i, Dy, Dx, length, angle, transform;

            Object.keys(markers).forEach(function(key) {
                for (i = 0; i < markers[key].length - 1; i++) {
                    if ($(markers[key][i]).children().length === 0) {
                        lineDom = '<div class="line-container line-box' + i + '"><div class="line line' + i + '"></div>';
                        $(markers[key][i]).append(lineDom);
                    } else {
                        lineDom = $(markers[key][i]).find('.line-box');
                    }
                    Dy = 80;
                    Dx = $(markers[key][i + 1]).position().left - $(markers[key][i]).position().left;
                    length = Math.sqrt(Dy * Dy + Dx * Dx);
                    angle = Math.atan2(Dy, Dx);
                    transform = 'rotate(' + angle + 'rad)';
                    $(markers[key][i]).find('.line-container .line').css({
                        'transform': transform
                    });
                    $(markers[key][i]).find('.line-container').css({
                        'width': length + 'px'
                    });
                }
            });
        },
        options: [],
        chartDom: {}
    };

    function init() {
        DriverChartModule.alignMarkers(DriverChartModule.options);
        DriverChartModule.alignDescMarkers(DriverChartModule.options);
    }

    function checkLocalStorage() {
        if (!localStorage.getItem('driverCheckboxStates')) {
            DriverChartModule.setdriverCheckboxStatesToDom();
        }
    }

    function initAccordians() {
        var allPanels = $('.driver-desc').hide();

        $('.driver-wrapper').click(function() {
            let $target = $(this).next(),
                driverWrapper = $('.driver-wrapper');
            if ($target.hasClass('active')) { // closing
                $target.removeClass('active').slideUp();
                $(this).find('.arrow').removeClass('invert');
                $(this).find('.driver-right-text').fadeOut();
            } else { //opening
                allPanels.removeClass('active').slideUp();
                $target.addClass('active').slideDown();
                driverWrapper.find('.arrow').removeClass('invert');
                driverWrapper.find('.driver-right-text').fadeOut();
                $(this).find('.driver-right-text').fadeIn();
                $(this).find('.arrow').addClass('invert');
                DriverChartModule.connectTheDots($(this).next());
            }
            return false;
        });
    }

    function initDom(chartDom) {
        $.map(DriverChartModule.options.subjects, function(subject) {

            let header = '<div class="driver-row clearfix">\
      <div class="clearfix driver-wrapper"><div class="driver-name pull-left">' + subject.title +
                '</div><div class="filter2-chart pull-left"><div class="scales">';

            for(let i=0; i<DriverChartModule.options.steps; i++) {
                header += '<div class="scale pull-left" style="width:'+DriverChartModule.options.scaleWidth+'%"><div class="scale-border"></div></div>';
            }

            header += '</div>';
            header += '<div class="markers">';

            for(let key in DriverChartModule.options.markers) {
                header += '<span class="'+key+' head-marker marker"></span>';
            }

            header += '</div></div>\
      <div class="driver-right-text pull-left"><div class="text-center best-practices">'+DriverChartModule.options.detailsTitle+'</div></div>\
      <div class="arrow-bottom pull-right arrow"></div></div><div class="driver-desc clearfix"></div></div>';

            chartDom.append(header);

            $.map(subject.values, function(line) {

                let content = '<div class="description-wrapper"><div class="driver-name pull-left"><div class="driver-text">' +
                    line.title +
                    '</div></div><div class="filter2-chart pull-left"> <div class="scales">';

                for(let i=0; i<DriverChartModule.options.steps; i++) {
                    content += '<div class="scale pull-left" style="width:'+DriverChartModule.options.scaleWidth+'%"><div class="scale-border"></div></div>';
                }
                content += '</div><div class="markers">';

                for(let key in DriverChartModule.options.markers) {
                    content += '<span class="'+key+' desc-marker marker"></span>';
                }

                content += '</div></div>\
        <div class="desc-right-container pull-left"><div class="desc-text"> ' + line.description + '</div></div></div>';

                $('.driver-desc').last().append(content);
            });

        });
    }

    function appendStaticDom(chartDom) {

        let content = '<div class="checkbox-form"><ul>';

        for(let marker in DriverChartModule.options.markers) {

            content += '<li><input checked id="filter-'+marker+'" class="'+marker+'" type="checkbox" /><label for="filter-'+marker+'">'+DriverChartModule.options.markers[marker]+'</label></li>';
        }

        content += '</ul></div>';

        content += '<div class=driver-analysis-heading>'+
            '<div class="pull-left driver-heading">'+DriverChartModule.options.subjectTitle+'</div>'+
            '<div class="pull-left survey-heading">'+DriverChartModule.options.scoreTitle+'</div>'+
            '</div>'+
            '<div class="clearfix">'+
            ' <div class="pull-left space-fill"></div>'+
            ' <div class="pull-left chart-heading"><span>'+DriverChartModule.options.lowTitle+'</span> <span class="chart-heading-advanced">'+DriverChartModule.options.highTitle+'</span></div>'+
            '</div>'+
            '<div class="clearfix">'+
            ' <div class="pull-left space-fill"></div>'+
            ' <div class="pull-left chart-triangle">';

        for(let i=0; i<DriverChartModule.options.steps-1; i++) {
            content += '<div class="pull-left triangle-box" style="width:'+DriverChartModule.options.scaleWidth+'%"><div class="triangle triangle-left"></div></div>';
        }

        content += '<div class="pull-left triangle-box" style="width:'+DriverChartModule.options.scaleWidth+'%"><div class="pull-left triangle triangle-left"></div><div class="triangle pull-right triangle-right"></div></div>'+
            ' </div>'+
            '</div>';

        chartDom.append(content);
    }

    function checkboxWatcher() {

        DriverChartModule.chartDom.find('.checkbox-form input').on("click", function() {
            let checkboxVal = $(this).prop('checked');
            let marker = $(this).attr("class");

            let opacity = checkboxVal ? 1 : 0;

            $('.marker.'+marker).animate({
                opacity: opacity
            }, 200);

            DriverChartModule.driverCheckboxStates[marker] = checkboxVal;
            DriverChartModule.setdriverCheckboxStatesToDom();
        });
    }

    function initCheckboxPersistant() {
        let localState = localStorage.getItem('driverCheckboxStates');
        let checkboxdata = JSON.parse(localStorage.getItem('driverCheckboxStates'));

        $(DriverChartModule.chartDom).find(".checkbox-form input").each(function() {
            let marker = $(this).attr("class");
            if (typeof checkboxdata[marker] != "undefined" && !checkboxdata[marker]) $(this).click();
        });
    }

    $.fn.lineRangeChart = function(options) {
        if (!options) {
            console.error('Error in data format. Please go to https://github.com/rahulgaba16/linefilter2Chart to understand the data format that this chart expects.');
            return false;
        }
        let chartDom = this;

        options.steps = (options.max - options.min) / options.step;
        options.scaleWidth = 100 / options.steps;

        if (typeof options.mode == "undefined") options.mode = "last";
        if (typeof options.subjectTitle == "undefined") options.subjectTitle = "";
        if (typeof options.scoreTitle == "undefined") options.scoreTitle = "Score";
        if (typeof options.lowTitle == "undefined") options.lowTitle = "Basic";
        if (typeof options.highTitle == "undefined") options.highTitle = "Advanced";
        if (typeof options.detailsTitle == "undefined") options.detailsTitle = "Detailed info";

        DriverChartModule.options = options;
        DriverChartModule.chartDom = chartDom;


        chartDom.addClass('line-range-container');
        appendStaticDom(chartDom);
        checkLocalStorage();
        initDom(chartDom);
        initAccordians();
        init();
        checkboxWatcher();
        initCheckboxPersistant();
        chartDom.find('.driver-wrapper').first().click();
        $(window).resize(function() {
            let connectTheDotsContainer = chartDom.find('.active');
            init();
            if (connectTheDotsContainer.length > 1) {
                DriverChartModule.connectTheDots(connectTheDotsContainer);
            }
        });
    }
})(jQuery, window);
