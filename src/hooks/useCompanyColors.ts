import { useAppSelector } from "../store/store";

interface CompanyColors {
  primaryColor: string;
  primaryTextColor: string;
  primaryHoverColor: string;
  primaryLightColor: string;
}

export const useCompanyColors = (): CompanyColors => {
  const { companyColor, companyTextColor } = useAppSelector((state) => state.auth);
  
  const primaryColor = companyColor || "#00b85b";
  const primaryTextColor = companyTextColor || "#ffffff";
  
  // Create a lighter version of the primary color for hover states
  const primaryHoverColor = `${primaryColor}`;
  const primaryLightColor = `${primaryColor}10`; // 10% opacity version for subtle backgrounds
  
  return {
    primaryColor,
    primaryTextColor,
    primaryHoverColor,
    primaryLightColor,
  };
}; 