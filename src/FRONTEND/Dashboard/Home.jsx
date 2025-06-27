import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArticleIcon from "@mui/icons-material/Article";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import BarChartIcon from "@mui/icons-material/BarChart";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import DirectionsTransitFilledIcon from "@mui/icons-material/DirectionsTransitFilled";
import ElectricScooterIcon from "@mui/icons-material/ElectricScooter";
import EmailIcon from "@mui/icons-material/Email";
import GavelIcon from "@mui/icons-material/Gavel";
import HouseIcon from "@mui/icons-material/House";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import InboxIcon from "@mui/icons-material/Inbox";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ScubaDivingIcon from "@mui/icons-material/ScubaDiving";
import SellIcon from "@mui/icons-material/Sell";
import SendIcon from "@mui/icons-material/Send";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider } from "@toolpad/core/internal";
import PropTypes from "prop-types";
import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "my-app",
    title: "Dashboard",
    icon: <DashboardIcon sx={{ color: "primary.main" }} />,
  },
  {
    title: "Abstract",
    icon: <ArticleIcon sx={{ color: "text.secondary" }} />,
    children: [
      {
        segment: "Real-Property-Tax",
        title: "Real Property Tax",
        icon: <HouseIcon sx={{ color: "primary.main" }} />,
      },
      {
        segment: "General-Fund",
        title: "General Fund",
        icon: <AccountBalanceWalletIcon sx={{ color: "success.main" }} />,
      },
      {
        segment: "Trust-Fund",
        title: "Trust Fund",
        icon: <GavelIcon sx={{ color: "success.main" }} />,
      },
      {
        segment: "community-tax-certificate",
        title: "Community Tax Certificate",
        icon: <AssignmentIndIcon sx={{ color: "warning.main" }} />,
      },
      {
        segment: "other-income-receipts",
        title: "Other Income Receipts",
        icon: <ReceiptLongIcon sx={{ color: "info.main" }} />,
      },
    ],
  },
  {
    title: "Business",
    icon: <BusinessIcon sx={{ color: "text.secondary" }} />,
    children: [
      {
        segment: "business-registration",
        title: "Business Registration",
        icon: <HowToRegIcon sx={{ color: "primary.main" }} />,
      },
      {
        segment: "mch",
        title: "MCH FRANCHISE",
        icon: <DirectionsTransitFilledIcon sx={{ color: "warning.main" }} />,
      },
      {
        segment: "e-bike-trisikad",
        title: "E_BIKE-TRISIKAD",
        icon: <ElectricScooterIcon sx={{ color: "info.main" }} />,
      },
    ],
  },
  {
    title: "Ticket",
    icon: <BookOnlineIcon sx={{ color: "text.secondary" }} />,
    children: [
      {
        segment: "dive-ticket",
        title: "DIVING TICKET",
        icon: <ScubaDivingIcon sx={{ color: "info.dark" }} />,
      },
      {
        segment: "cash-ticket",
        title: "CASH TICKET",
        icon: <SellIcon sx={{ color: "secondary.main" }} />,
      },
    ],
  },
  {
    segment: "calendar",
    title: "CALENDAR",
    icon: <CalendarMonthIcon sx={{ color: "primary.main" }} />,
  },
  {
    segment: "import",
    title: "Import",
    icon: <ImportExportIcon sx={{ color: "info.main" }} />,
    children: [
      {
        segment: "import-general-fund",
        title: "General Fund",
        icon: <DescriptionIcon sx={{ color: "secondary.main" }} />,
      },
      {
        segment: "import-trust-fund",
        title: "Trust Fund",
        icon: <DescriptionIcon sx={{ color: "secondary.main" }} />,
      },
      {
        segment: "import-real-property-tax",
        title: "Real Property Tax",
        icon: <DescriptionIcon sx={{ color: "secondary.main" }} />,
      },
      {
        segment: "import-cedula",
        title: "Cedula",
        icon: <DescriptionIcon sx={{ color: "secondary.main" }} />,
      },
    ],
  },
  {
    segment: "doc-stamp",
    title: "DOC STAMP",
    icon: <AssignmentIcon sx={{ color: "primary.main" }} />,
  },
  {
    segment: "water",
    title: "WATER",
    icon: <WaterDropIcon sx={{ color: "info.main" }} />,
  },
  {
    segment: "email",
    title: "E-MAIL",
    icon: <EmailIcon sx={{ color: "error.main" }} />,
    children: [
      {
        segment: "email-inbox",
        title: "Inbox",
        icon: <InboxIcon sx={{ color: "primary.main" }} />,
      },
      {
        segment: "email-sent",
        title: "Sent",
        icon: <SendIcon sx={{ color: "success.main" }} />,
      },
    ],
  },
  {
    segment: "income-target",
    title: "Income Target",
    icon: <TrendingUpIcon sx={{ color: "success.dark" }} />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    title: "Reports",
    icon: <BarChartIcon sx={{ color: "primary.main" }} />,
    children: [
      {
        segment: "business-card",
        title: "Business Card",
        icon: <DescriptionIcon sx={{ color: "text.secondary" }} />,
      },
      {
        segment: "rpt-card",
        title: "RPT Card",
        icon: <DescriptionIcon sx={{ color: "text.secondary" }} />,
      },
      {
        segment: "full-report",
        title: "Full Report",
        icon: <DescriptionIcon sx={{ color: "text.secondary" }} />,
      },
      {
        segment: "rcd",
        title: "RCD",
        icon: <DescriptionIcon sx={{ color: "text.secondary" }} />,
      },
      {
        segment: "esre",
        title: "ESRE",
        icon: <DescriptionIcon sx={{ color: "text.secondary" }} />,
      },
      {
        segment: "collection",
        title: "Summary of Collection Report",
        icon: <DescriptionIcon sx={{ color: "text.secondary" }} />,
      },
    ],
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  const breadcrumbItems = pathname.split("/").filter(Boolean);
  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="#">
            Home
          </Link>
          {breadcrumbItems.map((item, index) => (
            <Link
              key={item}
              color={
                breadcrumbItems[breadcrumbItems.length - 1] === item
                  ? "text.primary"
                  : "inherit"
              }
              href={`/${breadcrumbItems.slice(0, index + 1).join("/")}`}
              aria-current={
                breadcrumbItems[breadcrumbItems.length - 1] === item
                  ? "page"
                  : undefined
              }
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </Breadcrumbs>
      </Box>

      <Box sx={{ textAlign: "center", flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBranding(props) {
  const { window } = props;

  const location = useLocation();
  const navigate = useNavigate();
  const pathname = `/my-app${location.pathname.startsWith("/my-app") ? location.pathname.slice(7) : location.pathname}`;

  const router = React.useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path) => {
        const fullPath = path.startsWith("/my-app") ? path : `/my-app${path}`;
        console.log(`Navigating to: ${fullPath}`);
        navigate(fullPath);
      },
    }),
    [pathname, navigate, location.search]
  );

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // Remove this provider when copying and pasting into your project.
    <DemoProvider window={demoWindow}>
      {/* preview-start */}
      <AppProvider
        navigation={NAVIGATION}
        branding={{
          logo: <img src="/assets/images/ZAMBO_LOGO_P.png" alt="LGU logo" />,
          title: "ETMS",
          // homeUrl: "/toolpad/core/introduction",
        }}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout>
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
      {/* preview-end */}
    </DemoProvider>
  );
}

DashboardLayoutBranding.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default DashboardLayoutBranding;
