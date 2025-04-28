import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { login, loginPage } from "../../store/features/authSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { getHost } from "../../utils/hostUtils";
const LogoSection = ({ companyLogo }: { companyLogo: string | null }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-end justify-center w-full">
      <img
        className="w-full h-[56.57px]"
        alt="Company Logo"
        src={companyLogo || "/img/chronodrive_logo.png"}
      />
      <div className="font-text-small text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)]">
        {t("clientLogin.poweredBy")}
      </div>
    </div>
  );
};

const GreetingSection = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-XS)]">
      <h1 className="font-heading-h1 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h1-font-size)] tracking-[var(--heading-h1-letter-spacing)] leading-[var(--heading-h1-line-height)] mt-[-1.00px]">
        {t("clientLogin.greeting")}
      </h1>
    </div>
  );
};

const InputSection = ({
  email,
  setEmail,
  password,
  setPassword,
}: {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("clientLogin.email")}
        className="flex items-center justify-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] w-full bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)] border border-solid border-[color:var(--1-tokens-color-modes-input-primary-default-border)] font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)]"
      />

      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t("clientLogin.password")}
        className="flex items-center justify-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] w-full bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)] border border-solid border-[color:var(--1-tokens-color-modes-input-primary-default-border)] font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)]"
      />
    </div>
  );
};

const ButtonSection = ({
  isLoading,
  onSubmit,
}: {
  isLoading: boolean;
  onSubmit: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-end justify-center w-full">
      <Button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] bg-[#00b85b] rounded-[var(--2-tokens-screen-modes-button-border-radius)] border border-solid border-[#1a8563] font-label-medium text-[color:var(--1-tokens-color-modes-button-primary-default-text)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)]"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader size="sm" className="mr-2" />
            {t("common.loading")}
          </div>
        ) : (
          t("clientLogin.login")
        )}
      </Button>
    </div>
  );
};

export default function ClientLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, company, companyLogo } = useAppSelector(
    (state) => state.auth
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dnsPrefix = getHost();

  useEffect(() => {
    dispatch(loginPage(dnsPrefix));
  }, [dispatch, dnsPrefix]);

  const handleSubmit = async () => {
    if (!dnsPrefix) return;

    try {
      await dispatch(login({ email, password, company: dnsPrefix })).unwrap();
      navigate("/");
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-[400px] bg-white rounded-[var(--2-tokens-screen-modes-button-border-radius)]">
        <CardContent className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-XL)] pt-[var(--2-tokens-screen-modes-common-spacing-XL)] pr-[var(--2-tokens-screen-modes-common-spacing-l)] pb-[var(--2-tokens-screen-modes-common-spacing-XL)] pl-[var(--2-tokens-screen-modes-common-spacing-l)]">
          <LogoSection companyLogo={companyLogo} />
          <div className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-2xl)] w-full">
            <GreetingSection />
            <InputSection
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
            {error && (
              <div className="text-red-500 text-sm w-full text-center">
                {error}
              </div>
            )}
            <ButtonSection isLoading={isLoading} onSubmit={handleSubmit} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
