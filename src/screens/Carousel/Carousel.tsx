import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import { ImageIcon } from "lucide-react";
import React from "react";

const ImageUploadArea = ({ hasImage }: { hasImage: boolean }) => (
  <div
    className={`flex flex-col h-[113px] items-center justify-center gap-2.5 px-2 flex-1 rounded-lg overflow-hidden border border-dashed border-[color:var(--1-tokens-color-modes-border-primary)] ${
      hasImage ? "bg-[#f2ede5]" : ""
    }`}
  >
    {hasImage ? (
      <img
        className="flex-1 w-[134px] object-cover"
        alt="Uploaded image"
        src="/img/image.png"
      />
    ) : (
      <>
        <div className="flex w-4 h-4 items-center justify-center">
          <ImageIcon className="w-3.5 h-3.5" />
        </div>
        <p className="text-center font-label-smallest text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--label-smallest-font-size)] tracking-[var(--label-smallest-letter-spacing)] leading-[var(--label-smallest-line-height)]">
          Déposez vos images ici
        </p>
        <p className="text-center font-label-smallest text-1-tokens-color-modes-common-primary-brand-medium text-[length:var(--label-smallest-font-size)] tracking-[var(--label-smallest-letter-spacing)] leading-[var(--label-smallest-line-height)] underline">
          Ou cliquer pour rechercher
        </p>
      </>
    )}
  </div>
);

const SwitchWithLabel = ({ id, label }: { id: string; label: string }) => {
  const [checked, setChecked] = React.useState(false);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-lg">
        <Switch id={id} checked={checked} onCheckedChange={setChecked} />
        <label
          htmlFor={id}
          className="font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] whitespace-nowrap"
        >
          {label}
        </label>
      </div>
    </div>
  );
};

const SectionLabel = ({ text }: { text: string }) => (
  <div className="inline-flex flex-col items-center justify-center absolute top-[-11px] left-6">
    <div className="absolute w-[183px] h-px top-[11px] -left-0.5 bg-white"></div>
    <div className="relative w-fit px-2 bg-white font-label-small text-1-tokens-color-modes-common-neutral-hight text-[length:var(--label-small-font-size)] tracking-[var(--label-small-letter-spacing)] leading-[var(--label-small-line-height)] whitespace-nowrap">
      {text}
    </div>
  </div>
);

export default function Container(): JSX.Element {
  const imageUploadAreas = [
    { hasImage: true },
    { hasImage: false },
    { hasImage: false },
    { hasImage: false },
  ];

  return (
    <div className="flex flex-col items-start gap-8 p-6">
      <div className="flex flex-col gap-8 relative w-full rounded-lg">
        <div className="flex h-64 items-center justify-center rounded-lg bg-[#f2ede3] overflow-hidden">
          <img
            className="h-full w-[255px] object-cover"
            alt="Carousel preview"
            src="/img/image.png"
          />
        </div>

        <Card className="w-full bg-white overflow-hidden mb-[-56px]">
          <CardContent className="p-6 flex flex-col gap-8">
            <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
              Carrousel d&apos;accueil
            </h3>

            <Card className="border border-solid border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-lg bg-[color:var(--1-tokens-color-modes-input-primary-default-background)]">
              <CardContent className="p-4 flex flex-col gap-4 relative">
                <div className="flex-col items-start gap-4 inline-flex">
                  <SwitchWithLabel
                    id="show-carousel"
                    label="Afficher le carrousel sur l'accueil"
                  />
                  <SwitchWithLabel id="auto-loop" label="Boucle automatique" />
                </div>
                <SectionLabel text="Configuration du carrousel" />
              </CardContent>
            </Card>

            <Card className="border border-solid border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-lg bg-[color:var(--1-tokens-color-modes-input-primary-default-background)]">
              <CardContent className="p-4 flex flex-col gap-4 relative">
                <p className="font-text-small text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)]">
                  Image recommandée : 1600×600 px (JPEG ou PNG, max 2 Mo). Les
                  zones importantes doivent être centrées.
                </p>
                <SectionLabel text="Ajout des images" />
                <div className="flex items-start gap-2 w-full">
                  {imageUploadAreas.slice(0, 2).map((area, index) => (
                    <ImageUploadArea
                      key={`upload-area-${index}`}
                      hasImage={area.hasImage}
                    />
                  ))}
                </div>
                <div className="flex items-start gap-2 w-full">
                  {imageUploadAreas.slice(2, 4).map((area, index) => (
                    <ImageUploadArea
                      key={`upload-area-${index + 2}`}
                      hasImage={area.hasImage}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button className="h-12 self-end bg-[#07515f] text-[color:var(--1-tokens-color-modes-button-primary-default-text)]">
              Enregistrer
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
