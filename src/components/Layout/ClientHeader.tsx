import { BellIcon, SearchIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";

export const ClientHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full items-center justify-end gap-[182px] px-8 py-4 bg-defaultwhite border-b border-1-tokens-color-modes-common-neutral-lower">
      <div className="inline-flex items-center gap-4 relative flex-[0_0_auto] ml-[-7.00px]">
        <div className="flex w-[641px] gap-4 items-center relative">
          <div className="flex w-[400px] items-center justify-between relative bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)] border border-solid border-[color:var(--1-tokens-color-modes-input-primary-default-border)]">
            <Input
              className="border-none shadow-none focus-visible:ring-0 font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)]"
              placeholder={t("clientHeader.search.placeholder")}
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
              {t("clientHeader.account.title")}
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
                  {t("clientHeader.cart")}
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
  );
};
