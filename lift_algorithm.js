const LiftState = {
    IDLE: 'idle',
    MOVING_UP: 'moving_up',
    MOVING_DOWN: 'moving_down',
    OCCUPIED: 'occupied'
};

class Lift {
    constructor(id, currentFloor, state, capacity, passengers = 0) {
        this.id = id;
        this.currentFloor = currentFloor;
        this.state = state;
        this.capacity = capacity;
        this.passengers = passengers;
    }

    isEmpty() {
        return this.passengers === 0;
    }

    isAvailable() {
        return this.state === LiftState.IDLE && this.isEmpty();
    }

    getStateDisplay() {
        return this.state.replace('_', ' ').toUpperCase();
    }
}

class LiftSystem {
    constructor(numLifts, numFloors, maxCapacity = 10) {
        this.numLifts = numLifts;
        this.numFloors = numFloors;
        this.maxCapacity = maxCapacity;
        this.lifts = [];
        this.initializeLiftsRandom();
    }

    initializeLiftsRandom() {
        this.lifts = [];
        const states = [LiftState.IDLE, LiftState.OCCUPIED, LiftState.MOVING_UP, LiftState.MOVING_DOWN];
        const weights = [0.5, 0.2, 0.15, 0.15];

        for (let i = 0; i < this.numLifts; i++) {
            const floor = Math.floor(Math.random() * this.numFloors);
            const state = this.weightedRandomChoice(states, weights);
            const passengers = state === LiftState.IDLE ? 
                0 : Math.floor(Math.random() * (this.maxCapacity + 1));

            const lift = new Lift(i, floor, state, this.maxCapacity, passengers);
            this.lifts.push(lift);
        }
    }

    weightedRandomChoice(items, weights) {
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < items.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return items[i];
            }
        }
        return items[items.length - 1];
    }

    findNearestAvailableEmptyLift(requestFloor) {
        let nearestLift = null;
        let minDistance = Infinity;

        for (const lift of this.lifts) {
            if (lift.isAvailable()) {
                const distance = Math.abs(lift.currentFloor - requestFloor);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestLift = lift;
                }
            }
        }

        return nearestLift ? { lift: nearestLift, distance: minDistance } : null;
    }

    findEarliestLift(currentFloor) {
        let earliestLift = null;
        let minTime = Infinity;

        for (const lift of this.lifts) {
            if (lift.isAvailable()) {
                const time = Math.abs(lift.currentFloor - currentFloor);
                if (time < minTime) {
                    minTime = time;
                    earliestLift = lift;
                }
            }
        }

        return earliestLift ? { lift: earliestLift, time: minTime } : null;
    }

    getAvailableLiftsCount() {
        return this.lifts.filter(lift => lift.isAvailable()).length;
    }
}

let liftSystem = null;

function initializeSystem() {
    const numLifts = parseInt(document.getElementById('numLifts').value);
    const numFloors = parseInt(document.getElementById('numFloors').value);

    liftSystem = new LiftSystem(numLifts, numFloors);
    displayLiftStatus();

    document.getElementById('demoResults').innerHTML = '<p style="color: #6b7280; font-style: italic;">Enter your current floor and click "Find Earliest Lift"</p>';
}

function displayLiftStatus() {
    const container = document.getElementById('liftStatus');
    container.innerHTML = '';

    liftSystem.lifts.forEach(lift => {
        const card = document.createElement('div');
        card.className = `lift-card ${lift.isAvailable() ? 'available' : 'busy'}`;

        const statusBadgeClass = `badge-${lift.state.replace('_', '-')}`;

        card.innerHTML = `
            <div class="lift-id">Lift #${lift.id}</div>
            <div class="lift-detail">
                <span class="lift-detail-label">Floor:</span>
                <span class="lift-detail-value">${lift.currentFloor}</span>
            </div>
            <div class="lift-detail">
                <span class="lift-detail-label">State:</span>
                <span class="lift-detail-value">
                    <span class="status-badge ${statusBadgeClass}">${lift.getStateDisplay()}</span>
                </span>
            </div>
            <div class="lift-detail">
                <span class="lift-detail-label">Passengers:</span>
                <span class="lift-detail-value">${lift.passengers}/${lift.capacity}</span>
            </div>
            <div class="lift-detail">
                <span class="lift-detail-label">Available:</span>
                <span class="lift-detail-value" style="font-weight: bold; color: ${lift.isAvailable() ? '#10b981' : '#ef4444'}">
                    ${lift.isAvailable() ? '✓ YES' : '✗ NO'}
                </span>
            </div>
        `;

        container.appendChild(card);
    });
}

function findEarliestLift() {
    if (!liftSystem) {
        alert('Please initialize the system first');
        return;
    }

    const currentFloor = parseInt(document.getElementById('currentFloor').value);
    if (currentFloor < 0 || currentFloor >= liftSystem.numFloors) {
        alert('Invalid floor number');
        return;
    }

    const result = liftSystem.findEarliestLift(currentFloor);
    const container = document.getElementById('demoResults');

    if (result) {
        const { lift, time } = result;
        container.innerHTML = `
            <h3>Result:</h3>
            <p><strong>Earliest Lift:</strong> Lift #${lift.id}</p>
            <p><strong>Current Position:</strong> Floor ${lift.currentFloor}</p>
            <p><strong>Your Floor:</strong> Floor ${currentFloor}</p>
            <p><strong>Time to Reach:</strong> ${time} floors</p>
            <p style="color: green; font-weight: bold;">✓ Lift will pick you up!</p>
        `;
    } else {
        container.innerHTML = `
            <h3>Result:</h3>
            <p style="color: red; font-weight: bold;">✗ No available lift found</p>
            <p>All lifts are busy or occupied</p>
        `;
    }
}

