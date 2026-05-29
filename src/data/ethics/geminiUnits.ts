import type { Unit } from "../../types";
import { geminiJsonToUnit } from "../../lib/geminiContent";
import type { GeminiUnitJson } from "../../lib/geminiContent";
import unit1 from "../../../data/ethics/unit1.json";
import unit2 from "../../../data/ethics/unit2.json";
import unit3 from "../../../data/ethics/unit3.json";
import unit4 from "../../../data/ethics/unit4.json";

const RAW_UNITS: GeminiUnitJson[] = [unit1, unit2, unit3, unit4];

export const geminiEthicsUnits: Unit[] = RAW_UNITS.map(geminiJsonToUnit);
