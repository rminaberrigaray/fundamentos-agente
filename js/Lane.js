let addVehicle = function (lane) {
    if (lane.carsCount < MAX_LANE_CARS) {
        let vehicle = new Vehicle();
        lane.carsCount++;
        vehicle.appendTo(lane);
    }
};

class Lane {
    constructor(id, light, counter, stopped, frecuency) {
        this.id = id;
        this.light = light;
        this.counter = counter;
        this.stopped = stopped;
        this.frecuency = frecuency;
        this.carsCount = 0;
        this.interval = setInterval(addVehicle.bind(null, this), TRAFFIC_FRECUENCY[this.frecuency])
    }

    start() {
        this.stopped = false;
    
        $(this.id).find('.vehicle').each(function (index, item) {
            item.style.animationPlayState="running";
        });
        clearInterval(this.interval);
        this.interval = setInterval(addVehicle.bind(null, this), TRAFFIC_FRECUENCY[this.frecuency]);
        $(`${this.light}, ${this.counter}`).removeClass("red");
        $(`${this.light}, ${this.counter}`).addClass("green");
    }

    stop() {
        let checkPoint = $(this.light).offset()[this.offset] + this.checkPointOffset;
        let position = 0;
        this.stopped = true;
        $(`${this.light}, ${this.counter}`).removeClass("yellow");
        $(`${this.light}, ${this.counter}`).addClass("red");
        var self = this;
        $(this.id).find('.vehicle').each(function (index, vehicle) {
            if (!self.vehicleHasPassed($(vehicle).offset()[self.offset], checkPoint)) {
                vehicle.style.animationPlayState="paused";
                $(vehicle).animate(self.animateObject(checkPoint - $(vehicle).offset()[self.offset], position * 100), 2000 );
                position++;
            }
        });
    }

    vehicleHasPassed(position, checkpoint) {
        // subclass
    }
    
}

class HorizontalLane extends Lane {
    constructor(id, light, counter, stopped, frecuency) {
        super(id, light, counter, stopped, frecuency);
        this.axis = 'x';
        this.offset = 'left';
        this.checkPointOffset = -200;
    }

     vehicleHasPassed (position, checkPoint) {
        return position >= (checkPoint + 10);
     }
     animateObject (distance = 500, delta = 0) {
        return {"left": `+=${distance - delta}`};
     }
}

class VerticalLane extends Lane {
    constructor(id, light, counter, stopped, frecuency) {
        super(id, light, counter, stopped, frecuency);
        this.axis = 'y';
        this.offset = 'top';
        this.checkPointOffset = 175;
    }

    vehicleHasPassed(position, checkPoint) {
        return position <= (checkPoint - 10);
     }

     animateObject(distance = 0, delta = 0) {
        return {"bottom": `-=${distance + delta}`};
     }
}