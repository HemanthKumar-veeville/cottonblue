import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { UserIcon } from "lucide-react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { getUserDetails, modifyUser } from "../../store/features/userSlice";
import { Skeleton } from "../../components/Skeleton";
import { fetchAllStores } from "../../store/features/agencySlice";
import { useAppSelector } from "../../store/store";

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

const UserDetailsCard = ({ user, stores }: { user: any; stores: Store[] }) => {
  const leftColumnDetails = [
    {
      label: "ID",
      value: user?.user_id || "Not Available",
    },
    {
      label: "First Name",
      value: user?.firstname || "Not Available",
    },
    {
      label: "Last Name",
      value: user?.lastname || "Not Available",
    },
    {
      label: "Email",
      value: user?.email || "Not Available",
    },
  ];

  const storeNames =
    user?.store_ids
      ?.map((storeId: number) => {
        const store = stores?.find((s) => s.id === storeId);
        return store?.name || `Store ${storeId}`;
      })
      .join(", ") || "Not Available";

  const rightColumnDetails = [
    {
      label: "Role",
      value: user?.role || "Not Available",
    },
    {
      label: "Stores",
      value: storeNames,
    },
    {
      label: "Status",
      value: user?.is_active ? "Active" : "Inactive",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
          User Details - {user.firstname} {user.lastname}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-8">
          <div className="flex flex-col items-start gap-8 flex-1">
            <div className="flex flex-col gap-4">
              {leftColumnDetails.map((detail) => (
                <div key={detail.label} className="font-text-medium text-black">
                  <span className="font-[number:var(--text-medium-font-weight)]">
                    {detail.label}:{" "}
                  </span>
                  <span>{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-8 flex-1">
            <div className="flex flex-col gap-4 h-36">
              {rightColumnDetails.map((detail) => (
                <div key={detail.label} className="font-text-medium text-black">
                  <span className="font-[number:var(--text-medium-font-weight)]">
                    {detail.label}:{" "}
                  </span>
                  <span
                    className={
                      detail.label === "Status" ? "text-emerald-500" : ""
                    }
                  >
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
            <ActionsBox />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ActionsBox = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const { selectedUser } = useAppSelector((state) => state.user);
  const isActive = selectedUser?.user?.is_active;

  const handleEdit = () => {
    navigate(`/users/edit/${id}`);
  };

  const handleToggleActivation = async () => {
    try {
      if (id && selectedCompany?.dns) {
        await dispatch(
          modifyUser({
            dnsPrefix: selectedCompany.dns,
            userId: id,
            data: {
              is_active: !isActive,
            },
          })
        ).unwrap();

        // Refresh user details after status change
        await dispatch(
          getUserDetails({
            dnsPrefix: selectedCompany.dns,
            userId: id,
          })
        ).unwrap();
      }
    } catch (error: any) {
      console.error("Failed to toggle user activation:", error);
      // You might want to show an error toast/notification here
    }
  };

  return (
    <Card className="w-full bg-[color:var(--1-tokens-color-modes-background-secondary)] border-[color:var(--1-tokens-color-modes-border-primary)]">
      <CardContent className="p-4 space-y-4">
        <h3 className="font-text-medium text-black">Actions</h3>
        <Button
          className="w-full bg-[#07515f] text-[color:var(--1-tokens-color-modes-button-primary-default-text)]"
          onClick={handleEdit}
        >
          Modify
        </Button>
        <Button
          className={`w-full ${
            isActive
              ? "bg-1-tokens-color-modes-common-danger-medium"
              : "bg-emerald-600"
          } text-[color:var(--1-tokens-color-modes-button-primary-default-text)]`}
          onClick={handleToggleActivation}
        >
          {isActive ? "Deactivate" : "Activate"}
        </Button>
      </CardContent>
    </Card>
  );
};

function UserDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const { id } = useParams<{ id: string }>();
  const { selectedUser, isLoading, error } = useAppSelector(
    (state) => state.user
  );
  const { stores } = useAppSelector((state) => state.agency);
  const user = selectedUser?.user;
  const storeList = stores?.stores || [];

  useEffect(() => {
    if (id && selectedCompany?.dns) {
      dispatch(getUserDetails({ dnsPrefix: selectedCompany.dns, userId: id }));
      dispatch(fetchAllStores(selectedCompany.dns));
    }
  }, [dispatch, id, selectedCompany?.dns]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-start gap-8 p-6">
        <Skeleton variant="details" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-start gap-8 p-6">
        <Card className="w-full">
          <CardContent>
            <div className="text-center py-4 text-red-600">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-start gap-8 p-6">
        <Card className="w-full">
          <CardContent>
            <div className="text-center py-4">User not found</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-8 p-6">
      <UserDetailsCard user={user} stores={storeList} />
    </div>
  );
}

export default UserDetails;
