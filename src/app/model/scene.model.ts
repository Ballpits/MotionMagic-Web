export enum LengthUnit {
  Centimeter = 'cm',
  Meter = 'm',
  Kilometer = 'km',
  Inch = 'inch',
  Mile = 'mile',
}

export enum AngleUnit {
  Degree = '°',
  Radian = 'rad',
}

export enum MassUnit {
  Gram = 'g',
  Kilogram = 'kg',
  Pound = 'lb',
}

export enum AccelerationUnit {
  MeterPerSecondSquared = 'm/s^2',
}

export class SceneSettings {
  gravity: { x: number; y: number; unit: AccelerationUnit } = {
    x: 0,
    y: 0,
    unit: AccelerationUnit.MeterPerSecondSquared,
  };
  time_step: number = 0;
}

export class Point {
  x: number = 0;
  y: number = 0;
}

export abstract class BaseObject {
  id: number = 0;
  static: boolean = false;
  name: string = '';
  type: string = ''; // Can be 'rectangle', 'circle', or 'polygon'
  position: Point = { x: 0, y: 0 };
  rotation: { value: number; unit: AngleUnit } = {
    value: 0,
    unit: AngleUnit.Degree,
  };
  mass: { value: number; unit: MassUnit } = {
    value: 0,
    unit: MassUnit.Kilogram,
  };
  friction: { static: number; kinetic: number } = { static: 0, kinetic: 0 };
  color: string = '';
}

export class Rectangle extends BaseObject {
  dimension: { width: number; height: number; unit: LengthUnit } = {
    width: 0,
    height: 0,
    unit: LengthUnit.Centimeter,
  };
}

export class Circle extends BaseObject {
  radius: { value: number; unit: LengthUnit } = {
    value: 0,
    unit: LengthUnit.Centimeter,
  };
}

export class Polygon extends BaseObject {
  points: Point[] = [];
}

export type SceneObject = Rectangle | Circle | Polygon;

export class Scene {
  scene_name: string = '';
  author: string = '';
  created_at: string = '';
  last_modified_at: string = '';
  settings: SceneSettings = new SceneSettings();
  objects: SceneObject[] = [];
}
