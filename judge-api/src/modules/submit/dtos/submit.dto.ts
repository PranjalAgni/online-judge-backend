import { object, string } from "superstruct";

export const CreateSubmitStruct = object({
  source: string(),
  lang: string(),
  timelimit: string(),
  testcases: string(),
  scenario: string()
});
