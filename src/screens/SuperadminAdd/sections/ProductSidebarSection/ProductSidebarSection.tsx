import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";

const navTabs = [
  { id: 1, name: "Gestion Admin", icon: "/img/crown.svg", active: false },
  { id: 2, name: "Gestion par client", icon: "/img/icon-8.svg", active: true },
];

interface NavTabProps {
  tab: {
    id: number;
    name: string;
    icon: string;
    active: boolean;
  };
}

interface DropzoneProps {
  dropzone: {
    text1: string;
    text2: string;
  };
}

const dropzones = Array(4).fill({
  text1: "Déposez vos images ici",
  text2: "Ou cliquer pour rechercher",
});

const NavTab: React.FC<NavTabProps> = ({ tab }) => (
  <div
    className={`flex-1 grow flex items-center gap-2 pt-2 pr-2 pb-2 pl-2 relative rounded-lg ${
      tab.active ? "bg-[#07515f]" : "bg-gray-200"
    }`}
  >
    <div className="flex w-6 h-6 items-center justify-center gap-2.5 p-0.5 relative">
      <img className="relative w-4 h-4" alt={tab.name} src={tab.icon} />
    </div>
    <div
      className={`relative flex-1 mt-[-1.00px] font-label-small font-bold ${
        tab.active ? "text-white" : "text-gray-700"
      } text-sm tracking-wide leading-5`}
    >
      {tab.name}
    </div>
  </div>
);

const Dropzone: React.FC<DropzoneProps> = ({ dropzone }) => (
  <div className="flex flex-col w-[113px] items-center justify-center gap-2.5 p-2 relative self-stretch rounded-lg overflow-hidden border border-dashed border-gray-300">
    <div className="flex w-6 h-6 items-center justify-center gap-2.5 p-px">
      <img className="w-3.5 h-3.5" alt="Icon" src="/img/icon-20.svg" />
    </div>
    <div className="self-stretch font-label-smallest font-bold text-gray-700 text-xs text-center tracking-wide leading-4">
      {dropzone.text1}
    </div>
    <div className="self-stretch font-label-smallest font-bold text-blue-500 text-xs text-center tracking-wide leading-4 underline">
      {dropzone.text2}
    </div>
  </div>
);

export const ProductSidebarSection = (): JSX.Element => {
  return (
    <div className="flex items-start justify-around gap-24 relative flex-1 self-stretch grow">
      <header className="flex flex-col items-start relative flex-1 self-stretch grow bg-transparent">
        <div className="flex flex-col items-start gap-8 p-4 relative flex-1 self-stretch w-full grow rounded-sm overflow-hidden overflow-y-scroll">
          <Card className="flex flex-col items-start gap-8 p-4 relative flex-1 self-stretch w-full grow rounded-lg overflow-hidden">
            <CardContent className="p-0 w-full">
              <div className="flex items-center justify-center relative self-stretch w-full">
                <div className="flex w-28 items-center relative">
                  <div className="relative w-8 h-8 rounded-2xl border-2 border-solid border-blue-500">
                    <div className="relative w-2.5 h-2.5 top-[9px] left-[9px] bg-blue-500 rounded-full" />
                  </div>
                  <div className="relative flex-1 grow h-0.5 bg-gray-100" />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-2xl border-2 border-solid border-gray-100" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-8">
                <h3 className="font-heading-h3 font-bold text-gray-700 text-lg tracking-wide leading-6 whitespace-nowrap">
                  Ajouter un nouveau produit
                </h3>
              </div>
              <div className="flex items-start justify-center gap-6 mt-8 relative flex-1 self-stretch w-full grow">
                <div className="flex flex-col items-start gap-4 relative flex-1 self-stretch grow">
                  <div className="flex flex-col items-start gap-6 relative self-stretch w-full">
                    <div className="relative w-full">
                      <Input
                        className="pt-2 pr-2 pb-2 pl-2"
                        defaultValue="Veste polaire"
                      />
                      <div className="inline-flex flex-col items-center justify-center absolute top-[-9px] left-4">
                        <img
                          className="absolute w-[93px] h-px top-[9px] -left-0.5 object-cover"
                          alt="Rectangle"
                          src="/img/rectangle-1.svg"
                        />
                        <div className="relative w-fit mt-[-1.00px] font-label-smaller font-bold text-gray-500 text-xs tracking-wide leading-4 whitespace-nowrap">
                          Nom du produit
                        </div>
                      </div>
                    </div>
                    <div className="w-full relative">
                      <Select defaultValue="Vêtements de travail">
                        <SelectTrigger className="w-full pt-2 pr-2 pb-2 pl-2">
                          <SelectValue placeholder="Vêtements de travail" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vêtements de travail">
                            Vêtements de travail
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="inline-flex flex-col items-center justify-center absolute top-[-9px] left-4">
                        <img
                          className="w-[61px] top-[9px] absolute h-px -left-0.5 object-cover"
                          alt="Rectangle"
                          src="/img/rectangle-1-1.svg"
                        />
                        <div className="relative w-fit mt-[-1.00px] font-label-smaller font-bold text-gray-500 text-xs tracking-wide leading-4 whitespace-nowrap">
                          Catégorie
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 relative self-stretch w-full">
                      <div className="relative flex-1">
                        <Select defaultValue="Unisexe">
                          <SelectTrigger className="w-full pt-2 pr-2 pb-2 pl-2">
                            <SelectValue placeholder="Unisexe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Unisexe">Unisexe</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="inline-flex flex-col items-center justify-center absolute top-[-9px] left-4">
                          <img
                            className="w-[39px] top-[9px] absolute h-px -left-0.5 object-cover"
                            alt="Rectangle"
                            src="/img/rectangle-1-2.svg"
                          />
                          <div className="relative w-fit mt-[-1.00px] font-label-smaller font-bold text-gray-500 text-xs tracking-wide leading-4 whitespace-nowrap">
                            Genre
                          </div>
                        </div>
                      </div>
                      <div className="relative flex-1">
                        <Select defaultValue="S, M, L">
                          <SelectTrigger className="w-full pt-2 pr-2 pb-2 pl-2">
                            <SelectValue placeholder="S, M, L" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="S, M, L">S, M, L</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="inline-flex flex-col items-center justify-center absolute top-[-9px] left-4">
                          <img
                            className="w-[34px] top-[9px] absolute h-px -left-0.5 object-cover"
                            alt="Rectangle"
                            src="/img/rectangle-1-3.svg"
                          />
                          <div className="relative w-fit mt-[-1.00px] font-label-smaller font-bold text-gray-500 text-xs tracking-wide leading-4 whitespace-nowrap">
                            Taille
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 relative self-stretch w-full">
                      <div className="flex items-center gap-2 pt-2 pr-2 pb-2 pl-2 relative flex-1 grow bg-gray-100 rounded-lg border border-solid border-gray-300">
                        <Checkbox
                          id="carton"
                          className="w-6 h-6"
                          defaultChecked
                        />
                        <label
                          htmlFor="carton"
                          className="flex-1 mt-[-1.00px] font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5"
                        >
                          Vendu par carton
                        </label>
                      </div>
                      <div className="flex items-center gap-2 pt-2 pr-2 pb-2 pl-2 flex-1 self-stretch grow bg-gray-100 rounded-lg border border-solid border-gray-300">
                        <Checkbox id="unite" className="w-6 h-6" />
                        <label
                          htmlFor="unite"
                          className="flex-1 font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5"
                        >
                          Vendu à l&apos;unité
                        </label>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 relative self-stretch w-full">
                      <div className="relative flex-1">
                        <Input
                          className="pt-2 pr-2 pb-2 pl-2"
                          defaultValue="13,99"
                        />
                        <div className="inline-flex flex-col items-center justify-center absolute top-[-9px] left-4">
                          <img
                            className="w-[89px] top-[9px] absolute h-px -left-0.5 object-cover"
                            alt="Rectangle"
                            src="/img/rectangle-1-4.svg"
                          />
                          <div className="relative w-fit mt-[-1.00px] font-label-smaller font-bold text-gray-500 text-xs tracking-wide leading-4 whitespace-nowrap">
                            Prix par carton
                          </div>
                        </div>
                      </div>
                      <div className="relative flex-1">
                        <Input
                          className="pt-2 pr-2 pb-2 pl-2 bg-gray-200 border-gray-300"
                          disabled
                        />
                        <div className="inline-flex flex-col items-center justify-center absolute top-[-9px] left-4">
                          <img
                            className="w-[73px] top-[9px] absolute h-px -left-0.5 object-cover"
                            alt="Rectangle"
                            src="/img/rectangle-1-5.svg"
                          />
                          <div className="relative w-fit mt-[-1.00px] font-label-smaller font-bold text-gray-400 text-xs tracking-wide leading-4 whitespace-nowrap">
                            Prix à l&apos;unité
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 relative self-stretch w-full">
                      <div className="relative flex-1">
                        <Input
                          className="pt-2 pr-2 pb-2 pl-2"
                          defaultValue="5"
                        />
                        <div className="inline-flex flex-col items-center justify-center absolute top-[-9px] left-4">
                          <img
                            className="w-[105px] top-[9px] absolute h-px -left-0.5 object-cover"
                            alt="Rectangle"
                            src="/img/rectangle-1-6.svg"
                          />
                          <div className="relative w-fit mt-[-1.00px] font-label-smaller font-bold text-gray-500 text-xs tracking-wide leading-4 whitespace-nowrap">
                            Pièces par carton
                          </div>
                        </div>
                      </div>
                      <div className="relative flex-1">
                        <Input
                          className="pt-2 pr-2 pb-2 pl-2"
                          defaultValue="ABC123"
                        />
                        <div className="inline-flex flex-col items-center justify-center absolute top-[-9px] left-4">
                          <img
                            className="w-[100px] top-[9px] absolute h-px -left-0.5 object-cover"
                            alt="Rectangle"
                            src="/img/rectangle-1-7.svg"
                          />
                          <div className="relative w-fit mt-[-1.00px] font-label-smaller font-bold text-gray-500 text-xs tracking-wide leading-4 whitespace-nowrap">
                            Référence (SKU)
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative w-full h-[175px]">
                      <Textarea
                        className="h-full pt-4 pr-4 pb-4 pl-4"
                        defaultValue="Une veste en polaire est une option de vêtement d&#39;extérieur confortable et légère, idéale pour les journées fraîches. Elle se caractérise généralement par un tissu doux et moelleux qui offre de la chaleur sans ajouter de volume. Beaucoup de vestes en polaire sont dotées d&#39;une fermeture éclair à l&#39;avant, ce qui les rend faciles à enfiler et à retirer, et elles ont souvent des poches pour ranger de petits objets. Disponibles dans une variété de couleurs et de styles, une veste en polaire est suffisamment polyvalente pour les aventures en plein air ou les sorties décontractées."
                      />
                      <div className="inline-flex flex-col items-center justify-center absolute top-[-11px] left-6">
                        <img
                          className="w-[81px] top-[11px] absolute h-px -left-0.5 object-cover"
                          alt="Rectangle"
                          src="/img/rectangle-1-8.svg"
                        />
                        <div className="relative w-fit mt-[-1.00px] font-label-small font-bold text-gray-500 text-sm tracking-wide leading-5 whitespace-nowrap">
                          Description
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between relative self-stretch">
                  <div className="flex flex-col items-start gap-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-start gap-6 self-stretch">
                        <div className="flex items-center gap-4">
                          <div
                            className="flex flex-col w-[250px] h-[250px] justify-end pt-1 pr-1 pb-1 pl-1 rounded-lg bg-cover bg-center items-start gap-6"
                            style={{
                              backgroundImage: "url(/img/frame-4347.png)",
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="gap-2 p-2 bg-green-500 border-green-500"
                              >
                                <img
                                  className="w-3.5 h-3.5"
                                  alt="Icon"
                                  src="/img/icon-15.svg"
                                />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="gap-2 p-2 bg-red-500 border-red-500"
                              >
                                <img
                                  className="w-3.5 h-3.5"
                                  alt="Icon"
                                  src="/img/icon-16.svg"
                                />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-col h-[250px] items-start justify-center gap-6">
                            <div className="flex items-center gap-6 flex-1 self-stretch w-full grow">
                              {dropzones.slice(0, 2).map((dropzone, index) => (
                                <Dropzone key={index} dropzone={dropzone} />
                              ))}
                            </div>
                            <div className="flex items-center gap-6 flex-1 grow">
                              {dropzones.slice(2, 4).map((dropzone, index) => (
                                <Dropzone key={index} dropzone={dropzone} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Button
                      variant="outline"
                      className="gap-4 py-4 px-4 self-stretch bg-gray-200 border-gray-300"
                    >
                      <span className="font-label-medium font-bold text-gray-700 text-sm tracking-wide leading-5 whitespace-nowrap">
                        Enregistrer en brouillon
                      </span>
                    </Button>
                    <Button className="gap-4 py-4 px-4 self-stretch bg-[#07515f] border-gray-300">
                      <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5 whitespace-nowrap">
                        Suivant
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>
    </div>
  );
};
