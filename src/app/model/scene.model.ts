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

export enum LinearVelocityUnit {
  MeterPerSecond = 'm/s',
  KilometerPerHour = 'km/h',
  MilePerHour = 'mph',
  FeetPerSecond = 'ft/s',
  Knot = 'kn',
}

export enum AccelerationUnit {
  MeterPerSecondSquared = 'm/s^2',
}

export enum ObjectType {
  Rectangle = 'rectangle',
  Circle = 'circle',
  Polygon = 'polygon',
}

export interface SceneSettings {
  gravity: { x: number; y: number; unit: AccelerationUnit };
  time_step: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface BaseObject {
  name: string;
  static: boolean;
  type: ObjectType;
  position: Point;
  rotation: { value: number; unit: AngleUnit };
  mass: { value: number; unit: MassUnit };
  friction: { static: number; kinetic: number };
  linearVelocity: { x: number; y: number; unit: LinearVelocityUnit };
  color: string;
  border: string;
  borderThickness: number;
}

export interface Rectangle extends BaseObject {
  dimension: { width: number; height: number; unit: LengthUnit };
}

export interface Circle extends BaseObject {
  radius: { value: number; unit: LengthUnit };
}

export interface Polygon extends BaseObject {
  points: Point[];
}

export type SceneObject = Rectangle | Circle | Polygon;

export interface Scene {
  scene_name: string;
  author: string;
  created_at: string;
  last_modified_at: string;
  settings: SceneSettings;
  objects: { [key: number]: SceneObject };
}
