import type { Equipment_anamoly } from "../../../src/types/equipment_anamoly.types"
import { EquipmentAnamolySchema } from "./equipment_anamoly.schema"

export function isValidEquipmentAnamoly(
  row: Partial<Equipment_anamoly>
): row is Equipment_anamoly {
  return (Object.keys(EquipmentAnamolySchema) as (keyof Equipment_anamoly)[])
    .every((key) => EquipmentAnamolySchema[key](row[key]))
}