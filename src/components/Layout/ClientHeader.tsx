import { BellIcon, SearchIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
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
import { Input } from "../ui/input";
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
    <div className="sticky top-0 z-50 flex w-full min-w-[320px] items-center justify-between px-4 md:px-6 lg:px-8 py-3 bg-defaultwhite border-b border-1-tokens-color-modes-common-neutral-lower shadow-sm backdrop-blur-sm bg-white/90">
      {/* Left section with search and store selector */}
      <div className="flex items-center gap-4 w-full max-w-[800px]">
        {/* Search Bar */}
        <div className="relative w-[60%] min-w-[180px]">
          <div className="relative">
            <Input
              type="text"
              placeholder={t("clientHeader.search.placeholder")}
              className="w-full h-11 pl-11 pr-4 rounded-md border-[color:var(--1-tokens-color-modes-input-primary-default-border)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] hover:border-gray-400 focus:border-gray-400 focus:ring-0 outline-none transition-all duration-200"
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
          </div>
        </div>

        {/* Store Selector */}
        <div className="w-[40%] min-w-[160px]">
          <Select
            value={selectedStore || "all"}
            onValueChange={handleStoreChange}
          >
            <SelectTrigger className="w-full h-11 px-4 rounded-md border-[color:var(--1-tokens-color-modes-input-primary-default-border)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] hover:border-gray-400 focus:border-gray-400 focus:ring-0 outline-none transition-all duration-200">
              <SelectValue>{getCurrentStoreName()}</SelectValue>
            </SelectTrigger>
            <SelectContent
              className="max-h-[300px] overflow-y-auto rounded-md bg-white shadow-lg border-0 outline-none ring-0 focus:ring-0"
              style={{ border: "none" }}
            >
              {isAdmin ? (
                <>
                  {storeList?.map((store) => (
                    <SelectItem
                      key={store.id}
                      value={store.id}
                      className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-150 focus:bg-transparent active:bg-gray-50 outline-none ring-0 focus:ring-0"
                    >
                      {store.name}
                    </SelectItem>
                  ))}
                </>
              ) : (
                <>
                  {storeIds.map((store) => (
                    <SelectItem
                      key={store.store_id}
                      value={store.store_id}
                      className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-150 focus:bg-transparent active:bg-gray-50 outline-none ring-0 focus:ring-0"
                    >
                      {store.store_name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right Section - User Profile, Notifications, Cart */}
      <div className="flex items-center gap-3 md:gap-4 ml-4">
        {/* User Profile */}
        <div className="relative">
          <div className="inline-flex justify-center items-center p-2.5 md:p-3 bg-[color:var(--1-tokens-color-modes-background-secondary)] rounded-md hover:bg-gray-100 active:bg-gray-200 transition-all duration-200">
            <div className="flex items-center gap-3">
              <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
              <div className="inline-flex flex-col items-start justify-center">
                <div className="text-xs text-gray-500 font-medium">
                  {t("clientHeader.account.title")}
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {userName}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <div className="relative p-2.5 md:p-3 hover:bg-gray-100 active:bg-gray-200 rounded-md transition-all duration-200">
            <BellIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            <Badge className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center bg-defaultalert text-white text-xs font-semibold rounded-full">
              9
            </Badge>
          </div>
        </div>

        {/* Cart */}
        <div className="relative">
          <div
            className="relative flex items-center gap-2 p-2.5 md:p-3 hover:bg-gray-100 active:bg-gray-200 rounded-md transition-all duration-200 cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCartIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            <span className="inline-block text-sm font-semibold text-gray-900 whitespace-nowrap">
              {t("clientHeader.cart")}
            </span>
            {cartItemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center bg-defaultalert text-white text-xs font-semibold rounded-full">
                {cartItemCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
