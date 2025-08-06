import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
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
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ScubaDivingIcon from "@mui/icons-material/ScubaDiving";
import SellIcon from "@mui/icons-material/Sell";
import SendIcon from "@mui/icons-material/Send";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { createTheme, styled } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider } from "@toolpad/core/internal";
import PropTypes from "prop-types";
import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TaxCollected from "./components/CHARTS/TaxCollected";
import "./system.css";

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
    segment: "water-works",
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
    segment: "register-user",
    title: "USER REGISTRATION",
    icon: <AppRegistrationIcon sx={{ color: "info.main" }} />,
  },

  {
    segment: "template",
    title: "TEMPLATE",
    icon: <AppRegistrationIcon sx={{ color: "info.main" }} />,
    children: [
      {
        segment: "email-inbox",
        title: "VOUCHER",
        icon: <InboxIcon sx={{ color: "primary.main" }} />,
      },
      {
        segment: "email-sent",
        title: "RCD GF",
        icon: <SendIcon sx={{ color: "success.main" }} />,
      },
      {
        segment: "email-sent",
        title: "RCD SEF",
        icon: <SendIcon sx={{ color: "success.main" }} />,
      },
      {
        segment: "email-sent",
        title: "MCH - APPLICATION",
        icon: <SendIcon sx={{ color: "success.main" }} />,
      },
      {
        segment: "email-sent",
        title: "MCH - CERTIFICATION",
        icon: <SendIcon sx={{ color: "success.main" }} />,
      },
      {
        segment: "email-sent",
        title: "MCH - ORDER",
        icon: <SendIcon sx={{ color: "success.main" }} />,
      },
      {
        segment: "email-sent",
        title: "MCH - CLEARANCE",
        icon: <SendIcon sx={{ color: "success.main" }} />,
      },
    ],
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

  const isDashboard = pathname === "/my-app" || pathname === "/";
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
        {isDashboard ? <DashboardHome /> : <Outlet />}
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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

function DashboardHome() {
  return (
    <div>
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Treasurer's Dashboard</h1>
          <p>Municipal Treasurer Office • As of 2025</p>
        </div>
        <div className="header-actions">
          <button className="filter-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
            </svg>
            Filter Period
          </button>
          <button className="export-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
            </svg>
            Export Reports
          </button>
        </div>
      </header>

      <Box sx={{ width: "100%" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid size={4}>
            <TaxCollected />
          </Grid>
          <Grid size={4}>
            <Item>Total this month</Item>
          </Grid>
          {/* <Grid size={4}>
            <Item>Total this day</Item>
          </Grid> */}
          <Grid size={4}>
            <Item>Business</Item>
          </Grid>
          <Grid size={8}>
            <Item>STATUS</Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default DashboardLayoutBranding;
