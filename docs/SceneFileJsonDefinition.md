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
"objects": [
    {
         // Object properties
    },
    {
         // Object properties
    },
    {
         // Object properties
    },
]
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
    "diamension": { "width": float, "height": float, "unit": string },
    "rotation": { "value": float, "unit": string },
    "mass": { "value": float, "unit": string },
    "friction": { "static": float, "kinetic": float },
    "color": string
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
    "color": string
},
```

#### Polygon

```
{
    "id": int,
    "static": bool,
    "name": string,
    "type": "polygon",
    "position": { "x": float, "y": float, "unit": string },
    "points": [
        { "x": float, "y": float },
        { "x": float, "y": float },
        { "x": float, "y": float },
        { "x": float, "y": float },
        { "x": float, "y": float },
    ],
    "rotation": { "value": float, "unit": string },
    "mass": { "value": float, "unit": string },
    "friction": { "static": float, "kinetic": float },
    "color": string
},
```

## Example

```
{
    "scene_name": "MyPhysicsScene",
    "author": "John Doe",
    "created_at": "2023-10-25 12:00:00",
    "last_modified_at": "2023-10-25 14:30:00",
    "settings": 
    {
      "gravity": { "x": 0, "y": -9.81, "unit": "m/s^2" },
      "time_step": 0.02,
    },
    "objects": [
    {
        "id": 0,
        "static": false,
        "name": "Box",
        "type": "rectangle",
        "position": { "x": 640, "y": 374, "unit": "cm" },
        "diamension": { "width": 130, "height": 100, "unit": "cm" },
        "rotation": { "value": -21, "unit": "deg" },
        "mass": { "value": 20, "unit": "kg" },
        "friction": { "static": 0.3, "kinetic": 0.2 }
        "color": "#368BFF"
    },
    {
        "id": 1,
        "static": true,
        "name": "Ramp",
        "type": "polygon",
        "position": { "x": 200, "y": 400, "unit": "cm" },
        "points": [
            { "x": 0, "y": 250 },
            { "x": 650, "y": 250 },
            { "x": 650, "y": 0 },
        ]
        "rotation": { "value": 0, "unit": "deg" },
        "mass": { "value": 0, "unit": "kg" },
        "friction": { "static": 0.3, "kinetic": 0.2 }
        "color": "#FFFCBA"
    },
  ] 
}
```
