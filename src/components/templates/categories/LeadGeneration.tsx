
import { predefinedTemplates } from "../predefined/templatesData";

const leadGenerationTemplates = predefinedTemplates.filter(
  t => t.category === "Lead Generation"
);

export default leadGenerationTemplates;
