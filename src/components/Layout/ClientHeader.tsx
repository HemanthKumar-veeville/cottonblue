import { BellIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect } from "react";
import {
  fetchAllStores,
  setSelectedStore,
} from "../../store/features/agencySlice";
import { getHost } from "../../utils/hostUtils";

interface Store {
  id: string;
  name: string;
}

interface UserStore {
  store_id: string;
  store_name: string;
}

export const ClientHeader = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const cart = useAppSelector((state) => state.cart);
  const items = cart?.items || [];
  const userName = user?.user_name;
  const isAdmin = user?.user_role === "admin";
  const storeIds = user?.store_details || [];
  const { stores, selectedStore } = useAppSelector((state) => state.agency);
  const storeList = stores?.stores;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const dns = getHost();

  // Get the current store name for display
  const getCurrentStoreName = () => {
    if (!selectedStore) return "";

    if (isAdmin) {
      return (
        storeList?.find((store: Store) => store.id === selectedStore)?.name ||
        ""
      );
    }

    return (
      storeIds.find((store: UserStore) => store.store_id === selectedStore)
        ?.store_name || ""
    );
  };

  // Calculate total items in cart

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (dns && isAdmin) {
      dispatch(fetchAllStores(dns));
    }
  }, [dispatch, dns, isAdmin]);

  // Set initial selected store
  useEffect(() => {
    if (!selectedStore) {
      const initialStore =
        storeIds.length > 0
          ? storeIds[0].store_id
          : isAdmin && storeList?.length > 0
          ? storeList[0].id
          : null;
      if (initialStore) {
        dispatch(setSelectedStore(initialStore));
      }
    }
  }, [dispatch, storeIds, isAdmin, selectedStore, storeList]);

  const handleStoreChange = (value: string) => {
    dispatch(setSelectedStore(value));
  };

  return (
    <div className="flex w-full items-center justify-end gap-[182px] px-8 py-4 bg-defaultwhite border-b border-1-tokens-color-modes-common-neutral-lower">
      <div className="inline-flex items-center gap-4 relative flex-[0_0_auto] ml-[-7.00px]">
        <div className="flex w-[641px] gap-4 items-center relative">
          <Select
            value={selectedStore || "all"}
            onValueChange={handleStoreChange}
          >
            <SelectTrigger className="w-[400px] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)]">
              <SelectValue>{getCurrentStoreName()}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {isAdmin ? (
                <>
                  {storeList?.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </>
              ) : (
                <>
                  {storeIds.map((store) => (
                    <SelectItem key={store.store_id} value={store.store_id}>
                      {store.store_name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
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
              {userName}
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
          <div
            className="inline-flex justify-end gap-4 flex-[0_0_auto] items-center relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <div className="inline-flex h-12 items-center justify-center gap-4 px-2 py-4 relative flex-[0_0_auto]">
              <ShoppingCartIcon className="w-6 h-6 mt-[-4.00px] mb-[-4.00px]" />
              <div className="inline-flex items-center justify-center relative flex-[0_0_auto] mt-[-4.00px] mb-[-4.00px]">
                <div className="relative w-fit mt-[-1.00px] font-text-medium font-[number:var(--text-medium-font-weight)] text-1-tokens-color-modes-common-neutral-highter text-[length:var(--text-medium-font-size)] tracking-[var(--text-medium-letter-spacing)] leading-[var(--text-medium-line-height)] whitespace-nowrap [font-style:var(--text-medium-font-style)]">
                  {t("clientHeader.cart")}
                </div>
              </div>
              {cartItemCount > 0 && (
                <Badge className="absolute top-2 left-6 bg-defaultalert rounded-xl">
                  {cartItemCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
