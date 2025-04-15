import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { Textarea } from "../../components/ui/textarea";

export default function AddAgency() {
  const formFields = {
    categoryOptions: ["Agence", "Client", "Fournisseur"],
  };
  return (
    <div className="flex flex-col w-[820px] items-start gap-6">
      <div className="flex flex-col items-start gap-6 w-full">
        <FormField
          label="Catégorie du client"
          id="category"
          component={
            <Select defaultValue="Agence">
              <SelectTrigger className="w-full bg-gray-100 rounded-lg border">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {formFields.categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
        <FormField
          label="Code postal"
          id="postalCode"
          component={
            <Input
              defaultValue="59472"
              className="w-full bg-gray-100 rounded-lg border"
            />
          }
        />
        <FormField
          label="Ville"
          id="city"
          component={
            <Input
              defaultValue="Seclin"
              className="w-full bg-gray-100 rounded-lg border"
            />
          }
        />
        <FormField
          label="Adresse"
          id="address"
          component={
            <Input
              defaultValue="Rue Marcel Dassault"
              className="w-full bg-gray-100 rounded-lg border"
            />
          }
        />
        <FormField
          label="Commentaire d'adresse"
          id="addressComment"
          component={
            <Textarea
              placeholder="Exemple : Bâtiment numéro 2"
              className="w-full h-24 bg-gray-100 rounded-lg border"
            />
          }
        />
        <Separator className="w-full h-0.5 bg-gray-200 rounded-full" />
        <CheckboxField
          label="Limite de commande"
          id="orderLimit"
          defaultChecked
        />
        <CheckboxField label="Limite de budget" id="budgetLimit" />
        <FormField
          label="Limite"
          id="orderLimitValue"
          component={
            <Input
              defaultValue="3"
              className="w-full bg-gray-100 rounded-lg border"
            />
          }
        />
        <FormField
          label="Limite"
          id="budgetLimitValue"
          component={
            <Input
              defaultValue="4500€"
              disabled
              className="w-full bg-gray-200 rounded-lg border text-gray-400"
            />
          }
        />
        <FormField
          label="Mot de passe ADMIN"
          id="adminPassword"
          component={
            <Input
              type="password"
              defaultValue="mdp"
              className="w-full bg-gray-100 rounded-lg border"
            />
          }
        />
        <FormField
          label="Mot de passe CLIENT"
          id="clientPassword"
          component={
            <Input
              type="password"
              defaultValue="mdp"
              className="w-full bg-gray-100 rounded-lg border"
            />
          }
        />
        <FormField
          label="Email de validation du N+1"
          id="validationEmail"
          component={
            <Input
              type="email"
              defaultValue="pierre.doe@gmail.com"
              className="w-full bg-gray-100 rounded-lg border"
            />
          }
        />
      </div>
    </div>
  );
}

function FormField({ label, id, component }) {
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <div htmlFor={id} className="text-gray-600 text-sm font-medium">
        {label}
      </div>
      {component}
    </div>
  );
}

function CheckboxField({ label, id, defaultChecked }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <Checkbox id={id} defaultChecked={defaultChecked} className="h-5 w-5" />
      <div htmlFor={id} className="text-gray-600 text-sm font-medium">
        {label}
      </div>
    </div>
  );
}
