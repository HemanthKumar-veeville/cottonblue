import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react";

const agencyDetails = {
  id: "1021",
  name: "Chronodrive",
  city: "Lyon",
  category: "Agence",
  registrationDate: "22/03/2025",
  email: "jean.morel@chronodrive.com",
  status: "Actif",
  statistics: {
    totalOrders: "342",
    monthlyRevenue: "8 500 €",
    topProducts: "T-shirt blanc, Mug Chrono",
  },
};

const orders = [
  {
    id: "KCJRTAEIJ",
    date: "15/02/2024",
    price: "499.90€",
    status: { text: "Livréee", type: "success" },
    hasInvoice: true,
  },
  {
    id: "KCJRTAEIJ",
    date: "22/03/2025",
    price: "149.90€",
    status: { text: "En cours", type: "warning" },
    hasInvoice: true,
  },
  {
    id: "KCJRTAEIJ",
    date: "30/04/2024",
    price: "499.90€",
    status: { text: "Annulée", type: "danger" },
    hasInvoice: false,
  },
];

const AgencyDetailsCard = () => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
        Détail de l&#39;agence - Chronodrive Lyon
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-start gap-8">
        <div className="flex flex-col items-start gap-8 flex-1">
          <div className="flex flex-col gap-4">
            {["ID", "Nom", "Ville", "Catégorie"].map((label, index) => (
              <div key={index} className="font-text-medium text-black">
                <span className="font-[number:var(--text-medium-font-weight)]">
                  {label} :{" "}
                </span>
                <span>{agencyDetails[label.toLowerCase()]}</span>
              </div>
            ))}
          </div>
          <StatisticsBox />
        </div>
        <div className="flex flex-col items-start gap-8 flex-1">
          <div className="flex flex-col gap-4 h-36">
            {["Date d'inscription", "Email gestion", "Statut"].map(
              (label, index) => (
                <div key={index} className="font-text-medium text-black">
                  <span className="font-[number:var(--text-medium-font-weight)]">
                    {label} :{" "}
                  </span>
                  <span
                    className={label === "Statut" ? "text-emerald-500" : ""}
                  >
                    {agencyDetails[label.toLowerCase().replace("'", "")]}
                  </span>
                </div>
              )
            )}
          </div>
          <ActionsBox />
        </div>
      </div>
    </CardContent>
  </Card>
);

const StatisticsBox = () => (
  <Card className="w-full bg-[color:var(--1-tokens-color-modes-background-secondary)] border-[color:var(--1-tokens-color-modes-border-primary)]">
    <CardContent className="p-4 space-y-2">
      <h3 className="font-text-medium text-black">Statistiques</h3>
      <div className="font-text-medium text-black space-y-1">
        {Object.entries(agencyDetails.statistics).map(([key, value], index) => (
          <p key={index}>
            <span>{key.replace(/([A-Z])/g, " $1").trim()} : </span>
            <span>{value}</span>
          </p>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ActionsBox = () => (
  <Card className="w-full bg-[color:var(--1-tokens-color-modes-background-secondary)] border-[color:var(--1-tokens-color-modes-border-primary)]">
    <CardContent className="p-4 space-y-4">
      <h3 className="font-text-medium text-black">Actions</h3>
      {["Modifier l'agence", "Désactiver l'agence"].map((action, index) => (
        <Button
          key={index}
          className={`w-full ${
            index === 0
              ? "bg-[#07515f]"
              : "bg-1-tokens-color-modes-common-danger-medium"
          } text-[color:var(--1-tokens-color-modes-button-primary-default-text)]`}
        >
          {action}
        </Button>
      ))}
    </CardContent>
  </Card>
);

const OrdersTableCard = () => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
        Commande de l&apos;agence
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
          <TableRow>
            <TableHead className="w-11">
              <Checkbox />
            </TableHead>
            {[
              "Commande",
              "Date",
              "Prix total",
              "Statut",
              "Facture",
              "Détails",
            ].map((header, index) => (
              <TableHead
                key={index}
                className="w-[145px] font-text-small text-[#1e2324]"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow
              key={index}
              className="border-b border-primary-neutal-300"
            >
              <TableCell className="w-11">
                <Checkbox />
              </TableCell>
              {["id", "date", "price"].map((field, idx) => (
                <TableCell
                  key={idx}
                  className="w-[145px] font-normal text-black text-[15px]"
                >
                  {order[field]}
                </TableCell>
              ))}
              <TableCell className="w-[145px]">
                <div className="flex items-center gap-2">
                  {order.status.type === "success" && (
                    <CheckCircle className="w-6 h-6 text-1-tokens-color-modes-common-success-medium" />
                  )}
                  {order.status.type === "warning" && (
                    <Clock className="w-6 h-6 text-1-tokens-color-modes-common-warning-medium" />
                  )}
                  {order.status.type === "danger" && (
                    <XCircle className="w-6 h-6 text-1-tokens-color-modes-common-danger-medium" />
                  )}
                  <span
                    className={`text-1-tokens-color-modes-common-${order.status.type}-medium`}
                  >
                    {order.status.text}
                  </span>
                </div>
              </TableCell>
              <TableCell className="w-[69px] text-center">
                <FileText className="w-4 h-4 mx-auto" />
              </TableCell>
              <TableCell className="w-[145px] text-center">
                <Button
                  variant="link"
                  className="font-label-medium text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] underline"
                >
                  Détails
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const TableContainer = (): JSX.Element => {
  return (
    <div className="flex flex-col items-start gap-8 p-6">
      <AgencyDetailsCard />
      <OrdersTableCard />
    </div>
  );
};

export default TableContainer;
