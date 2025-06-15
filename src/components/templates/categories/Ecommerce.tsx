
import { predefinedTemplates } from "../predefined/templatesData";

const ecommerceTemplates = predefinedTemplates.filter(
  t => t.category === "E-commerce"
);

export default ecommerceTemplates;
