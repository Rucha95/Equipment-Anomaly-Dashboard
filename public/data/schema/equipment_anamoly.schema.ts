import {Equipment_anamoly} from '../../../src/types/equipment_anamoly.types'

type Validator<T> = (value: unknown) => value is T

export const EquipmentAnamolySchema: {
  [K in keyof Equipment_anamoly]: Validator<Equipment_anamoly[K]>
} = {
  temperature: (v): v is number =>
    typeof v === "number" && Number.isFinite(v),

  pressure: (v): v is number =>
    typeof v === "number" && Number.isFinite(v),

  vibration: (v): v is number =>
    typeof v === "number" && Number.isFinite(v),

  humidity: (v): v is number =>
    typeof v === "number" && Number.isFinite(v),

  equipment: (v): v is string =>
    typeof v === "string" && v.trim().length > 0,

  location: (v): v is string =>
    typeof v === "string" && v.trim().length > 0,

  faulty: (v): v is 0 | 1 =>
    v === 0 || v === 1,
}
