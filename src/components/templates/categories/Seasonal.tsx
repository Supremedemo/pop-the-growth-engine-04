
import { predefinedTemplates } from "../predefined/templatesData";

const seasonalTemplates = predefinedTemplates.filter(
  t => t.category === "Holiday/Seasonal"
);

export default seasonalTemplates;
