# Scene File Json Definition

## Format

### Basic info

```
"scene_name": string,
"author": string,
"created_at": string,         // Format: YYYY-MM-DD HH:mm:ss
"last_modified_at": string,    // Format: YYYY-MM-DD HH:mm:ss
```

### Scene Settings

```
"scene_settings": 
{
  "gravity": { "x": float, "y": float , "unit": string },
  "time_step": float    // The interval (seconds) the simulator will step
}
```

### Objects

The list containing the objects in the scene.

```
"objects": {
    "id": {
         // Object properties
    },
    "id": {
         // Object properties
    },
    "id": {
         // Object properties
    },
}
```

### Object

#### Rectangle

```
{
    "id": int,
    "static": bool,
    "name": string,
    "type": "rectangle",
    "position": { "x": float, "y": float, "unit": string },
    "dimension": { "width": float, "height": float, "unit": string },
    "rotation": { "value": float, "unit": string },
    "mass": { "value": float, "unit": string },
    "friction": { "static": float, "kinetic": float },
    "color": string,
    "border": string,
    "borderThickness": float    
},
```

#### Circle

```
{
    "id": int,
    "static": bool,
    "name": string,
    "type": "circle",
    "position": { "x": float, "y": float, "unit": string },
    "radius": { "value": float, "unit": string },
    "rotation": { "value": float, "unit": string },
    "mass": { "value": float, "unit": string },
    "friction": { "static": float, "kinetic": float },
    "color": string,
    "border": string,
    "borderThickness": float
},
```

#### Polygon

```
{
  "scene_name": "Test Scene",
  "author": "UT",
  "created_at": "2023-12-03 12:00:00",
  "last_modified_at": "2023-12-04 14:30:00",
  "settings": {
    "gravity": { "x": 0, "y": -9.81, "unit": "m/s^2" },
    "time_step": 0.02
  },
  "objects": {
    "0": {
      "static": false,
      "name": "Box",
      "type": "rectangle",
      "position": { "x": 640, "y": 374, "unit": "cm" },
      "dimension": { "width": 130, "height": 100, "unit": "cm" },
      "rotation": { "value": -21, "unit": "deg" },
      "mass": { "value": 20, "unit": "kg" },
      "friction": { "static": 0.3, "kinetic": 0.2 },
      "color": "#368BFF",
      "border": "#2776E6",
      "borderThickness": 5
    },
    "1": {
      "static": true,
      "name": "Ramp",
      "type": "polygon",
      "position": { "x": 550, "y": 600, "unit": "cm" },
      "points": [
        { "x": 0, "y": 250 },
        { "x": 650, "y": 250 },
        { "x": 650, "y": 0 }
      ],
      "rotation": { "value": 0, "unit": "deg" },
      "mass": { "value": 0, "unit": "kg" },
      "friction": { "static": 0.3, "kinetic": 0.2 },
      "color": "#FFFCBA",
      "border": "#D6D08B",
      "borderThickness": 5
    },
    "2": {
      "static": true,
      "name": "Floor",
      "type": "rectangle",
      "position": { "x": 0, "y": 500, "unit": "cm" },
      "dimension": { "width": 500, "height": 100, "unit": "cm" },
      "rotation": { "value": 0, "unit": "deg" },
      "mass": { "value": 0, "unit": "kg" },
      "friction": { "static": 0.3, "kinetic": 0.2 },
      "color": "#368BBB",
      "border": "#2878A6",
      "borderThickness": 5
    },
    "3": {
      "static": false,
      "name": "Ball",
      "type": "circle",
      "position": { "x": 640, "y": 0, "unit": "cm" },
      "radius": { "value": 39.13776, "unit": "cm" },
      "rotation": { "value": 0, "unit": "deg" },
      "mass": { "value": 20, "unit": "kg" },
      "friction": { "static": 0.3, "kinetic": 0.2 },
      "color": "#CCCCFF",
      "border": "#A6A6F7",
      "borderThickness": 5
    }
  }
}
```
