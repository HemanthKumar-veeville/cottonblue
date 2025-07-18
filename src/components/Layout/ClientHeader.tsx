import {
  BellIcon,
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
  Globe,
  ClipboardListIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { useEffect, useState, useRef } from "react";
import {
  fetchAllStores,
  setSelectedStore,
} from "../../store/features/agencySlice";
import { getHost } from "../../utils/hostUtils";
import { setSearchTerm } from "../../store/features/productSlice";
import { getOrdersForApproval } from "../../store/features/cartSlice";
import { Card } from "../ui/card";

interface Store {
  id: string;
  name: string;
}

interface UserStore {
  store_id: string;
  store_name: string;
}

interface LanguageOption {
  value: string;
  label: string;
}

export const ClientHeader = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const cart = useAppSelector((state) => state.cart);
  const { ordersForApproval } = useAppSelector((state) => state.cart);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const items = cart?.items || [];
  const userName = user?.user_name;
  const isAdmin = user?.super_admin || user?.company_admin;
  const storeIds = user?.store_details || [];
  const { stores, selectedStore } = useAppSelector((state) => state.agency);
  const storeList = stores?.stores;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const dns = getHost();

  const languages: LanguageOption[] = [
    {
      value: "en",
      label: t("language.en"),
    },
    {
      value: "fr",
      label: t("language.fr"),
    },
  ];

  const getCurrentLanguage = () => {
    return (
      languages.find((lang) => lang.value === i18n.language) || languages[0]
    );
  };

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
  const cartTotalAmount = cart.total;

  useEffect(() => {
    if (dns && isAdmin) {
      dispatch(fetchAllStores(dns));
      dispatch(getOrdersForApproval({ dns_prefix: dns }));
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

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  const pathname = useLocation().pathname;

  // Add debounce function
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Handle search input change with debounce
  const handleSearchChange = debounce((value: string) => {
    dispatch(setSearchTerm(value));
  }, 300);

  const adminPaths = ["/admin-dashboard", "/users", "/users/add"];

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = () => {
    navigate("/admin-dashboard");
    setShowNotifications(false);
  };

  return (
    <div className="sticky top-0 z-50 flex w-full min-w-[320px] items-center justify-between px-4 md:px-6 lg:px-8 py-3 bg-defaultwhite border-b border-1-tokens-color-modes-common-neutral-lower shadow-sm backdrop-blur-sm bg-white/90">
      {/* Left section with search and store selector */}
      <div className="flex items-center gap-4 w-full max-w-[800px]">
        {/* Search Bar */}
        <div className="relative w-[35%] min-w-[140px]">
          <div className="relative">
            <Input
              type="text"
              placeholder={t("clientHeader.search.placeholder")}
              className="w-full h-11 pl-11 pr-4 rounded-md border-[color:var(--1-tokens-color-modes-input-primary-default-border)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] hover:border-gray-400 focus:border-gray-400 focus:ring-0 outline-none transition-all duration-200"
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
          </div>
        </div>

        {/* Store Selector */}
        {!adminPaths.includes(pathname) && (
          <div className="w-[35%] min-w-[140px]">
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
        )}
      </div>

      {/* Right Section - Language, User Profile, Notifications, Cart */}
      <div className="flex items-center gap-3 md:gap-4 ml-4">
        {/* Language Selector */}
        <div className="relative">
          <Select value={i18n.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-11 min-w-[100px] px-3 rounded-md border-[color:var(--1-tokens-color-modes-input-primary-default-border)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] hover:border-gray-400 focus:border-gray-400 focus:ring-0 outline-none transition-all duration-200">
              <span className="text-sm font-medium">
                {getCurrentLanguage().label}
              </span>
            </SelectTrigger>
            <SelectContent className="min-w-[100px] overflow-y-auto rounded-md bg-white shadow-lg border border-gray-100 outline-none ring-0 focus:ring-0 animate-in fade-in-0 zoom-in-95">
              {languages.map((language) => (
                <SelectItem
                  key={language.value}
                  value={language.value}
                  className="px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-150 focus:bg-transparent active:bg-gray-50 outline-none ring-0 focus:ring-0"
                >
                  <span className="text-sm font-medium">{language.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* User Profile */}
        <div className="relative">
          <div className="inline-flex justify-center items-center p-2.5 md:p-3 bg-[color:var(--1-tokens-color-modes-background-secondary)] rounded-md hover:bg-gray-100 active:bg-gray-200 transition-all duration-200">
            <div className="flex items-center gap-3 whitespace-nowrap">
              <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-700 flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                {userName}
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <div
            className="relative p-2.5 md:p-3 hover:bg-gray-100 active:bg-gray-200 rounded-md transition-all duration-200 cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <BellIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            {isAdmin && ordersForApproval?.length > 0 && (
              <Badge className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center bg-defaultalert text-white text-xs font-semibold rounded-full">
                {ordersForApproval.length}
              </Badge>
            )}
          </div>

          {showNotifications && (
            <Card className="absolute right-0 top-[calc(100%+0.5rem)] w-[320px] shadow-lg border bg-gray-50 border-gray-200 rounded-lg overflow-hidden z-[60]">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("notifications.title")}
                </h3>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {isAdmin && ordersForApproval?.length > 0 ? (
                  <div
                    className="p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-200"
                    onClick={handleNotificationClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                        <ClipboardListIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {t("notifications.ordersToValidate", {
                            count: ordersForApproval.length,
                          })}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {t("notifications.clickToView")}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    {t("notifications.noNotifications")}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Cart */}
        <div className="relative">
          <div
            className="relative flex items-center gap-2 p-2.5 md:p-3 hover:bg-gray-100 active:bg-gray-200 rounded-md transition-all duration-200 cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCartIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            <span className="inline-block text-sm font-semibold text-gray-900 whitespace-nowrap">
              {cartTotalAmount > 0
                ? `${cartTotalAmount.toFixed(2)}€`
                : t("clientHeader.cart")}
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
