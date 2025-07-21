import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  ChevronRightIcon,
  EuroIcon,
  PackageIcon,
  SearchIcon,
  ShoppingCartIcon,
  ClipboardList,
} from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BudgetData } from "./ClientAdminDashboard";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/EmptyState";
import { formatCurrency } from "../../lib/utils";
import { setSelectedStore } from "../../store/features/agencySlice";
import { useAppDispatch } from "../../store/store";

export const BudgetSectionSkeleton = () => (
  <div className="flex gap-6 w-full animate-pulse">
    <div className="flex flex-col gap-6 flex-1">
      {/* Budget Overview Card */}
      <Card className="shadow">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4">
            <div className="h-7 w-32 bg-gray-200 rounded" />
            <div className="flex gap-2">
              {/* Expenses Card */}
              <Card className="flex-1">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="h-6 w-24 bg-gray-200 rounded" />
                    <div className="h-8 w-36 bg-gray-200 rounded" />
                  </div>
                </CardContent>
              </Card>
              {/* Orders Card */}
              <Card className="flex-1">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="h-6 w-24 bg-gray-200 rounded" />
                    <div className="h-8 w-36 bg-gray-200 rounded" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards */}
      {[1, 2, 3].map((index) => (
        <Card key={index} className="shadow-1dp-ambient">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded" />
              <div className="h-7 w-32 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-36 bg-gray-200 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Orders to Validate Card */}
    <Card className="flex-1 shadow-1dp-ambient">
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="h-7 w-48 bg-gray-200 rounded" />
        </div>
        <div className="relative">
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="h-20 bg-gray-200 rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

interface Order {
  id: string;
  location: string;
}

interface BudgetSectionProps {
  budgetData: BudgetData;
  orderList: Order[];
  dashboardLoading: boolean;
}

const BudgetMetricCard = ({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
}) => (
  <Card className="shadow-1dp-ambient">
    <CardContent className="p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Icon className="w-6 h-6" />
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-2xl font-bold text-[#023337]">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const OrderItem = ({
  order,
  onClick,
}: {
  order: Order;
  onClick?: () => void;
}) => (
  <div
    className="flex items-center justify-between p-3 border border-solid border-[color:var(--1-tokens-color-modes-border-primary)] rounded-sm cursor-pointer hover:bg-gray-50"
    onClick={onClick}
  >
    <div className="flex-1 bg-white rounded-sm p-2">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-[#023337]">Commande n°{order.id}</p>
        <p className="text-sm text-gray-600">{order.location}</p>
      </div>
    </div>
    <div className="p-2.5">
      <ChevronRightIcon className="w-6 h-6" />
    </div>
  </div>
);

export function BudgetSection({
  budgetData,
  orderList,
  dashboardLoading,
}: BudgetSectionProps): JSX.Element {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  if (dashboardLoading) {
    return <BudgetSectionSkeleton />;
  }

  // Filter orders based on search query
  const filteredOrders = orderList?.filter(
    (order) =>
      order?.id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.location
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleOrderClick = (order: Order) => {
    dispatch(setSelectedStore(order.store_id));
    navigate(`/validate-order/${order.store_id}/${order.id}`);
  };

  return (
    <div className="flex gap-6 w-full">
      <div className="flex flex-col gap-6 flex-1">
        <Card className="shadow">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold">
                  {t("sidebar.budget.title")}
                </h2>
              </div>
              <div className="flex gap-2">
                <Card className="flex-1 border border-solid border-1-tokens-color-modes-border-secondary">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-base">
                        {t("sidebar.budget.expenses")}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">
                          <span className="text-emerald-500">
                            {formatCurrency(budgetData.expenses.current)}/
                          </span>
                          <span className="text-lg">
                            {formatCurrency(budgetData.expenses.total)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="flex-1 border border-solid border-1-tokens-color-modes-border-secondary">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-base">
                        {t("sidebar.budget.orders")}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">
                          <span className="text-red-500">
                            {budgetData?.orders?.current}/
                          </span>
                          <span className="text-lg">
                            {budgetData?.orders?.total}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
        <BudgetMetricCard
          icon={EuroIcon}
          title={t("sidebar.budget.expenses")}
          value={formatCurrency(budgetData?.metrics?.totalExpenses ?? 0)}
        />
        <BudgetMetricCard
          icon={PackageIcon}
          title={t("sidebar.budget.orders")}
          value={budgetData?.metrics?.totalOrders?.toString() ?? "0"}
        />
        <BudgetMetricCard
          icon={ShoppingCartIcon}
          title={t("sidebar.budget.averageCart")}
          value={formatCurrency(budgetData?.metrics?.averageCart ?? 0)}
        />
      </div>
      <Card className="flex-1 shadow-1dp-ambient">
        <CardContent className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <PackageIcon className="w-4 h-4" />
            <h3 className="text-lg font-bold">
              {t("sidebar.budget.ordersToValidate")}
            </h3>
          </div>
          <div className="relative">
            <Input
              className="pr-10 border border-solid rounded-md"
              placeholder={t("sidebar.budget.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <OrderItem
                  key={index}
                  order={order}
                  onClick={() => handleOrderClick(order)}
                />
              ))
            ) : (
              <EmptyState
                icon={ClipboardList}
                title={
                  searchQuery
                    ? t("sidebar.budget.noOrdersFoundSearch")
                    : t("sidebar.budget.noOrdersToValidate")
                }
                description={
                  searchQuery
                    ? t("sidebar.budget.tryDifferentSearch")
                    : t("sidebar.budget.ordersWillAppearHere")
                }
                className="py-12"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
