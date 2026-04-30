import { Box, Typography } from "@mui/material";

const TitleCountry = ({
  title,
  headerTitleFont,
}: {
  title: string;
  headerTitleFont?: string;
}) => {
  return (
    <>
      <Box id="target-scroll" className="header-title" textAlign="center">
        <Typography
          variant="h1"
          className="section-spacing"
          sx={{
            textTransform: "uppercase",
            color: "primary.dark",
            mt: { xs: 8, xl: 4 },

            fontSize: {
              xs: "3rem",
              md: "6rem",
            },
            ...(headerTitleFont && { fontFamily: headerTitleFont }),
          }}
        >
          {title}
        </Typography>
      </Box>

      <Box />
    </>
  );
};

export default TitleCountry;
