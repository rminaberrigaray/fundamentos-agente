/**
 * Vehicle class.
 * 
 * Logic to generate vehicles, add them to lanes or stop their animations.
 *
 * @author Rodrigo Minaberrigaray <rodrigo.minaberrigaray@gmail.com>
 * @author_url https://github.com/rminaberrigaray
 **/
const vehicleClasses = ['car-1', 'car-2', 'car-3', 'taxi'];

class Vehicle {
    constructor() {
        this.class = vehicleClasses[Math.floor(Math.random() * vehicleClasses.length)];
    }

    getHtmlElement() {
        return `<div class="vehicle car ${this.class}"></div>`;
    }

    appendTo(lane) {
        this.lane = lane;
        this.domElement = $(this.getHtmlElement()).appendTo(`${lane.id}`);
        $(this.domElement).onVehiclePassed(lane);
        if (this.lane.stopped) {
            this.stop();
        }
    }

    stop() {
        let checkPoint = $(this.lane.light).offset()[this.lane.offset] + (this.lane.checkPointOffset);
        $(this.domElement).css('animationPlayState', 'paused');
        $(this.domElement).animate(
            this.lane.animateObject(checkPoint - $(this.domElement).offset()[this.lane.offset], (this.lane.carsCount - 1) * 100), 2000
        );
    }
}

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

    let interval = setInterval(function () {
        if (o == null || o.length < 1) return o; // abort if element is non existent

        let newPos = o.offset()[lane.offset];

        if (!lane.stopped && lane.vehicleHasPassed(newPos, checkPoint)) {
            lane.carsCount--;
            $(o).animate(lane.animateObject(), 4000 );
            $(o).promise().done(function(){
                $(o).remove();
            });
            clearInterval(interval);
        }
    }, 50);

    return o;
};
