import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PieChartIcon from "@mui/icons-material/PieChart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Tooltip,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { format, parseISO } from "date-fns";
import { saveAs } from "file-saver";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { BiSolidReport } from "react-icons/bi";
import { IoMdAdd, IoMdDownload } from "react-icons/io";
import { IoToday } from "react-icons/io5";
import { MdSummarize } from "react-icons/md";
import * as XLSX from "xlsx";
import axios from "../../../../api/axiosInstance";
import RealPropertyTaxAbstract from "../../../../components/MD-Components/FillupForm/AbstractRPT";
import {
  default as PopupDialog,
  default as PopupDialogView,
} from "../../../../components/MD-Components/Popup/PopupDialogRPT_FORM";
import DailyTable from "./TableData/DailyTable";
import GenerateReport from "./TableData/GenerateReport";
import ReportTable from "./TableData/ReportTable";
import SummaryTable from "./TableData/Summary";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  whiteSpace: "nowrap",
  fontWeight: "bold",
  textAlign: "center",
  background: "linear-gradient(135deg, #1976d2, #63a4ff)",
  color: theme.palette.common.white,
  borderBottom: `2px solid ${theme.palette.primary.dark}`,
  fontSize: 14,
}));

const months = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const years = [
  { label: "2023", value: "2023" },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
  { label: "2028", value: "2028" },
  { label: "2029", value: "2029" },
  { label: "2030", value: "2030" },
];

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const initialFormData = {
  date: "",
  barangay: "",
  cashier: "",
  currentYear: "",
  currentPenalties: "",
  currentDiscounts: "",
  prevYear: "",
  prevPenalties: "",
  priorYears: "",
  priorPenalties: "",
  total: 0,
  share: 0,
  additionalCurrentYear: "",
  additionalCurrentPenalties: "",
  additionalCurrentDiscounts: "",
  additionalPrevYear: "",
  additionalPrevPenalties: "",
  additionalPriorYears: "",
  additionalPriorPenalties: "",
  additionalTotal: 0,
  gfTotal: 0,
  name: "",
  receipt: "",
  status: "",
};

function Row({ row }) {
  // 🟢 State Management
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const [selectedRowView, setSelectedRowView] = React.useState(null);
  // const [openDialog, setOpenDialog] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  const [rows, setRows] = React.useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openDialogView, setOpenDialogView] = React.useState(false);

  // 🟢 Menu Handlers
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // 🟢 View Dialog Handlers
  const handleView = (row) => {
    setSelectedRowView(row);
    setOpenDialogView(true);
    handleMenuClose();
  };

  const handleClose = () => {
    setOpenDialogView(false);
    setSelectedRowView(null);
  };

  // 🟢 Edit Dialog Handlers
  const handleEdit = (row) => {
    // ✅ Convert ISO date to yyyy-MM-dd format
    const formattedDate = format(parseISO(row.date), "yyyy-MM-dd");

    // ✅ Map snake_case keys to camelCase keys
    const formattedRow = {
      id: row.id,
      date: formattedDate,
      barangay: row.barangay,
      cashier: row.cashier,
      currentYear: row.current_year,
      currentPenalties: row.current_penalties,
      currentDiscounts: row.current_discounts,
      prevYear: row.prev_year,
      prevPenalties: row.prev_penalties,
      priorYears: row.prior_years,
      priorPenalties: row.prior_penalties,
      total: row.total,
      share: row.share,
      additionalCurrentYear: row.additional_current_year,
      additionalCurrentPenalties: row.additional_penalties,
      additionalCurrentDiscounts: row.additional_discounts,
      additionalPrevYear: row.additional_prev_year,
      additionalPrevPenalties: row.additional_prev_penalties,
      additionalPriorYears: row.additional_prior_years,
      additionalPriorPenalties: row.additional_prior_penalties,
      additionalTotal: row.additional_total,
      gfTotal: row.gf_total,
      name: row.name,
      receipt: row.receipt_no, // ✅ Match `receipt_no` to `receipt`
      status: row.status,
      comments: row.comments,
    };

    console.log("Formatted Row for Edit:", formattedRow); // Debugging

    setSelectedRow(formattedRow);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    setSelectedRow(null);
  };

  const handleUpdate = (updatedData) => {
    console.log("Updated Data:", updatedData);
    setEditDialogOpen(false);
  };

  // 🟢 Delete Function
  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    try {
      // ✅ Send DELETE request to Laravel endpoint
      const response = await axios.delete(`/deleteRPT/${selectedId}`);

      // ✅ Show success message
      alert(response.data.message || "Record deleted successfully");

      // ✅ Update UI state by removing the deleted row
      setRows((prevRows) => prevRows.filter((row) => row.id !== selectedId));
    } catch (error) {
      console.error("Error deleting record:", error);
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Error deleting record"
      );
    } finally {
      // ✅ Close the delete confirmation dialog
      setOpenDeleteDialog(false);
      setSelectedId(null);
    }
  };

  return (
    <>
      {/* 🟢 Table Row */}
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="center">{formatDate(row.date)}</TableCell>
        <TableCell align="center">{row.name}</TableCell>
        <TableCell align="center">{row.receipt_no}</TableCell>
        <TableCell align="center">{row.current_year}</TableCell>
        <TableCell align="center">{row.current_penalties}</TableCell>
        <TableCell align="center">{row.current_discounts}</TableCell>
        <TableCell align="center">{row.prev_year}</TableCell>
        <TableCell align="center">{row.prev_penalties}</TableCell>
        <TableCell align="center">{row.prior_years}</TableCell>
        <TableCell align="center">{row.prior_penalties}</TableCell>
        <TableCell align="center">
          {" "}
          <Typography variant="body2" fontWeight={600} color="success.main">
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
              minimumFractionDigits: 2,
            }).format(row.total)}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
            variant="contained"
            color="primary"
          >
            ACTIONS
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleView(row)}>View</MenuItem>
            <MenuItem onClick={() => handleEdit(row)}>Edit</MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation(); // Prevent event propagation
                setSelectedId(rows.id);
                setOpenDeleteDialog(true);
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>

      {/* 🟢 View Dialog */}
      <Dialog
        open={openDialogView}
        onClose={handleClose}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>Receipt Details</DialogTitle>
        <DialogContent>
          {selectedRowView && (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 4,
                boxShadow: 3,
                maxHeight: "70vh",
                overflowY: "auto",
                width: "100%",
                "& .MuiTableCell-root": { py: 2, px: 3 },
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    {[
                      "Date",
                      "Name of Taxpayer",
                      "Receipt No.",
                      "Current Year",
                      "Penalties",
                      "Discounts",
                      "Immediate Preceding Year",
                      "Penalties",
                      "Prior Years",
                      "Penalties",
                      "Total",
                      "Barangay",
                      "25% Share",
                      "Additional Current Year",
                      "Additional Penalties",
                      "Additional Discounts",
                      "Additional Prev Year",
                      "Additional Prev Penalties",
                      "Additional Prior Years",
                      "Additional Prior Penalties",
                      "Additional Total",
                      "GF and SEF",
                      "Status",
                      "Cashier",
                    ].map((header) => (
                      <StyledTableCell
                        key={header}
                        align="center"
                        sx={{ fontWeight: "bold" }}
                      >
                        {header}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">
                      {formatDate(selectedRowView.date)}
                    </TableCell>
                    <TableCell align="center">{selectedRowView.name}</TableCell>
                    <TableCell align="center">
                      {selectedRowView.receipt_no}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.current_year}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.current_penalties}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.current_discounts}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.prev_year}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.prev_penalties}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.prior_years}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.prior_penalties}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.total}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.barangay}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.share}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.additional_current_year}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.additional_penalties}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.additional_discounts}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.additional_prev_year}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.additional_prev_penalties}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.additional_prior_years}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.additional_prior_penalties}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.additional_total}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.gf_total}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.status}
                    </TableCell>
                    <TableCell align="center">
                      {selectedRowView.cashier}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🟢 Edit Dialog (Only Render When selectedRow Exists) */}
      {/* 🟢 Edit Dialog */}
      {selectedRow && (
        <PopupDialogView
          open={editDialogOpen}
          onClose={handleCloseEdit}
          title="Edit Record"
        >
          <RealPropertyTaxAbstract
            data={selectedRow}
            onSave={handleUpdate}
            onCancel={handleCloseEdit}
          />
        </PopupDialogView>
      )}
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    date: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    receipt_no: PropTypes.string.isRequired,
    current_year: PropTypes.number.isRequired,
    current_penalties: PropTypes.number.isRequired,
    current_discounts: PropTypes.number.isRequired,
    prev_year: PropTypes.number.isRequired,
    prev_penalties: PropTypes.number.isRequired,
    prior_years: PropTypes.number.isRequired,
    prior_penalties: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    barangay: PropTypes.string.isRequired,
    share: PropTypes.number.isRequired,
    additional_current_year: PropTypes.number.isRequired,
    additional_penalties: PropTypes.number.isRequired,
    additional_discounts: PropTypes.number.isRequired,
    additional_prev_year: PropTypes.number.isRequired,
    additional_prev_penalties: PropTypes.number.isRequired,
    additional_prior_years: PropTypes.number.isRequired,
    additional_prior_penalties: PropTypes.number.isRequired,
    additional_total: PropTypes.number.isRequired,
    gf_total: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    cashier: PropTypes.string.isRequired,
  }).isRequired,
};

function RealPropertyTax() {
  const [total, setTotal] = useState(0);
  const [gfTotal, setGfTotal] = useState(0);
  const [sefTotal, setSEFTotal] = useState(0);
  const [shareTotal, setShareTotal] = useState(0);
  const dailyButtonRef = useRef(null);
  const [showDailyTable, setShowDailyTable] = useState(false);
  const [showMainTable, setShowMainTable] = useState(true);
  const [showSummaryTable, setShowSummaryTable] = useState(false);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [dailyTableData, setDailyTableData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showReportTable, setShowReportTable] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(true);

  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingSearchQuery, setPendingSearchQuery] = useState("");

  const [reportDialog, setReportDialog] = useState({
    open: false,
    status: "idle", // 'idle' | 'loading' | 'success' | 'error'
    progress: 0,
  });

  const handleCloseDialog = () => {
    setReportDialog({ ...reportDialog, open: false });
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleGenerateReport = () => {
    // Open dialog in loading state
    setReportDialog({
      open: true,
      status: "loading",
      progress: 0,
    });

    // Simulate report generation
    const interval = setInterval(() => {
      setReportDialog((prev) => {
        const newProgress = prev.progress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...prev, status: "success", progress: 100 };
        }
        return { ...prev, progress: newProgress };
      });
    }, 300);
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // General Fund
        const { data: gfData } = await axios.get("/TotalGeneralFund");
        const totalGF = gfData.reduce(
          (sum, entry) => sum + parseFloat(entry.total || 0),
          0
        );
        setGfTotal(totalGF);

        // SEF Fund
        const { data: sefData } = await axios.get("/TotalSEFFund");
        const totalSEF = sefData.reduce(
          (sum, entry) => sum + parseFloat(entry.additional_total || 0),
          0
        );
        setSEFTotal(totalSEF);

        // Share Fund
        const { data: sharesData } = await axios.get("/TotalShareFund");
        const totalShares = sharesData.reduce(
          (sum, entry) => sum + parseFloat(entry.share || 0),
          0
        );
        setShareTotal(totalShares);

        // Listings
        const { data: listingsData } = await axios.get("/TotalFund");
        const totalListingsGF = listingsData.reduce(
          (sum, listing) => sum + parseFloat(listing.gf_total || 0),
          0
        );
        setTotal(totalListingsGF);
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    };
    fetchListings();

    const parseNumber = (value) => parseFloat(value) || 0;

    const computedTotal =
      parseNumber(formData.currentYear) +
      parseNumber(formData.currentPenalties) -
      parseNumber(formData.currentDiscounts) +
      parseNumber(formData.prevYear) +
      parseNumber(formData.prevPenalties) +
      parseNumber(formData.priorYears) +
      parseNumber(formData.priorPenalties);

    const computedAdditionalTotal =
      parseNumber(formData.additionalCurrentYear) +
      parseNumber(formData.additionalCurrentPenalties) -
      parseNumber(formData.additionalCurrentDiscounts) +
      parseNumber(formData.additionalPrevYear) +
      parseNumber(formData.additionalPrevPenalties) +
      parseNumber(formData.additionalPriorYears) +
      parseNumber(formData.additionalPriorPenalties);

    setFormData((prevData) => ({
      ...prevData,
      total: computedTotal,
      additionalTotal: computedAdditionalTotal,
      share: computedTotal * 0.25,
      gfTotal: computedTotal + computedAdditionalTotal,
    }));
  }, [
    formData.currentYear,
    formData.currentPenalties,
    formData.currentDiscounts,
    formData.prevYear,
    formData.prevPenalties,
    formData.priorYears,
    formData.priorPenalties,
    formData.additionalCurrentYear,
    formData.additionalCurrentPenalties,
    formData.additionalCurrentDiscounts,
    formData.additionalPrevYear,
    formData.additionalPrevPenalties,
    formData.additionalPriorYears,
    formData.additionalPriorPenalties,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/allData");
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [showDailyTable, showSummaryTable, showMainTable]);

  useEffect(() => {
    if (!Array.isArray(data)) {
      setFilteredData([]);
      return;
    }

    let newFiltered = data;

    // (a) Filter by searchQuery
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      newFiltered = newFiltered.filter((row) => {
        const rowName = (row?.name ?? "").toLowerCase();
        const rowCtcNo = (row?.receipt_no ?? "").toString().toLowerCase();
        // .includes() = partial substring match
        return rowName.includes(q) || rowCtcNo.includes(q);
      });
    }

    // (b) Filter by month/year
    if (month || year) {
      newFiltered = newFiltered.filter((row) => {
        if (!row.date) return false;
        const rowDate = new Date(row.date);
        const rowMonth = rowDate.getMonth() + 1;
        const rowYear = rowDate.getFullYear();

        const monthMatches = month ? rowMonth === parseInt(month) : true;
        const yearMatches = year ? rowYear === parseInt(year) : true;
        return monthMatches && yearMatches;
      });
    }

    setFilteredData(newFiltered);
    setPage(0); // reset pagination when filters change
  }, [data, searchQuery, month, year]);

  const toggleDailyTable = () => {
    setShowDailyTable(true);
    setShowMainTable(false);
    setShowSummaryTable(false);
    setShowReportTable(false);
    setShowFilters(false);
  };

  const toggleSummaryTable = () => {
    setShowSummaryTable(true);
    setShowMainTable(false);
    setShowDailyTable(false);
    setShowReportTable(false);
    setShowFilters(false);
  };

  const toggleReportTable = () => {
    setShowReportTable(true);
    setShowMainTable(false);
    setShowDailyTable(false);
    setShowSummaryTable(false);
    setShowFilters(false);
  };

  const handleSave = async (savedData) => {
    // Implement your save logic here
    console.log("Saved data:", savedData);
    // Close the dialog after saving
    setIsDialogOpen(false);
    // Optionally, refresh data or update UI
    // fetchData(); // If you have a fetchData function to refresh the data
  };

  const getFilteredDataByMonthYear = () => {
    if (!month || !year) return filteredData;

    return filteredData.filter((row) => {
      if (!row.date) return false;
      const rowDate = new Date(row.date);
      return (
        rowDate.getMonth() + 1 === Number(month) &&
        rowDate.getFullYear() === Number(year)
      );
    });
  };

  const handleDownload = () => {
    if (!month || !year) {
      setSnackbar({
        open: true,
        message: "Please select both month and year before downloading.",
        severity: "warning",
      });
      return;
    }

    const filteredExportData = getFilteredDataByMonthYear();

    if (filteredExportData.length === 0) {
      setSnackbar({
        open: true,
        message:
          "No data available to download for the selected month and year.",
        severity: "info",
      });
      return;
    }

    // Convert date to Philippine Time and human-readable format
    const formattedData = filteredExportData.map((item) => {
      return {
        ...item,
        DATE: new Date(item.DATE).toLocaleString("en-US", {
          timeZone: "Asia/Manila", // Set timezone to PHT
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");

    const file = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([file], { type: "application/octet-stream" });
    const fileName = `Real_Property_Tax_Report_${months.find((m) => m.value === month)?.label}_${year}.xlsx`;
    saveAs(blob, fileName);
  };

  const handleClickOpen = (content) => {
    setIsDialogOpen(true);
    setShowMainTable(true);
    setShowDailyTable(false);
    setShowSummaryTable(false);
    setShowFilters(false);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBack = () => {
    setShowReportTable(false);
    setShowDailyTable(false);
    setShowSummaryTable(false);
    setShowMainTable(true);
    setShowFilters(true);
  };

  const handleSearchClick = () => {
    // Move whatever is typed in pendingSearchQuery into searchQuery
    // This triggers the filter in the useEffect
    setSearchQuery(pendingSearchQuery);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 3,
        minHeight: "100vh",
      }}
    >
      <Box sx={{ mb: 4 }}>
        {/* Search & Filters Row */}
        <Box display="flex" alignItems="center" gap={3} sx={{ py: 2 }}>
          {showFilters && (
            <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search Records"
                placeholder="Name or Receipt Number"
                value={pendingSearchQuery}
                onChange={(e) => setPendingSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "8px" },
                }}
              />
              <Box display="flex" gap={2}>
                <Autocomplete
                  disablePortal
                  options={months}
                  sx={{ width: 180 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Month"
                      variant="outlined"
                    />
                  )}
                  onChange={(e, v) => setMonth(v?.value)}
                />

                <Autocomplete
                  disablePortal
                  options={years}
                  sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Year"
                      variant="outlined"
                    />
                  )}
                  onChange={(e, v) => setYear(v?.value)}
                />

                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    px: 4,
                    height: "56px",
                    borderRadius: "8px",
                    boxShadow: "none",
                    "&:hover": { boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)" },
                  }}
                  onClick={handleSearchClick}
                >
                  Apply Filters
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Modern Action Buttons Row */}
        <Box display="flex" alignItems="center" gap={2} sx={{ py: 1 }}>
          {/* Primary Actions Group */}
          <Box display="flex" gap={2} flexGrow={1}>
            {/* New Entry - Primary CTA */}
            <Tooltip title="Add New Entry" arrow>
              <Button
                variant="contained"
                startIcon={<IoMdAdd size={18} />}
                sx={{
                  px: 3.5,
                  backgroundColor: "#1976d2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                    transform: "translateY(-1px)",
                    boxShadow: "0 3px 10px rgba(25, 118, 210, 0.3)",
                  },
                  textTransform: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: "10px",
                  minWidth: "130px",
                  height: "44px",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 6px rgba(25, 118, 210, 0.2)",
                }}
                onClick={handleClickOpen}
              >
                New Entry
              </Button>
            </Tooltip>

            {/* Daily Report */}
            <Tooltip title="Generate Daily Report" arrow>
              <Button
                variant="contained"
                color="success"
                startIcon={<IoToday size={16} />}
                sx={{
                  px: 3.5,
                  backgroundColor: "#2e7d32",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1b5e20",
                    transform: "translateY(-1px)",
                  },
                  textTransform: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: "10px",
                  minWidth: "130px",
                  height: "44px",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 6px rgba(46, 125, 50, 0.2)",
                }}
                onClick={toggleDailyTable}
              >
                Daily Report
              </Button>
            </Tooltip>

            {/* Check Receipt */}
            <Tooltip title="Generate Receipt Report" arrow>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ReceiptIcon size={16} />}
                sx={{
                  px: 3.5,
                  backgroundColor: "#7b1fa2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#6a1b9a",
                    transform: "translateY(-1px)",
                  },
                  textTransform: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: "10px",
                  minWidth: "130px",
                  height: "44px",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 6px rgba(123, 31, 162, 0.2)",
                }}
                onClick={handleGenerateReport}
              >
                Check Receipt
              </Button>
            </Tooltip>
          </Box>

          <Box
            display="flex"
            flexWrap="wrap"
            gap={4}
            justifyContent="flex-start"
          >
            {/* Barangay Shares */}
            <Tooltip title="Barangay Sharing Reports" arrow>
              <Button
                variant="contained"
                startIcon={<MdSummarize size={18} />}
                sx={{
                  px: 3,
                  height: 44,
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  backgroundColor: "success.main",
                  color: "#fff",
                  boxShadow: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "success.dark",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Barangay Shares
              </Button>
            </Tooltip>

            {/* Summary Report */}
            <Tooltip title="Summary Reports" arrow>
              <Button
                variant="contained"
                startIcon={<AssessmentIcon fontSize="small" />}
                onClick={toggleSummaryTable}
                sx={{
                  px: 3,
                  height: 44,
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  backgroundColor: "warning.main",
                  color: "#fff",
                  boxShadow: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "warning.dark",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Summary Report
              </Button>
            </Tooltip>

            {/* Financial Report */}
            <Tooltip title="Financial Reports" arrow>
              <Button
                variant="contained"
                color="error"
                startIcon={<BiSolidReport size={18} />}
                onClick={toggleReportTable}
                sx={{
                  px: 3,
                  height: 44,
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "error.dark",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Financial Report
              </Button>
            </Tooltip>

            {/* Download */}
            <Tooltip title="Export Data" arrow>
              <Button
                variant="contained"
                color="info"
                startIcon={<IoMdDownload size={18} />}
                onClick={handleDownload}
                sx={{
                  px: 3,
                  height: 44,
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "none",
                  color: "white",
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "info.dark",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Download
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {/* Enhanced Summary Cards */}
        <Box
          display="flex"
          justifyContent="space-between"
          gap={3}
          sx={{
            mt: 4,
            flexDirection: { xs: "column", sm: "row" }, // Responsive layout
          }}
        >
          {[
            {
              value: total,
              text: "Total Revenue",
              icon: <AccountBalanceIcon fontSize="large" />,
              gradient: "linear-gradient(135deg, #3f51b5, #5c6bc0)",
            },
            {
              value: shareTotal,
              text: "25% Share Income",
              icon: <PieChartIcon fontSize="large" />,
              gradient: "linear-gradient(135deg, #4caf50, #66bb6a)",
            },
            {
              value: gfTotal,
              text: "General Fund",
              icon: <AccountTreeIcon fontSize="large" />,
              gradient: "linear-gradient(135deg, #ff9800, #ffa726)",
            },
            {
              value: sefTotal,
              text: "SEF",
              icon: <SchoolIcon fontSize="large" />,
              gradient: "linear-gradient(135deg, #e91e63, #ec407a)",
            },
          ].map(({ value, text, icon, gradient }) => (
            <Card
              key={text}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: "16px",
                background: gradient,
                color: "white",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                cursor: "pointer",
                minWidth: 0, // Prevent overflow
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "-50%",
                  right: "-50%",
                  width: "100%",
                  height: "100%",
                  background: "rgba(255,255,255,0.1)",
                  transform: "rotate(30deg)",
                  transition: "all 0.4s ease",
                },
                "&:hover::before": {
                  transform: "rotate(30deg) translate(20%, 20%)",
                },
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      opacity: 0.9,
                      mb: 0.5,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {text}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      lineHeight: 1.2,
                      mb: 1,
                    }}
                  >
                    {typeof value === "number"
                      ? new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                          minimumFractionDigits: 2,
                        }).format(value)
                      : value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    opacity: 0.2,
                    position: "absolute",
                    right: 20,
                    top: 20,
                    "& svg": {
                      fontSize: "3.5rem",
                    },
                  }}
                >
                  {icon}
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "4px",
                    backgroundColor: "rgba(255,255,255,0.3)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: "70%", // You can make this dynamic based on your data
                      height: "100%",
                      backgroundColor: "white",
                      borderRadius: "2px",
                    }}
                  />
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>

      {showSummaryTable && (
        <SummaryTable
          setMonth={setMonth}
          setYear={setYear}
          onBack={handleBack}
        />
      )}
      {showReportTable && <ReportTable onBack={handleBack} />}
      {showDailyTable && (
        <DailyTable onDataFiltered={setDailyTableData} onBack={handleBack} />
      )}
      {showMainTable && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            boxShadow: 3,
            "& .MuiTableCell-root": {
              py: 2,
            },
          }}
        >
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <StyledTableCell>DATE</StyledTableCell>
                <StyledTableCell>NAME OF TAXPAYER</StyledTableCell>
                <StyledTableCell>RECEIPT NO.</StyledTableCell>
                <StyledTableCell>Current Year</StyledTableCell>
                <StyledTableCell>Penalties</StyledTableCell>
                <StyledTableCell>Discounts</StyledTableCell>
                <StyledTableCell>Immediate Preceding Year</StyledTableCell>
                <StyledTableCell>Penalties</StyledTableCell>
                <StyledTableCell>Prior Years</StyledTableCell>
                <StyledTableCell>Penalties</StyledTableCell>
                <StyledTableCell>TOTAL</StyledTableCell>
                <StyledTableCell>ACTIONS</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <Row key={row.id} row={row} />
                ))}
            </TableBody>
          </Table>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            m={1}
          >
            <TablePagination
              rowsPerPageOptions={[10, 15, 20, 50, 100]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </TableContainer>
      )}
      {/* DIALOG OPENER */}
      {isDialogOpen && (
        <PopupDialog onClose={handleClose}>
          <RealPropertyTaxAbstract onSave={handleSave} onClose={handleClose} />
        </PopupDialog>
      )}

      <Box>
        {/*Snackbar Component (with prop fixes)*/}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>

      <GenerateReport
        open={reportDialog.open}
        onClose={handleCloseDialog}
        status={reportDialog.status}
        progress={reportDialog.progress}
      />
    </Box>
  );
}

export default RealPropertyTax;
