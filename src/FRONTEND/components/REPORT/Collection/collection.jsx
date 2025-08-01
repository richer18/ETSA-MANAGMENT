import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";


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

const BASE_URL = "http://192.168.101.109:3001";


// Helper function to format currency
const formatCurrency = (value) => {
  return typeof value === 'number' ? value : 0;
};

function Collection() {
  const [month, setMonth] = useState({ label: "January", value: "1" });
  const [year, setYear] = useState({ label: "2025", value: "2025" });

  const [data, setData] = useState({
    manufacturing: 0,
    distributor: 0,
    retailing: 0,
    financial: 0,
    otherBusinessTax: 0,
    sandGravel: 0,
    finesPenalties: 0,
    mayorsPermit: 0,
    weighsMeasure: 0,
    tricycleOperators: 0,
    occupationTax: 0,
    certOfOwnership: 0,
    certOfTransfer: 0,
    cockpitProvShare: 0,
    cockpitLocalShare: 0,
    dockingMooringFee: 0,
    sultadas: 0,
    miscellaneousFee: 0,
    regOfBirth: 0,
    marriageFees: 0,
    burialFees: 0,
    correctionOfEntry: 0,
    fishingPermitFee: 0,
    saleOfAgriProd: 0,
    saleOfAcctForm: 0,
    waterFees: 0,
    stallFees: 0,
    cashTickets: 0,
    slaughterHouseFee: 0,
    rentalOfEquipment: 0,
    docStamp: 0,
    policeReportClearance: 0,
    comTaxCert: 0,
    medDentLabFees: 0,
    garbageFees: 0,
    cuttingTree: 0,
  });

  const [tfdata, setTFData] = useState({
    building_local_80: 0,
    building_trust_15: 0,
    building_national_5: 0,
    electricalfee: 0,
    zoningfee: 0,
    livestock_local_80: 0,
    livestock_national_20: 0,
    diving_local_40: 0,
    diving_brgy_30: 0,
    diving_fishers_30: 0,
  });

  const [cdata, setCData] = useState({
    TOTALAMOUNTPAID: 0,
  });

  // Memoize defaultFields to ensure it's stable across renders
  const defaultFields = useMemo(
    () => ({
      "Total Collections": 0,
      National: 0,
      "35% Prov’l Share": 0,
      "Provincial Special Ed Fund": 0,
      "Provincial General Fund": 0,
      "Municipal General Fund": 0,
      "Municipal Special Ed Fund": 0,
      "Municipal Trust Fund": 0,
      "Barangay Share": 0,
      Fisheries: 0,
    }),
    []
  ); // Empty dependency array ensures this object is created once

  // Define the unified state object
  const [sharingData, setSharingData] = useState({
    LandSharingData: {
      Current: { ...defaultFields },
      Prior: { ...defaultFields },
      Penalties: { ...defaultFields },
      TOTAL: { ...defaultFields },
    },
    sefLandSharingData: {
      Current: { ...defaultFields },
      Prior: { ...defaultFields },
      Penalties: { ...defaultFields },
      TOTAL: { ...defaultFields },
    },
    buildingSharingData: {
      Current: { ...defaultFields },
      Prior: { ...defaultFields },
      Penalties: { ...defaultFields },
      TOTAL: { ...defaultFields },
    },
    sefBuildingSharingData: {
      Current: { ...defaultFields },
      Prior: { ...defaultFields },
      Penalties: { ...defaultFields },
      TOTAL: { ...defaultFields },
    },
  });

  useEffect(() => {
    const apiEndpoints = [
      { key: "LandSharingData", url: "/api/LandSharingData" },
      { key: "sefLandSharingData", url: "/api/sefLandSharingData" },
      { key: "buildingSharingData", url: "/api/buildingSharingData" },
      { key: "sefBuildingSharingData", url: "/api/sefBuildingSharingData" },
    ];

    // Fetch all data concurrently
    const fetchAllData = async () => {
      try {
        const query = `?month=${month?.value || ""}&year=${year?.value || ""}`;

        const responses = await Promise.all(
          apiEndpoints.map((api) => axios.get(`${BASE_URL}${api.url}${query}`))
        );

        const updatedSharingData = Object.fromEntries(
          apiEndpoints.map(({ key }) => [
            key,
            {
              Current: { ...defaultFields },
              Prior: { ...defaultFields },
              Penalties: { ...defaultFields },
              TOTAL: { ...defaultFields },
            },
          ])
        );

        responses.forEach((response, index) => {
          const apiKey = apiEndpoints[index].key;
          const data = response.data;

          if (!Array.isArray(data)) {
            console.error(
              `Invalid data format for ${apiKey}: Expected an array.`
            );
            return;
          }

          data.forEach((item) => {
            if (updatedSharingData[apiKey]?.[item.category]) {
              updatedSharingData[apiKey][item.category] = {
                ...defaultFields,
                ...item,
              };
            } else {
              console.warn(
                `Unexpected category: ${item.category} in ${apiKey}`
              );
            }
          });
        });

        setSharingData(updatedSharingData);
      } catch (err) {
        console.error("Error fetching sharing data:", err);
      }
    };

    fetchAllData();
  }, [month, year, defaultFields]); // ← Make sure to include month and year here

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const response = await axios.get(
          `${BASE_URL}/api/trustFundDataReport`,
          {
            params: { month: month.value, year: year.value },
          }
        );

        if (response.data.length > 0) {
          const filteredData = response.data.reduce(
            (acc, row) => ({
              building_local_80:
                acc.building_local_80 + (row.LOCAL_80_PERCENT || 0),
              building_trust_15:
                acc.building_trust_15 + (row.TRUST_FUND_15_PERCENT || 0),
              building_national_5:
                acc.building_national_5 + (row.NATIONAL_5_PERCENT || 0),
              electricalfee: acc.electricalfee + (row.ELECTRICAL_FEE || 0),
              zoningfee: acc.zoningfee + (row.ZONING_FEE || 0),
              livestock_local_80:
                acc.livestock_local_80 + (row.LOCAL_80_PERCENT_LIVESTOCK || 0),
              livestock_national_20:
                acc.livestock_national_20 + (row.NATIONAL_20_PERCENT || 0),
              diving_local_40:
                acc.diving_local_40 + (row.LOCAL_40_PERCENT_DIVE_FEE || 0),
              diving_brgy_30: acc.diving_brgy_30 + (row.BRGY_30_PERCENT || 0),
              diving_fishers_30:
                acc.diving_fishers_30 + (row.FISHERS_30_PERCENT || 0),
            }),
            {
              building_local_80: 0,
              building_trust_15: 0,
              building_national_5: 0,
              electricalfee: 0,
              zoningfee: 0,
              livestock_local_80: 0,
              livestock_national_20: 0,
              diving_local_40: 0,
              diving_brgy_30: 0,
              diving_fishers_30: 0,
            }
          );

         
          setTFData(filteredData);
        } else {
          console.warn("No data available for selected month and year");
          setTFData({
            building_local_80: 0,
            building_trust_15: 0,
            building_national_5: 0,
            electricalfee: 0,
            zoningfee: 0,
            livestock_local_80: 0,
            livestock_national_20: 0,
            diving_local_40: 0,
            diving_brgy_30: 0,
            diving_fishers_30: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [month, year]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/cedulaSummaryCollectionDataReport`,
          {
            params: { month: month.value, year: year.value },
          }
        );

      

        if (Array.isArray(response.data) && response.data.length > 0) {
          const totalAmountPaid = Number(response.data[0].Totalamountpaid) || 0;
          setCData({ TOTALAMOUNTPAID: totalAmountPaid });
        } else {
          console.warn("No data available for the selected month and year");
          setCData({ TOTALAMOUNTPAID: 0 });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setCData({ TOTALAMOUNTPAID: 0 });
      }
    };

    fetchData();
  }, [month, year]);

  useEffect(() => {
    const fetchData = async () => {
      try {
       

        const response = await axios.get(
          `${BASE_URL}/api/generalFundDataReport`,
          {
            params: { month: month.value, year: year.value },
          }
        );

        if (response.data.length > 0) {
          const filteredData = response.data.reduce(
            (acc, row) => ({
              manufacturing: acc.manufacturing + (row.Manufacturing || 0),
              distributor: acc.distributor + (row.Distributor || 0),
              retailing: acc.retailing + (row.Retailing || 0),
              financial: acc.financial + (row.Financial || 0),
              otherBusinessTax:
                acc.otherBusinessTax + (row.Other_Business_Tax || 0),
              sandGravel: acc.sandGravel + (row.Sand_Gravel || 0),
              finesPenalties: acc.finesPenalties + (row.Fines_Penalties || 0),
              mayorsPermit: acc.mayorsPermit + (row.Mayors_Permit || 0),
              weighsMeasure: acc.weighsMeasure + (row.Weighs_Measure || 0),
              tricycleOperators:
                acc.tricycleOperators + (row.Tricycle_Operators || 0),
              occupationTax: acc.occupationTax + (row.Occupation_Tax || 0),
              certOfOwnership:
                acc.certOfOwnership + (row.Cert_of_Ownership || 0),
              certOfTransfer: acc.certOfTransfer + (row.Cert_of_Transfer || 0),
              cockpitProvShare:
                acc.cockpitProvShare + (Number(row.Cockpit_Prov_Share) || 0),
              cockpitLocalShare:
                acc.cockpitLocalShare + (Number(row.Cockpit_Local_Share) || 0),
              dockingMooringFee:
                acc.dockingMooringFee + (row.Docking_Mooring_Fee || 0),
              sultadas: acc.sultadas + (row.Sultadas || 0),
              miscellaneousFee:
                acc.miscellaneousFee + (row.Miscellaneous_Fee || 0),
              regOfBirth: acc.regOfBirth + (row.Reg_of_Birth || 0),
              marriageFees: acc.marriageFees + (row.Marriage_Fees || 0),
              burialFees: acc.burialFees + (row.Burial_Fees || 0),
              correctionOfEntry:
                acc.correctionOfEntry + (row.Correction_of_Entry || 0),
              fishingPermitFee:
                acc.fishingPermitFee + (row.Fishing_Permit_Fee || 0),
              saleOfAgriProd: acc.saleOfAgriProd + (row.Sale_of_Agri_Prod || 0),
              saleOfAcctForm: acc.saleOfAcctForm + (row.Sale_of_Acct_Form || 0),
              waterFees: acc.waterFees + (row.Water_Fees || 0),
              stallFees: acc.stallFees + (row.Stall_Fees || 0),
              cashTickets: acc.cashTickets + (row.Cash_Tickets || 0),
              slaughterHouseFee:
                acc.slaughterHouseFee + (row.Slaughter_House_Fee || 0),
              rentalOfEquipment:
                acc.rentalOfEquipment + (row.Rental_of_Equipment || 0),
              docStamp: acc.docStamp + (row.Doc_Stamp || 0),
              policeReportClearance:
                acc.policeReportClearance + (row.Police_Report_Clearance || 0),
              secretaryfee: acc.secretaryfee + (row.Secretaries_Fee || 0),
              medDentLabFees: acc.medDentLabFees + (row.Med_Dent_Lab_Fees || 0),
              garbageFees: acc.garbageFees + (row.Garbage_Fees || 0),
              cuttingTree: acc.cuttingTree + (row.Cutting_Tree || 0),
            }),
            {
              manufacturing: 0,
              distributor: 0,
              retailing: 0,
              financial: 0,
              otherBusinessTax: 0,
              sandGravel: 0,
              finesPenalties: 0,
              mayorsPermit: 0,
              weighsMeasure: 0,
              tricycleOperators: 0,
              occupationTax: 0,
              certOfOwnership: 0,
              certOfTransfer: 0,
              cockpitProvShare: 0,
              cockpitLocalShare: 0,
              dockingMooringFee: 0,
              sultadas: 0,
              miscellaneousFee: 0,
              regOfBirth: 0,
              marriageFees: 0,
              burialFees: 0,
              correctionOfEntry: 0,
              fishingPermitFee: 0,
              saleOfAgriProd: 0,
              saleOfAcctForm: 0,
              waterFees: 0,
              stallFees: 0,
              cashTickets: 0,
              slaughterHouseFee: 0,
              rentalOfEquipment: 0,
              docStamp: 0,
              policeReportClearance: 0,
              secretaryfee: 0,
              medDentLabFees: 0,
              garbageFees: 0,
              cuttingTree: 0,
            }
          );
          setData(filteredData);
        } else {
          console.error("No data available for selected month and year");
          setData({
            manufacturing: 0,
            distributor: 0,
            retailing: 0,
            financial: 0,
            otherBusinessTax: 0,
            sandGravel: 0,
            finesPenalties: 0,
            mayorsPermit: 0,
            weighsMeasure: 0,
            tricycleOperators: 0,
            occupationTax: 0,
            certOfOwnership: 0,
            certOfTransfer: 0,
            cockpitProvShare: 0,
            cockpitLocalShare: 0,
            dockingMooringFee: 0,
            sultadas: 0,
            miscellaneousFee: 0,
            regOfBirth: 0,
            marriageFees: 0,
            burialFees: 0,
            correctionOfEntry: 0,
            fishingPermitFee: 0,
            saleOfAgriProd: 0,
            saleOfAcctForm: 0,
            waterFees: 0,
            stallFees: 0,
            cashTickets: 0,
            slaughterHouseFee: 0,
            rentalOfEquipment: 0,
            docStamp: 0,
            policeReportClearance: 0,
            secretaryfee: 0,
            medDentLabFees: 0,
            garbageFees: 0,
            cuttingTree: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [month, year]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/cedulaSummaryCollectionDataReport`,
          {
            params: { month: month.value, year: year.value },
          }
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          // Summing the TOTALAMOUNTPAID while ensuring row values are valid
          const totalAmountPaid = response.data.reduce(
            (sum, row) => sum + (Number(row.Totalamountpaid) || 0),
            0
          );

          setData({ TOTALAMOUNTPAID: totalAmountPaid });
        } else {
          console.warn("No data available for the selected month and year");
          setData({ TOTALAMOUNTPAID: 0 });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData({ TOTALAMOUNTPAID: 0 });
      }
    };

    fetchData();
  }, [month, year]); // Dependency array ensures re-fetching when month/year changes

  const handleMonthChange = (event, value) => {
    setMonth(value || { label: "January", value: "1" });
  };

  const handleYearChange = (event, value) => {
    setYear(value || { label: "2025", value: "2025" });
  };

  const totalOverAllAmountNational = (tfdata.building_national_5 || 0) + (tfdata.livestock_national_20 || 0);

  // You can place this calculation above your return statement
  const totalOverAllAmount =
    (data.manufacturing || 0) +
    (data.distributor || 0) +
    (data.retailing || 0) +
    (data.financial || 0) +
    (data.otherBusinessTax || 0) +
    (data.sandGravel || 0) +
    (data.finesPenalties || 0) +
    (data.mayorsPermit || 0) +
    (data.weighsMeasure || 0) +
    (data.tricycleOperators || 0) +
    (data.occupationTax || 0) +
    (data.certOfOwnership || 0) +
    (data.certOfTransfer || 0) +
    (data.cockpitProvShare || 0) +
    (data.cockpitLocalShare || 0) +
    (data.dockingMooringFee || 0) +
    (data.sultadas || 0) +
    (data.miscellaneousFee || 0) +
    (data.regOfBirth || 0) +
    (data.marriageFees || 0) +
    (data.burialFees || 0) +
    (data.correctionOfEntry || 0) +
    (data.fishingPermitFee || 0) +
    (data.saleOfAgriProd || 0) +
    (data.saleOfAcctForm || 0) +
    (data.waterFees || 0) +
    (data.stallFees || 0) +
    (data.cashTickets || 0) +
    (data.slaughterHouseFee || 0) +
    (data.rentalOfEquipment || 0) +
    (data.docStamp || 0) +
    (data.policeReportClearance || 0) +
    (data.secretaryfee || 0) +
    (data.medDentLabFees || 0) +
    (data.garbageFees || 0) +
    (data.cuttingTree || 0) +
    (tfdata.building_local_80 || 0) +
    (tfdata.building_trust_15 || 0) +
    (tfdata.building_national_5 || 0) +
    (tfdata.electricalfee || 0) +
    (tfdata.zoningfee || 0) +
    (tfdata.livestock_local_80 || 0) +
    (tfdata.livestock_national_20 || 0) +
    (tfdata.diving_local_40 || 0) +
    (tfdata.diving_brgy_30 || 0) +
    (tfdata.diving_fishers_30 || 0) +
    (cdata.TOTALAMOUNTPAID || 0) +
    // Land Sharing Data
    (sharingData.LandSharingData.Current["35% Prov’l Share"] || 0) +
    (sharingData.LandSharingData.Current["40% Mun. Share"] || 0) +
    (sharingData.LandSharingData.Current["25% Brgy. Share"] || 0) +
    (sharingData.LandSharingData.Prior["35% Prov’l Share"] || 0) +
    (sharingData.LandSharingData.Prior["40% Mun. Share"] || 0) +
    (sharingData.LandSharingData.Prior["25% Brgy. Share"] || 0) +
    (sharingData.LandSharingData.Penalties["35% Prov’l Share"] || 0) +
    (sharingData.LandSharingData.Penalties["40% Mun. Share"] || 0) +
    (sharingData.LandSharingData.Penalties["25% Brgy. Share"] || 0) +
    // SEF Land Sharing
    (sharingData.sefLandSharingData.Current["50% Prov’l Share"] || 0) +
    (sharingData.sefLandSharingData.Current["50% Mun. Share"] || 0) +
    (sharingData.sefLandSharingData.Prior["50% Prov’l Share"] || 0) +
    (sharingData.sefLandSharingData.Prior["50% Mun. Share"] || 0) +
    (sharingData.sefLandSharingData.Penalties["50% Prov’l Share"] || 0) +
    (sharingData.sefLandSharingData.Penalties["50% Mun. Share"] || 0) +
    // Building Sharing
    (sharingData.buildingSharingData.Current["35% Prov’l Share"] || 0) +
    (sharingData.buildingSharingData.Current["40% Mun. Share"] || 0) +
    (sharingData.buildingSharingData.Current["25% Brgy. Share"] || 0) +
    (sharingData.buildingSharingData.Prior["35% Prov’l Share"] || 0) +
    (sharingData.buildingSharingData.Prior["40% Mun. Share"] || 0) +
    (sharingData.buildingSharingData.Prior["25% Brgy. Share"] || 0) +
    (sharingData.buildingSharingData.Penalties["35% Prov’l Share"] || 0) +
    (sharingData.buildingSharingData.Penalties["40% Mun. Share"] || 0) +
    (sharingData.buildingSharingData.Penalties["25% Brgy. Share"] || 0) +
    // SEF Building Sharing
    (sharingData.sefBuildingSharingData.Current["50% Prov’l Share"] || 0) +
    (sharingData.sefBuildingSharingData.Current["50% Mun. Share"] || 0) +
    (sharingData.sefBuildingSharingData.Prior["50% Prov’l Share"] || 0) +
    (sharingData.sefBuildingSharingData.Prior["50% Mun. Share"] || 0) +
    (sharingData.sefBuildingSharingData.Penalties["50% Prov’l Share"] || 0) +
    (sharingData.sefBuildingSharingData.Penalties["50% Mun. Share"] || 0);

  // TOTAL OVERALL PROVINCIAL GENERAL FUND
  const totalOverAllProvGFAmount =
    (data.cockpitProvShare || 0) +
    (sharingData.LandSharingData.Current["35% Prov’l Share"] || 0) +
    (sharingData.LandSharingData.Prior["35% Prov’l Share"] || 0) +
    (sharingData.LandSharingData.Penalties["35% Prov’l Share"] || 0) +
    (sharingData.buildingSharingData.Current["35% Prov’l Share"] || 0) +
    (sharingData.buildingSharingData.Prior["35% Prov’l Share"] || 0) +
    (sharingData.buildingSharingData.Penalties["35% Prov’l Share"] || 0);

  const totalOverAllMunGFAmount =
    (data.manufacturing || 0) +
    (data.distributor || 0) +
    (data.retailing || 0) +
    (data.financial || 0) +
    (data.otherBusinessTax || 0) +
    (data.sandGravel || 0) +
    (data.finesPenalties || 0) +
    (data.mayorsPermit || 0) +
    (data.weighsMeasure || 0) +
    (data.tricycleOperators || 0) +
    (data.occupationTax || 0) +
    (data.certOfOwnership || 0) +
    (data.certOfTransfer || 0) +
    (data.cockpitLocalShare || 0) +
    (data.dockingMooringFee || 0) +
    (data.sultadas || 0) +
    (data.miscellaneousFee || 0) +
    (data.regOfBirth || 0) +
    (data.marriageFees || 0) +
    (data.burialFees || 0) +
    (data.correctionOfEntry || 0) +
    (data.fishingPermitFee || 0) +
    (data.saleOfAgriProd || 0) +
    (data.saleOfAcctForm || 0) +
    (data.waterFees || 0) +
    (data.stallFees || 0) +
    (data.cashTickets || 0) +
    (data.slaughterHouseFee || 0) +
    (data.rentalOfEquipment || 0) +
    (data.docStamp || 0) +
    (data.policeReportClearance || 0) +
    (data.secretaryfee || 0) +
    (data.medDentLabFees || 0) +
    (data.garbageFees || 0) +
    (data.cuttingTree || 0) +
    (cdata.TOTALAMOUNTPAID || 0) +
    (tfdata.building_local_80 || 0) +
    (tfdata.electricalfee || 0) +
    (tfdata.zoningfee || 0) +
    (tfdata.livestock_local_80 || 0) +
    (tfdata.diving_local_40 || 0) +
    (sharingData.LandSharingData.Current["40% Mun. Share"] || 0) +
    (sharingData.LandSharingData.Prior["40% Mun. Share"] || 0) +
    (sharingData.LandSharingData.Penalties["40% Mun. Share"] || 0) +
    (sharingData.buildingSharingData.Current["40% Mun. Share"] || 0) +
    (sharingData.buildingSharingData.Prior["40% Mun. Share"] || 0) +
    (sharingData.buildingSharingData.Penalties["40% Mun. Share"] || 0);

  const totalOverMunAllAmount =
    (data.manufacturing || 0) +
    (data.distributor || 0) +
    (data.retailing || 0) +
    (data.financial || 0) +
    (data.otherBusinessTax || 0) +
    (data.sandGravel || 0) +
    (data.finesPenalties || 0) +
    (data.mayorsPermit || 0) +
    (data.weighsMeasure || 0) +
    (data.tricycleOperators || 0) +
    (data.occupationTax || 0) +
    (data.certOfOwnership || 0) +
    (data.certOfTransfer || 0) +
    (data.cockpitLocalShare || 0) +
    (data.dockingMooringFee || 0) +
    (data.sultadas || 0) +
    (data.miscellaneousFee || 0) +
    (data.regOfBirth || 0) +
    (data.marriageFees || 0) +
    (data.burialFees || 0) +
    (data.correctionOfEntry || 0) +
    (data.fishingPermitFee || 0) +
    (data.saleOfAgriProd || 0) +
    (data.saleOfAcctForm || 0) +
    (data.waterFees || 0) +
    (data.stallFees || 0) +
    (data.cashTickets || 0) +
    (data.slaughterHouseFee || 0) +
    (data.rentalOfEquipment || 0) +
    (data.docStamp || 0) +
    (data.policeReportClearance || 0) +
    (data.secretaryfee || 0) +
    (data.medDentLabFees || 0) +
    (data.garbageFees || 0) +
    (data.cuttingTree || 0) +
    (tfdata.building_local_80 || 0) +
    (tfdata.building_trust_15 || 0) +
    (tfdata.electricalfee || 0) +
    (tfdata.zoningfee || 0) +
    (tfdata.livestock_local_80 || 0) +
    (tfdata.diving_local_40 || 0) +
    (cdata.TOTALAMOUNTPAID || 0) +
    // Land Sharing Data
    (sharingData.LandSharingData.Current["40% Mun. Share"] || 0) +
    (sharingData.LandSharingData.Prior["40% Mun. Share"] || 0) +
    (sharingData.LandSharingData.Penalties["40% Mun. Share"] || 0) +
    // SEF Land Sharing
    (sharingData.sefLandSharingData.Current["50% Mun. Share"] || 0) +
    (sharingData.sefLandSharingData.Prior["50% Mun. Share"] || 0) +
    (sharingData.sefLandSharingData.Penalties["50% Mun. Share"] || 0) +
    // Building Sharing
    (sharingData.buildingSharingData.Current["40% Mun. Share"] || 0) +
    (sharingData.buildingSharingData.Prior["40% Mun. Share"] || 0) +
    (sharingData.buildingSharingData.Penalties["40% Mun. Share"] || 0) +
    // SEF Building Sharing
    (sharingData.sefBuildingSharingData.Current["50% Mun. Share"] || 0) +
    (sharingData.sefBuildingSharingData.Prior["50% Mun. Share"] || 0) +
    (sharingData.sefBuildingSharingData.Penalties["50% Mun. Share"] || 0);


    useEffect(() => {
      const style = document.createElement("style");
      style.innerHTML = `
        @media print {
          @page {
            size: 8.5in 13in portrait;
            margin: 10mm;
          }
  
          body * {
            visibility: hidden;
          }
  
          #printableArea, #printableArea * {
            visibility: visible;
          }
  
          #printableArea {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
  
          table {
            width: 100%;
            border-collapse: collapse;
            font-family: Arial, sans-serif;
            font-size: 10px;
          }
  
          th, td {
            border: 1px solid black;
            padding: 6px;
            text-align: center;
          }
  
          th {
            background-color: #f2f2f2;
            font-weight: bold;
            font-size: 11px;
          }
  
          h6, .subtitle {
            font-size: 12px;
            text-align: center;
            font-weight: bold;
            margin: 6px 0;
            font-family: Arial, sans-serif;
          }
  
          tr {
            page-break-inside: avoid;
          }
  
          .custom-footer {
            text-align: center;
            font-size: 10px;
            margin-top: 10mm;
            font-family: Arial, sans-serif;
            position: relative;
            bottom: 0;
          }
  
          .page-break {
            display: block;
            page-break-after: always;
            break-after: page;
            height: 0;
            visibility: hidden;
          }
  
          /* Adjust column widths */
          th:nth-child(1), td:nth-child(1)   { width: 18%; }
          th:nth-child(2), td:nth-child(2)   { width: 14%; }
          th:nth-child(3), td:nth-child(3)   { width: 10%; }
          th:nth-child(4), td:nth-child(4)   { width: 9%; }
          th:nth-child(5), td:nth-child(5)   { width: 9%; }
          th:nth-child(6), td:nth-child(6)   { width: 9%; }
          th:nth-child(7), td:nth-child(7)   { width: 9%; }
          th:nth-child(8), td:nth-child(8)   { width: 9%; }
          th:nth-child(9), td:nth-child(9)   { width: 9%; }
          th:nth-child(10), td:nth-child(10) { width: 9%; }
          th:nth-child(11), td:nth-child(11) { width: 6%; }
          th:nth-child(12), td:nth-child(12) { width: 6%; }
        }
      `;
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
    }, []);
    
    const handlePrint = () => {
      const originalTitle = document.title;
      document.title = `SOC_GeneralFundReport_${month.label}_${year.label}`;
      window.print();
      document.title = originalTitle; // Restore original title
    };

    const generateHeaders = () => {
  return [
['SUMMARY OF COLLECTIONS', '', '', '', '', '', '', '', '', '', ''],
['ZAMBOANGUITA, NEGROS ORIENTAL', '', '', '', '', '', '', '', '', '', ''],
['LGU', '', '', '', '', '', '', '', '', '', ''],
['Month of January 2025', '', '', '', '', '', '', '', '', '', ''],
[],

    [
      'SOURCES OF COLLECTIONS',
      'TOTAL COLLECTIONS',
      'NATIONAL',
      'PROVINCIAL', '', '',
      'MUNICIPAL', '', '', '',
      'BARANGAY SHARE',
      'FISHERIES'
    ],
    [
      '',
      '',
      '',
      'GENERAL FUND',
      'SPECIAL EDUC. FUND',
      'TOTAL',
      'GENERAL FUND',
      'SPECIAL EDUC. FUND',
      'TRUST FUND',
      'TOTAL',
      '',
      ''
    ]
  ];
};

const readableCategories = {
  LandSharingData: 'Real Property Tax - Basic/Land',
  sefLandSharingData: 'Real Property Tax - SEF/Land',
  buildingSharingData: 'Real Property Tax - Basic/Bldg.',
  sefBuildingSharingData: 'Real Property Tax - SEF/Bldg.'
};

const handleDownloadExcel = () => {
  const headers = generateHeaders();
  const dataToExport = [];
  
  const totals = {
    totalCollections: 0,
    national: 0,
    prov35: 0,
    prov50: 0,
    mun40: 0,
    mun50: 0,
    trust: 0,
    brgy: 0,
    fisheries: 0,
  };

  const addDataRow = (label, value, provincialValue = null) => {
    const municipalValue = provincialValue ? value - provincialValue : value;

    dataToExport.push([
      label,
      formatCurrency(value),
      '', // National
      provincialValue !== null ? formatCurrency(provincialValue) : '', // Prov Gen Fund
      '', '', // Prov SEF & Prov Total
      provincialValue !== null ? formatCurrency(municipalValue) : formatCurrency(value), // Mun Gen Fund
      '', '', // Mun SEF & Trust Fund
      provincialValue !== null ? formatCurrency(municipalValue) : formatCurrency(value), // Mun Total
      '', // Brgy
      ''  // Fisheries
    ]);
  };

  // Add regular data rows
  [
    ['Manufacturing', data.manufacturing],
    ['Distributor', data.distributor],
    ['Retailing', data.retailing],
    ['Banks & Other Financial Int.', data.financial],
    ['Other Business Tax', data.otherBusinessTax],
    ['Sand & Gravel', data.sandGravel],
    ['Fines & Penalties', data.finesPenalties],
    ['Mayor\'s Permit', data.mayorsPermit],
    ['Weights & Measures', data.weighsMeasure],
    ['Tricycle Permit Fee', data.tricycleOperators],
    ['Occupation Tax', data.occupationTax],
    ['Cert. of Ownership', data.certOfOwnership],
    ['Cert. of Transfer', data.certOfTransfer],
    ['Cockpit Share', (data.cockpitLocalShare || 0) + (data.cockpitProvShare || 0), data.cockpitProvShare],
    ['Docking and Mooring Fee', data.dockingMooringFee],
    ['Sultadas', data.sultadas],
    ['Miscellaneous', data.miscellaneousFee],
    ['Registration of Birth', data.regOfBirth],
    ['Marriage Fees', data.marriageFees],
    ['Burial Fees', data.burialFees],
    ['Correction of Entry', data.correctionOfEntry],
    ['Fishing Permit Fee', data.fishingPermitFee],
    ['Sale of Agri. Prod.', data.saleOfAgriProd],
    ['Sale of Acc. Forms', data.saleOfAcctForm],
    ['Water Fees', data.waterFees],
    ['Market Stall Fee', data.stallFees],
    ['Cash Tickets', data.cashTickets],
    ['Slaughterhouse Fee', data.slaughterHouseFee],
    ['Rent of Equipment', data.rentalOfEquipment],
    ['Doc Stamp Tax', data.docStamp],
    ['Police Clearance', '0.00'],
    ['Secretariat Fees', (data.secretaryfee || 0) + (data.policeReportClearance || 0)],
    ['Med./Lab. Fees', data.medDentLabFees],
    ['Garbage Fees', data.garbageFees],
    ['Cutting Tree', data.cuttingTree],
    ['Community Tax', cdata.TOTALAMOUNTPAID]
  ].forEach(([label, value, prov]) => addDataRow(label, value, prov));

  // Add fixed rows
  const fixedRows = [
    [
      'Building Permit Fee',
      formatCurrency(tfdata.building_local_80 + tfdata.building_trust_15 + tfdata.building_national_5),
      formatCurrency(tfdata.building_national_5),
      '', '', '',
      formatCurrency(tfdata.building_local_80),
      '', formatCurrency(tfdata.building_trust_15),
      formatCurrency(tfdata.building_local_80 + tfdata.building_trust_15),
      '', ''
    ],
    [
      'Electrical Permit Fee',
      formatCurrency(tfdata.electricalfee),
      '', '', '', '',
      formatCurrency(tfdata.electricalfee),
      '', '', formatCurrency(tfdata.electricalfee),
      '', ''
    ],
    [
      'Zoning Fee',
      formatCurrency(tfdata.zoningfee),
      '', '', '', '',
      formatCurrency(tfdata.zoningfee),
      '', '', formatCurrency(tfdata.zoningfee),
      '', ''
    ],
    [
      'Livestock',
      formatCurrency(tfdata.livestock_local_80 + tfdata.livestock_national_20),
      formatCurrency(tfdata.livestock_national_20),
      '', '', '',
      formatCurrency(tfdata.livestock_local_80),
      '', '', formatCurrency(tfdata.livestock_local_80),
      '', ''
    ],
    [
      'Diving Fee',
      formatCurrency(tfdata.diving_local_40 + tfdata.diving_brgy_30 + tfdata.diving_fishers_30),
      '', '', '', '',
      formatCurrency(tfdata.diving_local_40),
      '', '', formatCurrency(tfdata.diving_local_40),
      formatCurrency(tfdata.diving_brgy_30),
      formatCurrency(tfdata.diving_fishers_30)
    ]
  ];

  fixedRows.forEach(row => dataToExport.push(row));

  // sharingData rows
  Object.keys(sharingData).forEach((key) => {
    const categoryData = sharingData[key];
    const hasData = Object.values(categoryData).some(row =>
      Object.values(row).some(value => value !== 0 && value !== '' && value !== null)
    );
    if (!hasData) return;

    const categoryLabel = readableCategories[key] || key;
    dataToExport.push([categoryLabel]);

    Object.keys(categoryData).forEach(subKey => {
      if (subKey === 'TOTAL') return;
      const rowData = categoryData[subKey];
      let totalCollections = 0;

      if (key === 'LandSharingData' || key === 'buildingSharingData') {
        totalCollections =
          (rowData['35% Prov’l Share'] || 0) +
          (rowData['40% Mun. Share'] || 0) +
          (rowData['25% Brgy. Share'] || 0);
      } else if (key === 'sefLandSharingData' || key === 'sefBuildingSharingData') {
        totalCollections =
          (rowData['50% Prov’l Share'] || 0) +
          (rowData['50% Mun. Share'] || 0);
      }

      totals.totalCollections += totalCollections;
      totals.national += (rowData['National'] || 0);
      totals.prov35 += (rowData['35% Prov’l Share'] || 0);
      totals.prov50 += (rowData['50% Prov’l Share'] || 0);
      totals.mun40 += (rowData['40% Mun. Share'] || 0);
      totals.mun50 += (rowData['50% Mun. Share'] || 0);
      totals.trust += (rowData['Municipal Trust Fund'] || 0);
      totals.brgy += (rowData['25% Brgy. Share'] || 0);
      totals.fisheries += (rowData['Fisheries'] || 0);

      dataToExport.push([
        subKey === 'Current' ? 'Current Year' : subKey === 'Prior' ? 'Previous Years' : 'Penalties',
        (totalCollections),
        (rowData['National'] || 0),
        (rowData['35% Prov’l Share'] || 0),
        (rowData['50% Prov’l Share'] || 0),
        ((rowData['35% Prov’l Share'] || 0) + (rowData['50% Prov’l Share'] || 0)),
        (rowData['40% Mun. Share'] || 0),
        (rowData['50% Mun. Share'] || 0),
        (rowData['Municipal Trust Fund'] || 0),
        (
          (rowData['40% Mun. Share'] || 0) +
          (rowData['50% Mun. Share'] || 0) +
          (rowData['Municipal Trust Fund'] || 0)
        ),
        (rowData['25% Brgy. Share'] || 0),
        (rowData['Fisheries'] || 0)
      ]);
    });
  });


  dataToExport.push([
    'TOTAL',
    formatCurrency(totalOverAllAmount), //Total Collection
    formatCurrency(totalOverAllAmountNational),  //National
    formatCurrency(totalOverAllProvGFAmount),  //Prov General Fund
    formatCurrency(
                      (sharingData.sefLandSharingData.Current[
                        "50% Prov’l Share"
                      ] || 0) +
                        (sharingData.sefLandSharingData.Prior[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefLandSharingData.Penalties[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Current[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Prior[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Penalties[
                          "50% Prov’l Share"
                        ] || 0)
                    ),  //Prov SEF
    formatCurrency((sharingData.LandSharingData.Current[
                        "35% Prov’l Share"
                      ] || 0) +
                        (sharingData.LandSharingData.Prior[
                          "35% Prov’l Share"
                        ] || 0) +
                        (sharingData.LandSharingData.Penalties[
                          "35% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefLandSharingData.Current[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefLandSharingData.Prior[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefLandSharingData.Penalties[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.buildingSharingData.Current[
                          "35% Prov’l Share"
                        ] || 0) +
                        (sharingData.buildingSharingData.Prior[
                          "35% Prov’l Share"
                        ] || 0) +
                        (sharingData.buildingSharingData.Penalties[
                          "35% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Current[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Prior[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Penalties[
                          "50% Prov’l Share"
                        ] || 0)), //Prov TOTAL
    formatCurrency((totalOverAllMunGFAmount)), //Mun General Fund 
    formatCurrency(
                      (sharingData.sefLandSharingData.Current[
                        "50% Mun. Share"
                      ] || 0) +
                        (sharingData.sefLandSharingData.Prior[
                          "50% Mun. Share"
                        ] || 0) +
                        (sharingData.sefLandSharingData.Penalties[
                          "50% Mun. Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Current[
                          "50% Mun. Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Prior[
                          "50% Mun. Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Penalties[
                          "50% Mun. Share"
                        ] || 0)
                    ),  //Mun SEF
    formatCurrency(tfdata.building_trust_15), //Mun Trust
    formatCurrency(totalOverMunAllAmount), //Mun Total
    formatCurrency(
                      (tfdata.diving_brgy_30 || 0) +
                        (sharingData.LandSharingData.Current[
                          "25% Brgy. Share"
                        ] || 0) +
                        (sharingData.LandSharingData.Prior["25% Brgy. Share"] ||
                          0) +
                        (sharingData.LandSharingData.Penalties[
                          "25% Brgy. Share"
                        ] || 0) +
                        (sharingData.buildingSharingData.Current[
                          "25% Brgy. Share"
                        ] || 0) +
                        (sharingData.buildingSharingData.Prior[
                          "25% Brgy. Share"
                        ] || 0) +
                        (sharingData.buildingSharingData.Penalties[
                          "25% Brgy. Share"
                        ] || 0)
                    ), //Barangay
    formatCurrency(tfdata.diving_fishers_30)  //Fisheries
  ]);

   


  // Create worksheet
const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...dataToExport]);

// Define merge utility function
const mergeRange = (startCell, endCell) => {
  const decode = XLSX.utils.decode_cell;
  return { s: decode(startCell), e: decode(endCell) };
};

// Add top title merges (A1:L1, A2:L2, A3:L3, A4:L4)
worksheet['!merges'] = [
  mergeRange('A1', 'L1'),
  mergeRange('A2', 'L2'),
  mergeRange('A3', 'L3'),
  mergeRange('A4', 'L4'),
  // Merge headers (row 5, 0-based index = r: 4)
  { s: { r: 4, c: 2 }, e: { r: 4, c: 2 } }, // NATIONAL
  { s: { r: 4, c: 3 }, e: { r: 4, c: 5 } }, // PROVINCIAL
  { s: { r: 4, c: 6 }, e: { r: 4, c: 9 } }, // MUNICIPAL
  { s: { r: 4, c: 10 }, e: { r: 4, c: 10 } }, // BARANGAY SHARE
  { s: { r: 4, c: 11 }, e: { r: 4, c: 11 } }, // FISHERIES
];

// Freeze top 2 rows
worksheet['!freeze'] = { xSplit: 0, ySplit: 2 };

// Set column widths
worksheet['!cols'] = headers[0].map(() => ({ wpx: 160 }));

// Create and save workbook
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
XLSX.writeFile(workbook, `SOCRPT_${month.label}_${year.label}.xlsx`);
};




  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          mb: 4,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Box display="flex" gap={2}>
          <Autocomplete
            disablePortal
            id="month-selector"
            options={months}
            sx={{
              width: 180,
              "& .MuiInputBase-root": { borderRadius: "8px" },
            }}
            onChange={handleMonthChange}
            value={month}
            renderInput={(params) => (
              <TextField {...params} label="Select Month" variant="outlined" />
            )}
          />
          <Autocomplete
            disablePortal
            id="year-selector"
            options={years}
            sx={{
              width: 180,
              "& .MuiInputBase-root": { borderRadius: "8px" },
            }}
            onChange={handleYearChange}
            value={year}
            renderInput={(params) => (
              <TextField {...params} label="Select Year" variant="outlined" />
            )}
          />
        </Box>
      </Box>
      <div id="printableArea">
        <Box>
          <Box>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={0}
              direction="column"
              mb={2}
            >
              <Grid item>
                <Typography variant="h6" fontWeight="bold" align="center">
                  SUMMARY OF COLLECTIONS
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  align="center"
                >
                  ZAMBOANGUITA, NEGROS ORIENTAL
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" fontStyle="bold" align="center">
                  LGU
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" fontStyle="bold" align="center">
                  Month of {month.label} {year.label}
                </Typography>
              </Grid>
            </Grid>
            <TableContainer component={Paper}>
              <Table sx={{ border: "1px solid black" }}>
                <TableHead>
                  {/* First Row */}
                  <TableRow>
                    <TableCell
                      rowSpan={2}
                      align="center"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      SOURCES OF COLLECTIONS
                    </TableCell>
                    <TableCell
                      rowSpan={2}
                      align="center"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      TOTAL COLLECTIONS
                    </TableCell>
                    <TableCell
                      rowSpan={2}
                      align="center"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      NATIONAL
                    </TableCell>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      PROVINCIAL
                    </TableCell>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      MUNICIPAL
                    </TableCell>
                    <TableCell
                      rowSpan={2}
                      align="center"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      BARANGAY SHARE
                    </TableCell>
                    <TableCell
                      rowSpan={2}
                      align="center"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      FISHERIES
                    </TableCell>
                  </TableRow>
                  {/* Second Row */}
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      GENERAL FUND
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      SPECIAL EDUC. FUND
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      TOTAL
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      GENERAL FUND
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      SPECIAL EDUC. FUND
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      TRUST FUND
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      TOTAL
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Manufacturing */}
                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Manufacturing
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {formatCurrency(data.manufacturing || 0)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {formatCurrency(data.manufacturing || 0)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.manufacturing || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>
                  {/* Distributor */}
                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Distributor
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.distributor || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.distributor || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.distributor || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>
                  {/* Retailing */}
                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Retailing
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.retailing || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.retailing || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.retailing || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>
                  {/*Banks & Other Financial Int. */}
                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Banks & Other Financial Int.
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.financial || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.financial || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.financial || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>
                  <TableRow>
                    {/*Other Business Tax */}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Other Business Tax
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.otherBusinessTax || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.otherBusinessTax || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.otherBusinessTax || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>
                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Sand & Gravel
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.sandGravel || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.sandGravel || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.sandGravel || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Fines & Penalties
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.finesPenalties || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.finesPenalties || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.finesPenalties || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Mayor's Permit
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.mayorsPermit || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.mayorsPermit || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.mayorsPermit || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Weight & Measure
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.weighsMeasure || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.weighsMeasure || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.weighsMeasure || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Tricycle Permit Fee
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.tricycleOperators || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.tricycleOperators || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.tricycleOperators || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Occupation Tax
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.occupationTax || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {data.occupationTax}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {data.occupationTax}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Cert. of Ownership
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.certOfOwnership || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.certOfOwnership || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.certOfOwnership || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Cert. of Transfer
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.certOfTransfer || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.certOfTransfer || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.certOfTransfer || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Cockpit Share
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (data.cockpitProvShare || 0) +
                          (data.cockpitLocalShare || 0) || 0
                      ).toFixed(2)}{" "}
                      {/* TOTAL COLLECTIONS */}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.cockpitProvShare || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.cockpitLocalShare || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.cockpitLocalShare || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Docking and Mooring Fee
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.dockingMooringFee || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.dockingMooringFee || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.dockingMooringFee || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Sultadas
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.sultadas || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.sultadas || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.sultadas || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Miscellaneous
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.miscellaneousFee || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.miscellaneousFee || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.miscellaneousFee || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Registration of Birth
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.regOfBirth || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.regOfBirth || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.regOfBirth || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Marriage Fee
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.marriageFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.marriageFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.marriageFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Burial Fee
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.burialFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.burialFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.burialFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Correction of Entry
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.correctionOfEntry || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.correctionOfEntry || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.correctionOfEntry || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Fishing Permit Fee
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.fishingPermitFee || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.fishingPermitFee || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.fishingPermitFee || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Sale of Agri. Prod.
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.saleOfAgriProd || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.saleOfAgriProd || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.saleOfAgriProd || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Sale of Acct. Forms
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.saleOfAcctForm || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.saleOfAcctForm || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.saleOfAcctForm || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Water Fee
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.waterFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.waterFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.waterFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Market Stall Fee
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.stallFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.stallFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.stallFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Cash Tickets
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.cashTickets || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.cashTickets || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.cashTickets || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      SlaughterHouse Fee
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.slaughterHouseFee || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.slaughterHouseFee || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.slaughterHouseFee || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Rental of Equipment
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.rentalOfEquipment || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.rentalOfEquipment || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.rentalOfEquipment || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Doc Stamp Tax
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.docStamp || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {data.docStamp || 0}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {data.docStamp || 0}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Police Clearance
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      0
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      0
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      0
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Secretaries Fees
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {" "}
                      {(data.policeReportClearance || 0) +
                        (data.secretaryfee || 0) || 0}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.policeReportClearance || 0) +
                        (data.secretaryfee || 0) || 0}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.policeReportClearance || 0) +
                        (data.secretaryfee || 0) || 0}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Med./Lab. Fees
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {data.medDentLabFees || 0}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {data.medDentLabFees || 0}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.medDentLabFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>
                  {/* Community Tax Certification */}
                  <TableRow>
                    <React.Fragment>
                      <TableCell
                        align="left"
                        sx={{ border: "1px solid black" }}
                      >
                        Com Tax Cert.
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid black" }}
                        align="center"
                      >
                        {(cdata.TOTALAMOUNTPAID || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid black" }}
                        align="center"
                      ></TableCell>
                      <TableCell
                        sx={{ border: "1px solid black" }}
                        align="center"
                      ></TableCell>
                      <TableCell
                        sx={{ border: "1px solid black" }}
                        align="center"
                      ></TableCell>
                      <TableCell
                        sx={{ border: "1px solid black" }}
                        align="center"
                      ></TableCell>
                      <TableCell
                        sx={{ border: "1px solid black" }}
                        align="center"
                      >
                        {(cdata.TOTALAMOUNTPAID || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid black" }}
                        align="center"
                      ></TableCell>
                      <TableCell
                        sx={{ border: "1px solid black" }}
                        align="center"
                      ></TableCell>
                      <TableCell
                        sx={{ border: "1px solid black" }}
                        align="center"
                      >
                        {(cdata.TOTALAMOUNTPAID || 0).toFixed(2)}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid black" }}
                        align="center"
                      ></TableCell>
                      <TableCell
                        sx={{ border: "1px solid black" }}
                        align="center"
                      ></TableCell>
                    </React.Fragment>
                  </TableRow>

                  <TableRow>
                    {/*Garbage Fee*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Garbage Fees
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.garbageFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.garbageFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.garbageFees || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  <TableRow>
                    {/*Fines & Penalties*/}
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Cutting Tree
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.cuttingTree || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.cuttingTree || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(data.cuttingTree || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  {/* Building Permit Fee */}
                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Building Permit Fee
                    </TableCell>

                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (tfdata.building_national_5 || 0) +
                        (tfdata.building_local_80 || 0) +
                        (tfdata.building_trust_15 || 0)
                      ).toFixed(2)}
                    </TableCell>

                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.building_national_5 || 0).toFixed(2)}
                    </TableCell>

                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>

                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>

                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>

                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.building_local_80 || 0).toFixed(2)}
                    </TableCell>

                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>

                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.building_trust_15 || 0).toFixed(2)}
                    </TableCell>

                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (tfdata.building_local_80 || 0) +
                        (tfdata.building_trust_15 || 0)
                      ).toFixed(2)}
                    </TableCell>

                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>

                    {/* FISHERIES */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                  </TableRow>
                  {/* Electrical Permit Fee */}
                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Electrical Permit Fee
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.electricalfee || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.electricalfee || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.electricalfee || 0).toFixed(2)}
                    </TableCell>{" "}
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>{" "}
                    {/* FISHERIES */}
                  </TableRow>

                  {/* Zoning Fee */}
                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Zoning Fee
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.zoningfee || 0).toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.zoningfee || 0).toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.zoningfee || 0).toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                  </TableRow>

                  {/* Livestock */}
                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Livestock
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (tfdata.livestock_national_20 || 0) +
                        (tfdata.livestock_local_80 || 0)
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.livestock_national_20 || 0).toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.livestock_local_80 || 0).toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.livestock_local_80 || 0).toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                  </TableRow>

                  {/* Diving Fee */}
                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      Diving Fee
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (tfdata.diving_local_40 || 0) +
                        (tfdata.diving_brgy_30 || 0) +
                        (tfdata.diving_fishers_30 || 0)
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.diving_local_40 || 0).toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.diving_local_40 || 0).toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.diving_brgy_30 || 0).toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(tfdata.diving_fishers_30 || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>

                  {/* Real Property Tax-Basic/Land */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      Real Property Tax-Basic/Land
                    </TableCell>
                    {/* Empty cells for the rest of the columns */}
                    {Array.from({ length: 11 }).map((_, index) => (
                      <TableCell
                        key={index}
                        sx={{ border: "1px solid black" }}
                      />
                    ))}
                  </TableRow>
                  {/* Child items for Real Property Tax-Basic/Land */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", paddingLeft: 4 }}
                    >
                      Current Year
                    </TableCell>
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (sharingData.LandSharingData.Current[
                          "35% Prov’l Share"
                        ] || 0) +
                          (sharingData.LandSharingData.Current[
                            "40% Mun. Share"
                          ] || 0) +
                          (sharingData.LandSharingData.Current[
                            "25% Brgy. Share"
                          ] || 0) || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.LandSharingData.Current[
                          "35% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.LandSharingData.Current[
                          "35% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.LandSharingData.Current["40% Mun. Share"] ||
                        0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.LandSharingData.Current["40% Mun. Share"] ||
                        0
                      ).toFixed(2)}
                    </TableCell>
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.LandSharingData.Current[
                          "25% Brgy. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* FISHERIES */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                  </TableRow>

                  {/* Previous Years */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", paddingLeft: 4 }}
                    >
                      Previous Years
                    </TableCell>
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (sharingData.LandSharingData.Prior[
                          "35% Prov’l Share"
                        ] || 0) +
                          (sharingData.LandSharingData.Prior[
                            "40% Mun. Share"
                          ] || 0) +
                          (sharingData.LandSharingData.Prior[
                            "25% Brgy. Share"
                          ] || 0) || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.LandSharingData.Prior["35% Prov’l Share"] ||
                        0
                      ).toFixed(2)}
                    </TableCell>
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.LandSharingData.Prior["35% Prov’l Share"] ||
                        0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.LandSharingData.Prior["40% Mun. Share"] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.LandSharingData.Prior["40% Mun. Share"] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.LandSharingData.Prior["25% Brgy. Share"] ||
                        0
                      ).toFixed(2)}
                    </TableCell>
                    {/* FISHERIES */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                  </TableRow>

                  {/* Penalties */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", paddingLeft: 4 }}
                    >
                      Penalties
                    </TableCell>
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (sharingData.LandSharingData.Penalties[
                          "35% Prov’l Share"
                        ] || 0) +
                          (sharingData.LandSharingData.Penalties[
                            "40% Mun. Share"
                          ] || 0) +
                          (sharingData.LandSharingData.Penalties[
                            "25% Brgy. Share"
                          ] || 0) || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.LandSharingData.Penalties[
                          "35% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.LandSharingData.Penalties[
                          "35% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.LandSharingData.Penalties[
                          "40% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.LandSharingData.Penalties[
                          "40% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.LandSharingData.Penalties[
                          "25% Brgy. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* FISHERIES */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                  </TableRow>

                  {/* Real Property Tax-SEF/Land */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      Real Property Tax-SEF/Land
                    </TableCell>
                    {Array.from({ length: 11 }).map((_, index) => (
                      <TableCell
                        key={index}
                        sx={{ border: "1px solid black" }}
                      />
                    ))}
                  </TableRow>
                  {/* Child items */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", paddingLeft: 4 }}
                    >
                      Current Year
                    </TableCell>
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (sharingData.sefLandSharingData.Current[
                          "50% Prov’l Share"
                        ] || 0) +
                          (sharingData.sefLandSharingData.Current[
                            "50% Mun. Share"
                          ] || 0) || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefLandSharingData.Current[
                          "50% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefLandSharingData.Current[
                          "50% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefLandSharingData.Current[
                          "50% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefLandSharingData.Current[
                          "50% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* FISHERIES */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                  </TableRow>

                  {/* Previous Years */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", paddingLeft: 4 }}
                    >
                      Previous Years
                    </TableCell>
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (sharingData.sefLandSharingData.Prior[
                          "50% Prov’l Share"
                        ] || 0) +
                          (sharingData.sefLandSharingData.Prior[
                            "50% Mun. Share"
                          ] || 0) || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefLandSharingData.Prior[
                          "50% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefLandSharingData.Prior[
                          "50% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefLandSharingData.Prior[
                          "50% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefLandSharingData.Prior[
                          "50% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* FISHERIES */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                  </TableRow>

                  {/* Penalties */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", paddingLeft: 4 }}
                    >
                      Penalties
                    </TableCell>
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (sharingData.sefLandSharingData.Penalties[
                          "50% Prov’l Share"
                        ] || 0) +
                          (sharingData.sefLandSharingData.Penalties[
                            "50% Mun. Share"
                          ] || 0) || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefLandSharingData.Penalties[
                          "50% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefLandSharingData.Penalties[
                          "50% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefLandSharingData.Penalties[
                          "50% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefLandSharingData.Penalties[
                          "50% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* FISHERIES */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                  </TableRow>

                  {/* Real Property Tax-Basic/Bldg. */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      Real Property Tax-Basic/Bldg.
                    </TableCell>
                    {Array.from({ length: 11 }).map((_, index) => (
                      <TableCell
                        key={index}
                        sx={{ border: "1px solid black" }}
                      />
                    ))}
                  </TableRow>
                  {/* Child items */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", paddingLeft: 4 }}
                    >
                      Current Year
                    </TableCell>
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (sharingData.buildingSharingData.Current[
                          "35% Prov’l Share"
                        ] || 0) +
                          (sharingData.buildingSharingData.Current[
                            "40% Mun. Share"
                          ] || 0) +
                          (sharingData.buildingSharingData.Current[
                            "25% Brgy. Share"
                          ] || 0) || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.buildingSharingData.Current[
                          "35% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.buildingSharingData.Current[
                          "35% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.buildingSharingData.Current[
                          "40% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.buildingSharingData.Current[
                          "40% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.buildingSharingData.Current[
                          "25% Brgy. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* FISHERIES */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                  </TableRow>

                  {/* Previous Years */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", paddingLeft: 4 }}
                    >
                      Previous Years
                    </TableCell>
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (sharingData.buildingSharingData.Prior[
                          "35% Prov’l Share"
                        ] || 0) +
                          (sharingData.buildingSharingData.Prior[
                            "40% Mun. Share"
                          ] || 0) +
                          (sharingData.buildingSharingData.Prior[
                            "25% Brgy. Share"
                          ] || 0) || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.buildingSharingData.Prior[
                          "35% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.buildingSharingData.Prior[
                          "35% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.buildingSharingData.Prior[
                          "40% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.buildingSharingData.Prior[
                          "40% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.buildingSharingData.Prior[
                          "25% Brgy. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* FISHERIES */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                  </TableRow>

                  {/* Penalties */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", paddingLeft: 4 }}
                    >
                      Penalties
                    </TableCell>
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (sharingData.buildingSharingData.Penalties[
                          "35% Prov’l Share"
                        ] || 0) +
                          (sharingData.buildingSharingData.Penalties[
                            "40% Mun. Share"
                          ] || 0) +
                          (sharingData.buildingSharingData.Penalties[
                            "25% Brgy. Share"
                          ] || 0) || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.buildingSharingData.Penalties[
                          "35% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.buildingSharingData.Penalties[
                          "35% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.buildingSharingData.Penalties[
                          "40% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.buildingSharingData.Penalties[
                          "40% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.buildingSharingData.Penalties[
                          "25% Brgy. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* FISHERIES */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                  </TableRow>

                  {/* Real Property Tax-SEF/Bldg. */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", fontWeight: "bold" }}
                    >
                      Real Property Tax-SEF/Bldg.
                    </TableCell>
                    {Array.from({ length: 11 }).map((_, index) => (
                      <TableCell
                        key={index}
                        sx={{ border: "1px solid black" }}
                      />
                    ))}
                  </TableRow>
                  {/* Child items */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", paddingLeft: 4 }}
                    >
                      Current Year
                    </TableCell>
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (sharingData.sefBuildingSharingData.Current[
                          "50% Prov’l Share"
                        ] || 0) +
                          (sharingData.sefBuildingSharingData.Current[
                            "50% Mun. Share"
                          ] || 0) || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefBuildingSharingData.Current[
                          "50% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefBuildingSharingData.Current[
                          "50% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefBuildingSharingData.Current[
                          "50% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefBuildingSharingData.Current[
                          "50% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* FISHERIES */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                  </TableRow>

                  {/* Previous Years */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", paddingLeft: 4 }}
                    >
                      Previous Years
                    </TableCell>
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (sharingData.sefBuildingSharingData.Prior[
                          "50% Prov’l Share"
                        ] || 0) +
                          (sharingData.sefBuildingSharingData.Prior[
                            "50% Mun. Share"
                          ] || 0) || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefBuildingSharingData.Prior[
                          "50% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefBuildingSharingData.Prior[
                          "50% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefBuildingSharingData.Prior[
                          "50% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefBuildingSharingData.Prior[
                          "50% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* FISHERIES */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                  </TableRow>

                  {/* Penalties */}
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ border: "1px solid black", paddingLeft: 4 }}
                    >
                      Penalties
                    </TableCell>
                    {/* TOTAL COLLECTIONS */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (sharingData.sefBuildingSharingData.Penalties[
                          "50% Prov’l Share"
                        ] || 0) +
                          (sharingData.sefBuildingSharingData.Penalties[
                            "50% Mun. Share"
                          ] || 0) || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefBuildingSharingData.Penalties[
                          "50% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefBuildingSharingData.Penalties[
                          "50% Prov’l Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefBuildingSharingData.Penalties[
                          "50% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        sharingData.sefBuildingSharingData.Penalties[
                          "50% Mun. Share"
                        ] || 0
                      ).toFixed(2)}
                    </TableCell>
                    {/* BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                    {/* FISHERIES */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    ></TableCell>
                  </TableRow>

                  {/* OVERALL TOTAL */}
                  <TableRow>
                    <TableCell align="left" sx={{ border: "1px solid black" }}>
                      TOTAL
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {totalOverAllAmount.toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {totalOverAllAmountNational.toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL NATIONAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {totalOverAllProvGFAmount.toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL PROVINCIAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (sharingData.sefLandSharingData.Current[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefLandSharingData.Prior[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefLandSharingData.Penalties[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Current[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Prior[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Penalties[
                          "50% Prov’l Share"
                        ] || 0)
                      ).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL PROVINCIAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (sharingData.LandSharingData.Current[
                          "35% Prov’l Share"
                        ] || 0) +
                        (sharingData.LandSharingData.Prior[
                          "35% Prov’l Share"
                        ] || 0) +
                        (sharingData.LandSharingData.Penalties[
                          "35% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefLandSharingData.Current[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefLandSharingData.Prior[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefLandSharingData.Penalties[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.buildingSharingData.Current[
                          "35% Prov’l Share"
                        ] || 0) +
                        (sharingData.buildingSharingData.Prior[
                          "35% Prov’l Share"
                        ] || 0) +
                        (sharingData.buildingSharingData.Penalties[
                          "35% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Current[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Prior[
                          "50% Prov’l Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Penalties[
                          "50% Prov’l Share"
                        ] || 0)
                      ).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL PROVINCIAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {totalOverAllMunGFAmount}
                    </TableCell>{" "}
                    {/* TOTAL MUNICIPAL GENERAL FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (sharingData.sefLandSharingData.Current[
                          "50% Mun. Share"
                        ] || 0) +
                        (sharingData.sefLandSharingData.Prior[
                          "50% Mun. Share"
                        ] || 0) +
                        (sharingData.sefLandSharingData.Penalties[
                          "50% Mun. Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Current[
                          "50% Mun. Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Prior[
                          "50% Mun. Share"
                        ] || 0) +
                        (sharingData.sefBuildingSharingData.Penalties[
                          "50% Mun. Share"
                        ] || 0)
                      ).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL MUNICIPAL SPECIAL EDUC. FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {tfdata.building_trust_15.toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL MUNICIPAL TRUST FUND */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {totalOverMunAllAmount.toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL MUNICIPAL TOTAL */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {(
                        (tfdata.diving_brgy_30 || 0) +
                        (sharingData.LandSharingData.Current[
                          "25% Brgy. Share"
                        ] || 0) +
                        (sharingData.LandSharingData.Prior["25% Brgy. Share"] ||
                          0) +
                        (sharingData.LandSharingData.Penalties[
                          "25% Brgy. Share"
                        ] || 0) +
                        (sharingData.buildingSharingData.Current[
                          "25% Brgy. Share"
                        ] || 0) +
                        (sharingData.buildingSharingData.Prior[
                          "25% Brgy. Share"
                        ] || 0) +
                        (sharingData.buildingSharingData.Penalties[
                          "25% Brgy. Share"
                        ] || 0)
                      ).toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL BARANGAY SHARE */}
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      align="center"
                    >
                      {tfdata.diving_fishers_30.toFixed(2)}
                    </TableCell>{" "}
                    {/* TOTAL FISHERIES */}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>


            {/* Signature Section - Perfect Alignment */}
            <Box sx={{ p: 4, position: "relative" }}>
             

              <Grid container spacing={0}>
                {/* PREPARED BY section */}
                <Grid item xs={6}>
                  <Box
                    sx={{
                      position: "relative",
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    >
                      PREPARED BY:
                    </Typography>

                    <Box
                      sx={{
                        position: "absolute",
                        top: 40,
                        left: 110,
                        textAlign: "left",
                      }}
                    >
                      <Typography variant="body1" fontWeight="bold">
                        RICHER T. ALANANO
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          color: "text.secondary",
                          pl: 4,
                        }}
                      >
                        CASUAL-IT
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* CERTIFIED CORRECT section */}
                <Grid item xs={6}>
                  <Box
                    sx={{
                      position: "relative",
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    >
                      CERTIFIED CORRECT:
                    </Typography>

                    <Box
                      sx={{
                        position: "absolute",
                        top: 40,
                        left: 170,
                        textAlign: "left",
                      }}
                    >
                      <Typography variant="body1" fontWeight="bold">
                        PAUL REE AMBROSE A. MARTINEZ
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          color: "text.secondary",
                          pl: 8,
                        }}
                      >
                        Municipal Treasurer
                      </Typography>
                    </Box>
                  </Box>
                  
                </Grid>
              </Grid>

              {/* Signature Lines */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 10,
                  px: 8,
                }}
              >
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
      {/* Printable Area Ends Here */}

      {/* Print Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          mb: 4,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textTransform: "none",
            borderRadius: "12px",
            padding: "10px 20px",
            fontWeight: 600,
            "&:hover": { backgroundColor: "secondary.main" },
          }}
          startIcon={<PrintIcon />}
        >
          PRINT
        </Button>

        <Button
          variant="outlined"
          color="success"
          onClick={handleDownloadExcel}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textTransform: "none",
            borderRadius: "12px",
            padding: "10px 20px",
            fontWeight: 600,
            "&:hover": { backgroundColor: "success.light" },
          }}
          startIcon={<FileDownloadIcon />}
        >
          Download to Excel
        </Button>
      </Box>
    </>
  );
}



export default Collection;
