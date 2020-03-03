/**
 * Handle the vehicle functionality
 *
 * @author Ashiqur Rahman
 * @url http://choobs.com
 * @author_url http://ashiqur.com
 **/

 const TRAFFIC_FRECUENCY = {
     low: 3000,
     medium: 1500,
     high: 800
 };

let vehicleEl = '<div class="vehicle %vehicle-class%"></div>';
let emergencyClass = ['police', 'ambulance'];
let vehicleClass = ['car', 'truck'];
let priorityVehicles = ['taxi', 'emergency'];
let lane1Reset = '';
let lane2Reset = '';
let carSpace = 200;     //Space a car takes
let busSpace = 200;     //Space a bus takes
let truckSpace = 200;   //Space a truck takes
let totalLane = 2200;   //Total lane width
let occupy = 100;        //Percentage of occupancy on the lane
let lane1Counter = 0;
let lane2Counter = 0;
let carsCount = 0;
let trafficInterval;

let addVehicle = function () {
    carsCount++;
    $("#lane-1").append(`<div id="x-${carsCount}" class="vehicle car"></div>`);
    $("#lane-1").find(`#x-${carsCount}`).each(function (index, item) {
        $(item).onVehiclePassed(vehiclePassedBy);
    });
};

(function ($) {
    $(document).ready(function () {
        lane1Reset = $('#lane-1').html();
        lane2Reset = $('#lane-2').html();
        resetVehicleDisplay();

        trafficInterval = setInterval(addVehicle, TRAFFIC_FRECUENCY.high);

    });
})(jQuery);

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

function vehiclePassedBy(vehicle) {
    let lane = $(vehicle).closest('.lane').attr('id');
    if (lane == 'lane-1') {
        lane1Counter++;
    } else if (lane == 'lane-2') {
        lane2Counter++;
    }
    $("#x-"+lane1Counter).remove();
    //cars.shift();

    $('#lane-1-count').html(lane1Counter);
    $('#lane-2-count').html(lane2Counter);
}

/**
 * Extension to handle element passed out of viewport
 * @param trigger
 * @param millis
 * @returns {jQuery|HTMLElement}
 */
jQuery.fn.onVehiclePassed = function (trigger, millis) {
    let checkPoint = $("#traffic-light-1").offset().left + 50;
    if (millis == null) millis = 50;
    let o = $(this[0]); // our jquery object
    if (o.length < 1) return o;

    let lastPos = null;
    let interval = setInterval(function () {
        if (o == null || o.length < 1) return o; // abort if element is non existent

        let newPos = o.offset().left;

        //console.log(o, lastPos, newPos);

        if (lastPos < checkPoint && newPos >= checkPoint) {
            vehiclePassedBy(o);
            //$(this).trigger('onVehiclePassed', {vehicle: o});
            //if (typeof (trigger) == "function") trigger(o);
            clearInterval(interval);
        }
        lastPos = newPos;
    }, millis);

    return o;
};

$("#agregar").click(function() {
    /*cars.push({type: 'car'});
    $('#lane-1').html(lane1Reset);
    cars.forEach(function(car, index) {
        $("#lane-1").append(`<div id="x-${index}" class="vehicle car"></div>`);
    });
    $("#lane-1").find(`.vehicle`).each(function (index, item) {
        $(item).onVehiclePassed(vehiclePassedBy);
    });*/
    
    carsCount++;
    $("#lane-1").append(`<div id="x-${carsCount}" class="vehicle car"></div>`);
    $("#lane-1").find(`#x-${carsCount}`).each(function (index, item) {
        $(item).onVehiclePassed(vehiclePassedBy);
    });
});

$(".change-frecuency").click(function() {
    $(document).find('.vehicle').each(function (index, item) {
        item.style.animationPlayState="running";
    });
    let frecuency = $(this).data("traffic");
    clearInterval(trafficInterval);
    trafficInterval = setInterval(addVehicle, TRAFFIC_FRECUENCY[frecuency]);
});

$("#stop").click(function() {
    let checkPoint = $("#traffic-light-1").offset().left - 200;
    let position = 0;
    $(document).find('.vehicle').each(function (index, item) {
        clearInterval(trafficInterval);
        if ($(item).offset().left < checkPoint) {
            item.style.animationPlayState="paused";
            $(item).animate({ "left": `+=${checkPoint - $(item).offset().left - (position * 100)}px` }, 2000 );
            position++;
        }
    });
});

