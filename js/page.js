/**
 * Traffic animations and lights control
 *
 * Some of the code was taken and adapted from https://github.com/ashiqur-rony/css-traffic-simulator
 * 
 * @author Rodrigo Minaberrigaray <rodrigo.minaberrigaray@gmail.com>
 * @author_url https://github.com/rminaberrigaray
 **/

 const TRAFFIC_FRECUENCY = {
     low: 3000,
     medium: 1500,
     high: 800
 };

 const MAX_LANE_CARS = 5;
 const vehicleClasses = ['car-1', 'car-2', 'car-3', 'taxi'];

let vehicleEl = '<div class="vehicle %vehicle-class%"></div>';
//let emergencyClass = ['police', 'ambulance'];
//let priorityVehicles = ['taxi', 'emergency'];
//let carSpace = 200;     //Space a car takes
//let busSpace = 200;     //Space a bus takes
//let truckSpace = 200;   //Space a truck takes
//let totalLane = 2200;   //Total lane width
//let occupy = 100;        //Percentage of occupancy on the lane

let lanes = {
    x: {
       id: "#lane-1",
       axis: "x",
       carsCount: 0,
       light: "#traffic-light-1",
       offset: 'left',
       checkPointOffset: -200,
       interval: null,
       stopped: true,
       vehicleHasPassed: function(lastPos, newPos, checkPoint) {
          return (lastPos < (checkPoint + 10) && newPos >= (checkPoint + 10));
       },
       animateObject: function(distance, delta = 0) {
          return {"left": `+=${distance - delta}`};
       }
    },
    y: {
       id: "#lane-2",
       axis: "y",
       carsCount: 0,
       light: "#traffic-light-2",
       offset: 'top',
       checkPointOffset: 175,
       interval: null,
       stopped: true,
       vehicleHasPassed: function(lastPos, newPos, checkPoint) {
          return (lastPos > (checkPoint - 10) && newPos <= (checkPoint - 10));
       },
       animateObject: function(distance, delta = 0) {
          return {"bottom": `-=${distance + delta}`};
       }
    }
}
let lane1Counter = 0;
let lane2Counter = 0;
let carsCount = 0;
let trafficIntervalX;
let trafficIntervalY;

let addVehicle = function (lane) {
    if (lane.carsCount < MAX_LANE_CARS) {
        let vehicleClass = vehicleClasses[Math.floor(Math.random() * vehicleClasses.length)];
        let vehicleElement = `<div class="vehicle car ${vehicleClass}"></div>`;
        let vehicle = $(vehicleElement).appendTo(`${lane.id}`);
        lane.carsCount++;
        $(vehicle).onVehiclePassed(lane);
        if (lane.stopped) {
            let checkPoint = $(lane.light).offset()[lane.offset] + (lane.checkPointOffset);
            $(vehicle).css('animationPlayState', 'paused');
            //$(vehicle).animate({ [lane.offset]: `+=${checkPoint - $(vehicle).offset()[lane.offset] - ((lane.carsCount - 1) * 100)}px` }, 2000 );
            $(vehicle).animate(lane.animateObject(checkPoint - $(vehicle).offset()[lane.offset], (lane.carsCount - 1) * 100), 2000 );
        }
    }
};

(function ($) {
    $(document).ready(function () {
        lanes.x.interval = setInterval(addVehicle.bind(null, lanes.x), TRAFFIC_FRECUENCY.high);
        lanes.y.interval = setInterval(addVehicle.bind(null, lanes.y), TRAFFIC_FRECUENCY.high);
    });
})(jQuery);

/**
 * Extension to handle element passed out of viewport
 * @param trigger
 * @param millis
 * @returns {jQuery|HTMLElement}
 */
jQuery.fn.onVehiclePassed = function (lane) {
    let checkPoint = $(lane.light).offset()[lane.offset] + lane.checkPointOffset;
    let o = $(this[0]); // our jquery object
    if (o.length < 1) return o;

    let lastPos = null;
    let interval = setInterval(function () {
        if (o == null || o.length < 1) return o; // abort if element is non existent

        let newPos = o.offset()[lane.offset];

        //if (lastPos < checkPoint && newPos >= checkPoint) {
        if (lane.vehicleHasPassed(lastPos, newPos, checkPoint)) {
            console.log("paso");
            lane.carsCount--;
            $(o).animate(lane.animateObject(500), 4000 );
            $(o).promise().done(function(){
                $(o).remove();
            });
            clearInterval(interval);
        }
        lastPos = newPos;
    }, 50);

    return o;
};

$(".change-frecuency").click(function() {
    let frecuency = $(this).data("traffic");
    let lane = lanes[$(this).data("lane")];
    lane.stopped = false;

    $(lane.id).find('.vehicle').each(function (index, item) {
        item.style.animationPlayState="running";
    });
    clearInterval(lane.interval);
    lane.interval = setInterval(addVehicle.bind(null, lane), TRAFFIC_FRECUENCY[frecuency]);
});

$(".stop").click(function() {
    let lane = lanes[$(this).data("lane")];
    let checkPoint = $(lane.light).offset()[lane.offset] + lane.checkPointOffset;
    let position = 0;
    lane.stopped = true;
    $(lane.id).find('.vehicle').each(function (index, item) {
        //if ($(item).offset()[lane.offset] < checkPoint) {
        if (lane.vehicleHasPassed($(item).offset()[lane.offset] - 1, $(item).offset()[lane.offset], checkPoint)) {
            item.style.animationPlayState="paused";
            $(item).animate({ "left": `+=${checkPoint - $(item).offset().left - (position * 100)}px` }, 2000 );
            position++;
        }
    });
});

function vehiclePassedBy(vehicle) {
    let lane = $(vehicle).closest('.lane').attr('id');
    let selector = null;
    if (lane == 'lane-1') {
        lane1Counter++;
        selector = "#x-"+lane1Counter;
    } else if (lane == 'lane-2') {
        lane2Counter++;
        selector = "#y-"+lane2Counter;
    }
    $(selector).remove();

    $('#lane-1-count').html(lane1Counter);
    $('#lane-2-count').html(lane2Counter);
}

function resetVehicleDisplay() {
    $('#lane-1').html(lane1Reset);
    $('#lane-2').html(lane2Reset);
    lane1Counter = 0;
    lane2Counter = 0;

    let vehicle = '';
    let carClass = '';
    let lane1Count = $('#lane-1').children('.car').length + $('#lane-1').children('.truck').length;
    let lane2Count = $('#lane-2').children('.car').length + $('#lane-2').children('.truck').length;
    //let lane3Count = $('#lane-3').children('.car').length + $('#lane-3').children('.bus').length + $('#lane-3').children('.truck').length;

    /*let spaceRemaining = Math.floor(totalLane * occupy / 100);

    let haveSpace = true;

    while (haveSpace) {
        let lane1Space = spaceRemaining - ($('#lane-1').children('.car').length * carSpace + $('#lane-1').children('.truck').length * truckSpace);
        let lane2Space = spaceRemaining - ($('#lane-2').children('.car').length * carSpace + $('#lane-2').children('.truck').length * truckSpace);

        let requiredSpace = carSpace;
        let lane1Filled = false;
        let lane2Filled = false;

        let carClass = '';

        let selected = vehicleClass[Math.floor(Math.random() * 2)];
        if (selected == 'truck') {
            if (($('.vehicle').length % 4) == 0) {
                requiredSpace = truckSpace;
            } else {
                selected = 'car';
            }
        }

        if (selected == 'car') {
            carClass += ' car-' + (Math.floor(Math.random() * 7) + 1);
            vehicle = vehicleEl.replace('%vehicle-class%', 'car ' + carClass);
        } else if (selected == 'truck') {
            vehicle = vehicleEl.replace('%vehicle-class%', 'truck ' + carClass);
        }

        //fill lane 1
        if (lane1Space >= requiredSpace) {
            let html = $('#lane-1').html();
            $('#lane-1').html('');
            $('#lane-1').html(vehicle + html);
            lane1Count++;
        } else {
            lane1Filled = true;
        }

        //fill lane 2
        if (lane2Space >= requiredSpace) {
            let html = $('#lane-2').html();
            $('#lane-2').html('');
            $('#lane-2').html(vehicle + html);
            lane2Count++;
        } else {
            lane2Filled = true;
        }

        if (lane1Filled && lane2Filled) {
            haveSpace = false;
        }
    }*/

    //fill lane 3
    /*haveSpace = true;

    while (haveSpace) {

        let prioritySpaceRemaining = Math.floor(totalLane * (occupy - 30) / 100);
        let lane3Space = prioritySpaceRemaining - ($('#lane-3').children('.car').length * carSpace + $('#lane-3').children('.bus').length * busSpace);
        let lane3Filled = false;
        let requiredSpace = carSpace;
        let carClass = '';

        //priority lane only have taxi and emergency
        let selected = priorityVehicles[Math.floor(Math.random() * 2)];
        requiredSpace = carSpace;
        if (selected == 'taxi') {
            vehicle = vehicleEl.replace('%vehicle-class%', 'car taxi ' + carClass);
        } else if (selected == 'emergency') {
            carClass += emergencyClass[Math.floor(Math.random() * 2)];
            vehicle = vehicleEl.replace('%vehicle-class%', 'car emergency ' + carClass);
        }

        if (lane3Space >= requiredSpace) {
            let html = $('#lane-3').html();
            $('#lane-3').html('');
            $('#lane-3').html(vehicle + html);
            lane3Count++;
        } else {
            lane3Filled = true;
        }

        if (lane3Filled) {
            haveSpace = false;
        }
    }*/

    /*if(occupy < 65) {
        $('.road-container').removeClass('slowest').removeClass('slow');
    } else if (occupy >= 65) {
        $('.road-container').removeClass('slowest').addClass('slow');
    } else if (occupy == 100) {
        $('.road-container').removeClass('slow').addClass('slowest');
    }*/

    $('#lane-1-count').html(lane1Counter);
    $('#lane-2-count').html(lane2Counter);

    $(document).find('.vehicle').each(function (index, item) {
        $(item).onVehiclePassed(vehiclePassedBy);
    });
}


