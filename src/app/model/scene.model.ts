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
  id: number;
  static: boolean;
  name: string;
  type: ObjectType;
  position: Point;
  rotation: { value: number; unit: AngleUnit };
  mass: { value: number; unit: MassUnit };
  friction: { static: number; kinetic: number };
  color: string;
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
  objects: SceneObject[];
}
