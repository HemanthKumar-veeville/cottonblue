import { Button } from "../../components/ui/button";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { getUserDetails, modifyUser } from "../../store/features/userSlice";
import { Skeleton } from "../../components/ui/skeleton";
import { fetchAllStores } from "../../store/features/agencySlice";
import { useAppSelector } from "../../store/store";
import { getHost } from "../../utils/hostUtils";
import { useCompanyColors } from "../../hooks/useCompanyColors";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  company_id: number;
  created_at: string;
  is_active: boolean;
  latitude: number | null;
  longitude: number | null;
  phone_number: string;
  postal_code: number;
  region: string;
  updated_at: string;
}

const UserDetailsSection = ({
  user,
  stores,
}: {
  user: any;
  stores: Store[];
}) => {
  const { t } = useTranslation();

  const storeNames =
    user?.store_ids
      ?.map((storeId: number) => {
        const store = stores?.find((s) => s.id === storeId);
        return store?.name || `Store ${storeId}`;
      })
      .join(", ") || t("common.notAvailable");

  const leftColumnDetails = [
    {
      label: t("userDetails.fields.id"),
      value: user?.user_id || t("common.notAvailable"),
    },
    {
      label: t("userDetails.fields.firstName"),
      value: user?.firstname || t("common.notAvailable"),
    },
    {
      label: t("userDetails.fields.lastName"),
      value: user?.lastname || t("common.notAvailable"),
    },
    {
      label: t("userDetails.fields.email"),
      value: user?.email || t("common.notAvailable"),
    },
    {
      label: t("userDetails.fields.stores"),
      value: storeNames,
    },
  ];

  const rightColumnDetails = [
    {
      label: t("userDetails.fields.role"),
      value: user?.role || t("common.notAvailable"),
    },
    {
      label: t("userDetails.fields.status"),
      value: user?.is_active
        ? t("userDetails.status.active")
        : t("userDetails.status.inactive"),
    },
  ];

  return (
    <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
      <header className="flex items-center justify-between w-full">
        <h2 className="text-[length:var(--heading-h3-font-size)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[#1e2324] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)]">
          {t("userDetails.title")} - {user.firstname} {user.lastname}
        </h2>
      </header>

      <div className="flex flex-col md:flex-row gap-8 w-full bg-white p-6 rounded-[var(--2-tokens-screen-modes-common-spacing-XS)]">
        <div className="flex-1 space-y-4">
          {leftColumnDetails.map((detail) => (
            <div key={detail.label} className="space-y-1">
              <span className="text-sm text-[#6b7280]">{detail.label}</span>
              <p className="font-medium text-[#1e2324]">{detail.value}</p>
            </div>
          ))}
        </div>
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            {rightColumnDetails.map((detail) => (
              <div key={detail.label} className="space-y-1">
                <span className="text-sm text-[#6b7280]">{detail.label}</span>
                <p
                  className={`font-medium ${
                    detail.label === t("userDetails.fields.status")
                      ? detail.value === t("userDetails.status.active")
                        ? "text-[#00b85b]"
                        : "text-[#ef4444]"
                      : "text-[#1e2324]"
                  }`}
                >
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
          <ActionsSection />
        </div>
      </div>
    </section>
  );
};

const ActionsSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const { selectedUser } = useAppSelector((state) => state.user);
  const isActive = selectedUser?.user?.is_active;
  const host = getHost();
  const dns = selectedCompany?.dns || host;
  const { buttonStyles } = useCompanyColors();
  const { t } = useTranslation();

  const handleEdit = () => {
    navigate(`/users/edit/${id}`);
  };

  const handleToggleActivation = async () => {
    try {
      if (id && dns) {
        await dispatch(
          modifyUser({
            dnsPrefix: dns,
            userId: id,
            data: {
              is_active: !isActive,
            },
          })
        ).unwrap();

        await dispatch(
          getUserDetails({
            dnsPrefix: dns,
            userId: id,
          })
        ).unwrap();
      }
    } catch (error: any) {
      console.error("Failed to toggle user activation:", error);
    }
  };

  return (
    <div
      style={buttonStyles}
      className="bg-[var(--primary-light-color)] p-4 rounded-[var(--2-tokens-screen-modes-common-spacing-XS)]"
    >
      <h3 className="text-sm font-medium text-[#1e2324] mb-4">
        {t("userDetails.actions.title")}
      </h3>
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Button
          className="flex-1 bg-[#00b85b] hover:bg-[#00a050] text-white transition-colors"
          onClick={handleEdit}
        >
          {t("userDetails.actions.modify")}
        </Button>
        <Button
          className={`flex-1 ${
            isActive
              ? "bg-[#ef4444] hover:bg-[#dc2626]"
              : "bg-[#00b85b] hover:bg-[#00a050]"
          } text-white transition-colors`}
          onClick={handleToggleActivation}
        >
          {isActive
            ? t("userDetails.actions.deactivate")
            : t("userDetails.actions.activate")}
        </Button>
      </div>
    </div>
  );
};

const UserDetailsSkeleton = () => (
  <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
    <header className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-48" />
      </div>
    </header>

    <div className="flex flex-col md:flex-row gap-8 w-full bg-white p-6 rounded-[var(--2-tokens-screen-modes-common-spacing-XS)]">
      <div className="flex-1 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-3/4" />
      </div>
      <div className="flex-1 space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-6 w-2/3" />
        <div className="pt-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      </div>
    </div>
  </section>
);

function ClientUserDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const { id } = useParams<{ id: string }>();
  const { selectedUser, isLoading, error } = useAppSelector(
    (state) => state.user
  );
  const { stores } = useAppSelector((state) => state.agency);
  const user = selectedUser?.user;
  const storeList = stores?.stores || [];
  const host = getHost();
  const dns = selectedCompany?.dns || host;
  const { t } = useTranslation();

  useEffect(() => {
    if (id && dns) {
      dispatch(getUserDetails({ dnsPrefix: dns, userId: id }));
      dispatch(fetchAllStores(dns));
    }
  }, [dispatch, id, dns]);

  return (
    <main className="flex flex-col w-full max-w-[1208px] mx-auto gap-8 px-4 py-6 md:px-6 lg:px-8 bg-[#f9fafb]">
      <Button
        variant="ghost"
        className="flex items-center gap-2 mb-4 text-[#07515f] hover:text-[#064a56] w-fit"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t("common.back")}</span>
      </Button>
      {isLoading ? (
        <UserDetailsSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
          <div className="bg-[#fef2f2] text-[#ef4444] rounded-[var(--2-tokens-screen-modes-common-spacing-XS)] p-6 max-w-md text-center">
            <h3 className="font-bold text-lg mb-2">{t("userDetails.error")}</h3>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#ef4444] text-white rounded-md hover:bg-[#dc2626] transition-colors"
            >
              {t("errorState.retry")}
            </button>
          </div>
        </div>
      ) : !user ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
          <div className="bg-[#eaf8e7] rounded-[var(--2-tokens-screen-modes-common-spacing-XS)] p-6 max-w-md text-center">
            <h3 className="font-bold text-lg mb-2 text-[#1e2324]">
              {t("userDetails.notFound")}
            </h3>
            <p className="text-sm text-[#6b7280]">
              {t("userList.emptyMessage")}
            </p>
          </div>
        </div>
      ) : (
        <UserDetailsSection user={user} stores={storeList} />
      )}
    </main>
  );
}

export default ClientUserDetails;
