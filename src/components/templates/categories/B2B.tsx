
import { predefinedTemplates } from "../predefined/templatesData";

const b2bTemplates = predefinedTemplates.filter(
  t => t.category === "B2B"
);

export default b2bTemplates;
