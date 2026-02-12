# Lift Scheduling Algorithm

A simple web-based lift scheduling system that finds the earliest available lift to pick you up.

## Features

### 1. Configurable System
- Set number of lifts (1-20)
- Set number of floors (5-100)
- Random initialization of lift positions and states

### 2. Real-time Lift Status
- View all lifts with their current floor
- See lift state (IDLE, MOVING UP, MOVING DOWN, OCCUPIED)
- Check passenger count
- Identify available lifts instantly

### 3. Find Earliest Lift
- Enter your current floor
- Algorithm finds the nearest available empty lift
- Shows which lift will reach you first
- Displays time to reach (in floors)

### 4. Lift States
- **IDLE**: Lift is empty and stationary
- **MOVING UP**: Lift is going up
- **MOVING DOWN**: Lift is going down
- **OCCUPIED**: Lift has passengers

## How It Works

The algorithm iterates through all lifts and:
1. Checks if lift is available (idle and empty)
2. Calculates distance between lift and your floor
3. Returns the lift with minimum distance

**Time Complexity**: O(n) where n = number of lifts  
**Space Complexity**: O(1)

## Usage

1. Open `index.html` in a web browser
2. Configure number of lifts and floors
3. Click "Initialize System" to set up the lifts
4. Enter your current floor
5. Click "Find Earliest Lift" to see which lift will pick you up

## Files

- `index.html` - User interface
- `lift_algorithm.js` - Core algorithm and logic
- `README.md` - Documentation
