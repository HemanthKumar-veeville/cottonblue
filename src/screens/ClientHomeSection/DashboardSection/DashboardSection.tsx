import { BellIcon, SearchIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";

const productData = {
  mostOrdered: [
    {
      id: 1,
      name: "Magnet + stylo",
      price: "64,00€",
      quantity: "/200pcs",
      status: "En stock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image.png",
    },
    {
      id: 2,
      name: "Ballon de plage",
      price: "64,00€",
      quantity: "/200pcs",
      status: "Épuisé",
      statusColor: "text-defaultalert",
      image: "/img/product-image-1.svg",
    },
    {
      id: 3,
      name: "Polo homme",
      price: "64,00€",
      quantity: "/200pcs",
      status: "En stock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image-2.png",
    },
    {
      id: 4,
      name: "Polo femme",
      price: "64,00€",
      quantity: "/200pcs",
      status: "En stock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image-3.png",
    },
    {
      id: 5,
      name: "Veste bodywarmer",
      price: "64,00€",
      quantity: "/200pcs",
      status: "Épuisé",
      statusColor: "text-defaultalert",
      image: "/img/product-image-4.png",
    },
  ],
  storeRange: [
    {
      id: 1,
      name: "Magnet + stylo",
      price: "64,00€",
      quantity: "/200pcs",
      status: "En stock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image-5.svg",
    },
    {
      id: 2,
      name: "Polo homme",
      price: "64,00€",
      quantity: "/200pcs",
      status: "En stock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image-6.png",
    },
    {
      id: 3,
      name: "Polo femme",
      price: "64,00€",
      quantity: "/200pcs",
      status: "En stock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image-7.png",
    },
  ],
  workClothes: [
    {
      id: 1,
      name: "Polo homme",
      price: "25,75€",
      quantity: "/5pcs",
      status: "En stock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image-8.png",
    },
    {
      id: 2,
      name: "Polo femme",
      price: "24,25€",
      quantity: "/5pcs",
      status: "En stock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image-9.png",
    },
    {
      id: 3,
      name: "Veste bodywarmer",
      price: "61,00 €",
      quantity: "/5pcs",
      status: "Épuisé",
      statusColor: "text-defaultalert",
      image: "/img/product-image-10.png",
    },
    {
      id: 4,
      name: "Tour de cou",
      price: "8,65€",
      quantity: "/5pcs",
      status: "Épuisé",
      statusColor: "text-defaultalert",
      image: "/img/product-image-11.png",
    },
    {
      id: 5,
      name: "Bonnet",
      price: "64,00€",
      quantity: "/200pcs",
      status: "Épuisé",
      statusColor: "text-defaultalert",
      image: "/img/product-image-12.png",
    },
  ],
};

const ProductCard = ({ product }) => (
  <Card className="w-[235.2px] shadow-shadow">
    <CardContent className="p-4">
      <div className="flex flex-col items-start gap-4 relative self-stretch w-full">
        <div
          className="h-[134px] relative self-stretch w-full rounded-2xl bg-cover bg-[50%_50%]"
          style={{ backgroundImage: `url(${product.image})` }}
        />
        <div className="inline-flex flex-col items-start gap-1 relative">
          <div
            className={`relative w-fit mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] ${product.statusColor} text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]`}
          >
            {product.status}
          </div>
          <div className="relative w-fit font-normal text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-base tracking-[0] leading-[22.4px] whitespace-nowrap">
            {product.name}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-5 relative self-stretch w-full mt-4">
        <div className="relative w-fit mt-[-1.00px] font-normal text-coolgray-100 text-lg tracking-[0] leading-[25.2px] whitespace-nowrap">
          <span className="font-[number:var(--body-l-font-weight)] font-body-l [font-style:var(--body-l-font-style)] tracking-[var(--body-l-letter-spacing)] leading-[var(--body-l-line-height)] text-[length:var(--body-l-font-size)]">
            {product.price}
          </span>
          <span className="text-[length:var(--body-s-font-size)] leading-[var(--body-s-line-height)] font-body-s [font-style:var(--body-s-font-style)] font-[number:var(--body-s-font-weight)] tracking-[var(--body-s-letter-spacing)]">
            {product.quantity}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProductSection = ({ title, products }) => (
  <div className="flex flex-col items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
    <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
      <h3 className="relative w-fit mt-[-1.00px] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] whitespace-nowrap [font-style:var(--heading-h3-font-style)]">
        {title}
      </h3>
    </div>
    <div className="flex items-start gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-gap)] relative self-stretch w-full flex-[0_0_auto]">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
);

export const DashboardSection = (): JSX.Element => {
  return (
    <div className="flex items-start justify-around gap-[100px] relative flex-1 self-stretch grow">
      <header className="flex flex-col h-[984px] items-center flex-nowrap relative flex-1 grow bg-transparent overflow-y-scroll">
        <div className="flex w-full items-center justify-end gap-[182px] px-8 py-4 relative bg-defaultwhite border-b border-1-tokens-color-modes-common-neutral-lower">
          <div className="inline-flex items-center gap-4 relative flex-[0_0_auto] ml-[-7.00px]">
            <div className="flex w-[641px] gap-4 items-center relative">
              <div className="flex w-[400px] items-center justify-between relative bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)] border border-solid border-[color:var(--1-tokens-color-modes-input-primary-default-border)]">
                <Input
                  className="border-none shadow-none focus-visible:ring-0 font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)]"
                  placeholder="Rechercher un produit"
                />
                <div className="flex w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] items-center justify-center p-0.5 relative">
                  <SearchIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
          <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
            <div className="inline-flex justify-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-larger-gap)] p-[var(--2-tokens-screen-modes-common-spacing-XS)] bg-[color:var(--1-tokens-color-modes-background-secondary)] items-center relative flex-[0_0_auto] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)]">
              <div className="flex w-[var(--2-tokens-screen-modes-sizes-button-input-nav-larger-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-larger-line-height)] items-center justify-center p-0.5 relative">
                <UserIcon className="w-6 h-6" />
              </div>
              <div className="inline-flex flex-col items-start justify-center relative flex-[0_0_auto]">
                <div className="relative self-stretch mt-[-1.00px] font-label-small font-[number:var(--label-small-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--label-small-font-size)] tracking-[var(--label-small-letter-spacing)] leading-[var(--label-small-line-height)] [font-style:var(--label-small-font-style)]">
                  Mon compte
                </div>
                <div className="relative self-stretch font-label-medium font-[number:var(--label-medium-font-weight)] text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] [font-style:var(--label-medium-font-style)]">
                  Marcq-en-Baroeul
                </div>
              </div>
            </div>
            <div className="inline-flex justify-center gap-2 flex-[0_0_auto] items-center relative">
              <div className="inline-flex h-12 items-center justify-center gap-4 px-3 py-4 relative flex-[0_0_auto]">
                <BellIcon className="w-6 h-6 mt-[-4.00px] mb-[-4.00px]" />
                <Badge className="absolute top-2 left-6 bg-defaultalert rounded-xl">
                  9
                </Badge>
              </div>
              <div className="inline-flex justify-end gap-4 flex-[0_0_auto] items-center relative">
                <div className="inline-flex h-12 items-center justify-center gap-4 px-2 py-4 relative flex-[0_0_auto]">
                  <ShoppingCartIcon className="w-6 h-6 mt-[-4.00px] mb-[-4.00px]" />
                  <div className="inline-flex items-center justify-center relative flex-[0_0_auto] mt-[-4.00px] mb-[-4.00px]">
                    <div className="relative w-fit mt-[-1.00px] font-text-medium font-[number:var(--text-medium-font-weight)] text-1-tokens-color-modes-common-neutral-highter text-[length:var(--text-medium-font-size)] tracking-[var(--text-medium-letter-spacing)] leading-[var(--text-medium-line-height)] whitespace-nowrap [font-style:var(--text-medium-font-style)]">
                      Panier
                    </div>
                  </div>
                  <Badge className="absolute top-2 left-6 bg-defaultalert rounded-xl">
                    9
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full items-start gap-8 p-[var(--2-tokens-screen-modes-common-spacing-l)] relative flex-[0_0_auto] overflow-y-scroll">
          <div className="flex flex-col items-center justify-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex h-64 items-center justify-center gap-2.5 relative self-stretch w-full rounded-[var(--2-tokens-screen-modes-button-border-radius)] [background:linear-gradient(0deg,rgba(242,237,227,1)_0%,rgba(242,237,227,1)_100%)]">
              <img
                className="relative self-stretch w-[255px] object-cover"
                alt="Banner image"
                src="/img/banner-image.png"
              />
            </div>
            <div className="inline-flex items-start gap-[var(--2-tokens-screen-modes-common-spacing-m)] relative flex-[0_0_auto]">
              <div className="bg-[#00b85b] rounded-lg relative w-4 h-4" />
              <div className="rounded-lg border border-solid border-[#00b85b] relative w-4 h-4" />
              <img
                className="relative w-4 h-4"
                alt="Ellipse"
                src="/img/ellipse-4.svg"
              />
            </div>
          </div>
          <ProductSection
            title="Les plus commandés"
            products={productData.mostOrdered}
          />
          <ProductSection
            title="Gamme magasins"
            products={productData.storeRange}
          />
          <ProductSection
            title="Vêtements de travail"
            products={productData.workClothes}
          />
        </div>
      </header>
    </div>
  );
};
