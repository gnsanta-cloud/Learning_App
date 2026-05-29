import type { Unit } from "../../types";
import { geminiJsonToUnit, type GeminiUnitJson } from "../../lib/geminiContent";
import unit1 from "../../../data/tech-home/unit1.json";
import unit2 from "../../../data/tech-home/unit2.json";
import unit3 from "../../../data/tech-home/unit3.json";
import unit4 from "../../../data/tech-home/unit4.json";
import unit5 from "../../../data/tech-home/unit5.json";
import unit6 from "../../../data/tech-home/unit6.json";

const RAW_UNITS: GeminiUnitJson[] = [unit1, unit2, unit3, unit4, unit5, unit6];

export const geminiTechHomeUnits: Unit[] = RAW_UNITS.map(geminiJsonToUnit);

export { getUnitQuizzes } from "../../lib/geminiContent";
