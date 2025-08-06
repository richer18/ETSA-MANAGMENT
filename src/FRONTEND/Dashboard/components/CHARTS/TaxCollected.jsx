import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import {
  Box,
  Card,
  Fade,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SparkLineChart } from "@mui/x-charts";
import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";

// 🌅 New Sunset Color Gradient
const gradient = "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)";

function TaxCollected() {
  const [sparkData, setSparkData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { animatedTotal } = useSpring({
    from: { animatedTotal: 0 },
    to: { animatedTotal: total },
    config: { tension: 100, friction: 24 },
    reset: true,
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthColors = [
    "#f94144", // Jan
    "#f3722c", // Feb
    "#f8961e", // Mar
    "#f9844a", // Apr
    "#f9c74f", // May
    "#90be6d", // Jun
    "#43aa8b", // Jul
    "#4d908e", // Aug
    "#577590", // Sep
    "#277da1", // Oct
    "#9d4edd", // Nov
    "#ff6d00", // Dec
  ];

  useEffect(() => {
    axiosInstance
      .get("/tax/monthly")
      .then((res) => {
        const values = res.data.map((item) => item.value);
        setSparkData(values);
        setTotal(values.reduce((sum, val) => sum + val, 0));
      })
      .catch((err) => console.error("API error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card
      sx={{
        p: isMobile ? 2 : 3,
        borderRadius: "20px",
        background: gradient,
        color: "white",
        boxShadow: "0 10px 32px rgba(0,0,0,0.15)",
        transition: "all 0.4s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        maxWidth: isMobile ? "100%" : 350,
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-40%",
          right: "-40%",
          width: "160%",
          height: "160%",
          background: "rgba(255,255,255,0.06)",
          transform: "rotate(30deg)",
          transition: "all 0.6s ease",
        },
        "&:hover::before": {
          transform: "rotate(30deg) translate(20%, 20%)",
        },
      }}
    >
      {/* Title + Value */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Box display="flex" alignItems="center" gap={0.8}>
            <AccountBalanceIcon fontSize="small" sx={{ opacity: 0.9 }} />
            <Typography
              variant="overline"
              sx={{
                opacity: 0.85,
                letterSpacing: "0.08em",
                fontWeight: 600,
              }}
            >
              Tax Collected
            </Typography>
          </Box>

          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: 800,
              fontSize: isMobile ? "1.75rem" : "2rem",
              lineHeight: 1.3,
              mt: 1,
            }}
          >
            {loading ? (
              "Loading..."
            ) : (
              <animated.span>
                {animatedTotal.to(
                  (val) =>
                    `₱ ${val.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}`
                )}
              </animated.span>
            )}
          </Typography>
        </Box>

        {/* Watermark Icon */}
        <Box
          sx={{
            opacity: 0.1,
            position: "absolute",
            top: 16,
            right: 20,
            "& svg": {
              fontSize: "4rem",
            },
          }}
        >
          <AccountBalanceIcon />
        </Box>
      </Box>

      {/* Sparkline */}
      <Box mt={3} borderRadius={1.5} overflow="hidden">
        {loading ? (
          <Skeleton variant="rounded" height={60} />
        ) : (
          <Fade in timeout={600}>
            <Box>
              <SparkLineChart
                data={sparkData}
                width={isMobile ? 220 : 260}
                height={60}
                area
                showTooltip
                showHighlight
                xAxis={{
                  scaleType: "point",
                  data: months,
                  valueFormatter: (v) => v,
                  pointColor: monthColors,
                }}
                highlightScope={{ highlighted: "item", faded: "global" }}
                color="#ffffff"
                areaGradient={{
                  from: "rgba(255,255,255,0.4)",
                  to: "transparent",
                }}
                valueFormatter={(val) =>
                  `₱ ${val.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}`
                }
                margin={{ top: 6, bottom: 6 }}
                disableClipping
              />
            </Box>
          </Fade>
        )}
      </Box>
    </Card>
  );
}

export default TaxCollected;
