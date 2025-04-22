import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Package2Icon } from "lucide-react";

const productDetails = [
  { label: "Catégorie", value: "Vêtements de travail" },
  { label: "Tailles disponibles", value: "S,M,L" },
  { label: "Vendu par", value: "Carton" },
  { label: "Prix", value: "64,00€ / 5 pcs", isPrice: true },
  { label: "Stock disponible", value: "382" },
];

const ProductHeader = () => (
  <div className="flex flex-col items-start gap-2 w-full">
    <div className="inline-flex items-center gap-1">
      <div className="flex w-6 h-6 items-center justify-center p-0.5">
        <Package2Icon className="w-5 h-5" />
      </div>
      <h1 className="font-heading-h3 font-bold text-gray-800 text-lg tracking-wide leading-tight">
        Détails du produit
      </h1>
    </div>
  </div>
);

const ProductImage = () => (
  <div className="relative w-[524px] rounded-lg bg-gradient-to-b from-gray-800/20 to-gray-800/20">
    <img src="" alt="Veste polaire" className="w-full h-full object-cover" />
  </div>
);

const ProductInfo = () => (
  <div className="flex flex-col items-start gap-4">
    <div className="flex flex-col items-start gap-1">
      <h2 className="font-heading-h2 font-bold text-gray-900 text-xl tracking-wide leading-tight">
        Veste polaire
      </h2>
      <p className="font-heading-h3 font-bold text-gray-500 text-lg tracking-wide leading-tight">
        Référence : AB8723
      </p>
    </div>
    {productDetails.map((detail, index) => (
      <div key={index} className="flex flex-col items-start gap-1">
        <h3 className="text-gray-500 text-lg leading-tight font-heading-h3 font-bold tracking-wide">
          {detail.label}
        </h3>
        <p
          className={`${
            detail.isPrice ? "text-green-600" : "text-gray-900"
          } text-base leading-tight font-medium tracking-wide`}
        >
          {detail.value}
        </p>
      </div>
    ))}
  </div>
);

const ProductActions = () => (
  <div className="flex items-start gap-2 w-full">
    <Button className="flex-1 bg-teal-700 text-white rounded-lg border border-solid border-gray-300">
      Modifier le produit
    </Button>
    <Button
      variant="destructive"
      className="flex-1 bg-red-600 rounded-lg border border-solid border-red-200"
    >
      Supprimer
    </Button>
  </div>
);

const ProductDescription = () => (
  <div className="flex flex-col w-[700px] items-start gap-1">
    <h3 className="font-heading-h3 font-bold text-lg leading-tight text-gray-900 tracking-wide">
      Description
    </h3>
    <p className="font-medium text-base leading-tight text-gray-900 tracking-wide">
      Une veste polaire est une option de vêtement d&apos;extérieur confortable
      et légère, idéale pour les jours frais. Fabriquée en polyester synthétique
      doux, elle offre une bonne isolation thermique et un séchage rapide.
      Beaucoup de modèles de veste polaire incluent une fermeture éclair sur
      toute la longueur, des poches zippées et des cordons de serrage pour un
      ajustement personnalisé. Disponible dans une variété de couleurs et de
      styles, la veste polaire est parfaite pour un usage quotidien ou des
      activités de plein air.
    </p>
  </div>
);

export default function ProductDetails() {
  return (
    <Card className="flex flex-col items-center gap-8 p-6 bg-white rounded-lg overflow-hidden">
      <ProductHeader />
      <CardContent className="flex flex-col items-start gap-4 p-0 w-full">
        <section className="flex flex-col items-start gap-8 p-8 w-full rounded-sm overflow-hidden">
          <div className="flex items-center gap-6 w-full">
            <ProductImage />
            <div className="flex flex-col items-start gap-8 flex-1">
              <ProductInfo />
              <ProductActions />
            </div>
          </div>
          <ProductDescription />
        </section>
      </CardContent>
    </Card>
  );
}
