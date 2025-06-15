
import { predefinedTemplates } from "../predefined/templatesData";

const mobileFirstTemplates = predefinedTemplates.filter(
  t => t.category === "Mobile-First"
);

export default mobileFirstTemplates;
