import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Textarea } from "../../components/ui/textarea";
import { Minus, Plus } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Magnet + stylo",
    ref: "122043",
    price: "49.99€",
    quantity: 1,
    total: "145,30 €",
    image: "",
  },
  {
    id: 2,
    name: "Polo homme - L",
    ref: "122043",
    price: "14.99€",
    quantity: 1,
    total: "89,99 €",
    image: "",
  },
  {
    id: 3,
    name: "Polo femme - M",
    ref: "122043",
    price: "49.99€",
    quantity: 1,
    total: "312,75 €",
    image: "",
  },
  {
    id: 4,
    name: "Polo femme - S",
    ref: "122043",
    price: "49.99€",
    quantity: 1,
    total: "312,75 €",
    image: "",
  },
  {
    id: 5,
    name: "Veste bodywarmer",
    ref: "122043",
    price: "39.99€",
    quantity: 1,
    total: "205,60 €",
    image: "",
  },
  {
    id: 6,
    name: "Bonnet",
    ref: "122043",
    price: "14.99€",
    quantity: 1,
    total: "478,20 €",
    image: "",
  },
  {
    id: 7,
    name: "Bonnet",
    ref: "122043",
    price: "14.99€",
    quantity: 1,
    total: "478,20 €",
    image: "",
  },
];

const orderSummary = {
  totalHT: "1 544,59 €",
  shippingCost: "38,94€",
  totalTTC: "1 922,53€",
};

const shippingAddress = {
  street: "400 rue de Menin",
  city: "Marcq en baroeul, 59700",
  country: "France",
  phone: "03 28 33 47 80",
};

const billingAddress = {
  name: "Thomas Dubois",
  street: "400 rue de Menin",
  city: "Marcq en baroeul, 59700",
  country: "France",
  phone: "03 28 33 47 80",
};

const ProductRow = ({ product }: { product: any }) => (
  <TableRow
    key={product.id}
    className="border-b border-primary-neutal-300 hover:bg-transparent"
  >
    <TableCell className="w-11 p-2">
      <Checkbox />
    </TableCell>
    <TableCell className="w-[203px] p-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded overflow-hidden border border-primary-neutal-200 flex items-center justify-center">
          <img
            className="w-[30px] h-[29px] object-cover"
            alt={product.name}
            src={product.image}
          />
        </div>
        <span className="font-text-medium text-black">{product.name}</span>
      </div>
    </TableCell>
    <TableCell className="w-[129px] text-center text-coolgray-100 text-sm">
      {product.ref}
    </TableCell>
    <TableCell className="w-[145px] text-center text-black text-[15px]">
      {product.price}
    </TableCell>
    <TableCell className="w-[145px] p-2.5">
      <div className="flex items-center justify-center gap-2 bg-[color:var(--1-tokens-color-modes-button-secondary-default-background)] rounded-[var(--2-tokens-screen-modes-button-border-radius)] border border-solid border-[color:var(--1-tokens-color-modes-button-secondary-default-border)] p-2">
        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-label-small text-[color:var(--1-tokens-color-modes-button-secondary-default-text)]">
          {product.quantity}
        </span>
        <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
    <TableCell className="w-[145px] text-center text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[15px]">
      {product.total}
    </TableCell>
  </TableRow>
);

const AddressSection = ({
  title,
  address,
}: {
  title: string;
  address: any;
}) => (
  <div className="flex flex-col gap-2">
    <h2 className="font-heading-h5 text-[#1e2324] text-[length:var(--heading-h5-font-size)] tracking-[var(--heading-h5-letter-spacing)] leading-[var(--heading-h5-line-height)]">
      {title}
    </h2>
    <p className="font-text-small text-[color:var(--1-tokens-color-modes-button-ghost-default-text)]">
      {address.name && (
        <>
          {address.name}
          <br />
        </>
      )}
      {address.street}
      <br />
      {address.city}
      <br />
      {address.country}
      <br />
      {address.phone}
    </p>
  </div>
);

const OrderSummary = ({ summary }: { summary: any }) => (
  <div className="mt-auto">
    {Object.entries(summary).map(([key, value]) => (
      <div key={key} className="flex justify-end items-center gap-4 px-2 py-3">
        <div className="flex w-[200px] items-center justify-between">
          <span className="text-black text-base font-normal">
            {key.toUpperCase()}
          </span>
          <span className="font-bold text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] text-base p-2.5">
            {value}
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default function CartContainer(): JSX.Element {
  return (
    <div className="flex flex-col h-full p-6 gap-8">
      <div className="flex flex-col gap-2.5">
        <h1 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)]">
          Panier
        </h1>
      </div>

      <div className="flex gap-6 flex-1">
        <Card className="flex-1 p-0 border-0 rounded-lg overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="h-full flex flex-col">
              <div className="bg-[#eaf8e7] rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-11 h-10 p-2">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="w-[203px] h-10 p-2.5 text-[#1e2324] font-text-small">
                        Produit
                      </TableHead>
                      <TableHead className="w-[129px] h-10 p-2.5 text-[#1e2324] font-text-small text-center">
                        Réf.
                      </TableHead>
                      <TableHead className="w-[145px] h-10 p-2.5 text-[#1e2324] font-text-small text-center">
                        Prix unitaire
                      </TableHead>
                      <TableHead className="w-[145px] h-10 p-2.5 text-[#1e2324] font-text-small text-center">
                        Quantité
                      </TableHead>
                      <TableHead className="w-[145px] h-10 p-2.5 text-[#1e2324] font-text-small text-center">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              <div className="flex-1 overflow-y-auto">
                <Table>
                  <TableBody>
                    {products.map((product) => (
                      <ProductRow key={product.id} product={product} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <OrderSummary summary={orderSummary} />
          </CardContent>
        </Card>

        <Card className="flex-1 bg-[color:var(--1-tokens-color-modes-background-primary)] rounded-lg">
          <CardContent className="flex flex-col gap-8 p-6 h-full">
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-heading-h5 text-[#1e2324] text-[length:var(--heading-h5-font-size)] tracking-[var(--heading-h5-letter-spacing)] leading-[var(--heading-h5-line-height)]">
                      Votre adresse de livraison
                    </h2>
                    <div className="flex gap-2">
                      <Input
                        className="flex-1 bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)]"
                        placeholder="Prénom"
                      />
                      <Input
                        className="flex-1 bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)]"
                        placeholder="Nom"
                      />
                    </div>
                  </div>
                  <AddressSection
                    title="Votre adresse de livraison"
                    address={shippingAddress}
                  />
                </div>
                <AddressSection
                  title="Votre adresse de facturation"
                  address={billingAddress}
                />
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="font-heading-h5 text-[#1e2324] text-[length:var(--heading-h5-font-size)] tracking-[var(--heading-h5-letter-spacing)] leading-[var(--heading-h5-line-height)]">
                  Validation N+1
                </h2>
                <Input
                  className="bg-[color:var(--1-tokens-color-modes-input-primary-disable-background)] border-[color:var(--1-tokens-color-modes-input-primary-disable-border)] text-[color:var(--1-tokens-color-modes-input-primary-disable-placeholder-label)]"
                  value="pierre.doe@chronodrive.com"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-4 flex-1">
                <h2 className="font-heading-h5 text-[#1e2324] text-[length:var(--heading-h5-font-size)] tracking-[var(--heading-h5-letter-spacing)] leading-[var(--heading-h5-line-height)]">
                  Commentaires
                </h2>
                <Textarea
                  className="flex-1 bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)]"
                  placeholder="Si vous souhaitez ajouter un commentaire sur votre commande, veuillez l'écrire ici."
                />
              </div>
            </div>

            <Button className="w-full bg-[#00b85b] border-[#1a8563] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] font-label-medium">
              Valider la commande
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
