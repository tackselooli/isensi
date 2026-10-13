import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClasses } from "../../../../features/classes/classesThunks";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Collapse,
  CardMedia,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";

const DashboardClasses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classesState = useSelector((state) => state.classes);
  const user = useSelector((state) => state.auth.user);

  const [isExpanded, setIsExpanded] = useState(null); // Track which card is expanded
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [sortOrder, setSortOrder] = useState("name"); // Sort order state

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 8; // Adjusted to show 8 cards per page

  useEffect(() => {
    // Use optional chaining — `user` may be null briefly during auth bootstrap.
    dispatch(fetchClasses(user?.token));
  }, [dispatch, user?.token]);

  const handleEditClass = (classId) => {
    navigate(`/dashboard/edit-class/${classId}`);
  };

  const handleDeleteClass = (classId) => {
    console.log(`Deleting class with ID: ${classId}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(classesState.classes.length / classesPerPage);
  const startIndex = (currentPage - 1) * classesPerPage;
  const currentClasses = classesState.classes.slice(
    startIndex,
    startIndex + classesPerPage
  );

  // Search and filter classes
  const filteredClasses = classesState.classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort classes
  const sortedClasses = filteredClasses.sort((a, b) => {
    if (sortOrder === "price") {
      return a.price - b.price;
    }
    if (sortOrder === "date") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return a.name.localeCompare(b.name);
  });

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  const getShortDescription = (description) => {
    const maxLength = 100; // Set a maximum length for the short description
    if (description.length > maxLength) {
      return `${description.slice(0, maxLength)}...`;
    }
    return description;
  };

  if (classesState.status === "loading") {
    return (
      <div className="text-center py-10 text-lg text-blue-600">
        در حال بارگذاری...
      </div>
    );
  }

  if (classesState.status === "failed") {
    return (
      <div className="text-center py-10 text-lg text-red-600">
        خطا: {classesState.error}
      </div>
    );
  }

  if (!classesState.classes || classesState.classes.length === 0) {
    return (
      <div className="text-center py-10 text-lg text-red-600">
        هیچ کلاسی یافت نشد.
      </div>
    );
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="20px"
      >
        {/* Search and Filter Section */}
        <Box display="flex" alignItems="center" mb="20px">
          <TextField
            variant="outlined"
            size="small"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              // Add margin to the search icon
              endAdornment: <SearchIcon sx={{ marginLeft: 1 }} />,
            }}
            sx={{ mr: 2 }}
          />
        </Box>
        <Typography
          variant="h3"
          align="center"
          color={theme.palette.main}
          gutterBottom
          sx={{ p: 3 }}
        >
          مدیریت کلاس‌ها
        </Typography>
        <Tooltip title="Add New Class">
          <IconButton
            color="primary"
            onClick={() => navigate("/dashboard/add-class")}
          >
            <AddIcon sx={{ fontSize: 25 }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))" // Adjusted to fit 4 cards per row
        justifyContent="space-between"
        rowGap="20px"
        columnGap="1.33%"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        {sortedClasses.length === 0 ? (
          <Box
            gridColumn="span 4"
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <Typography variant="h6" color="textSecondary">
              هیچ کلاسی یافت نشد.
            </Typography>
          </Box>
        ) : (
          sortedClasses
            .slice(startIndex, startIndex + classesPerPage)
            .map((cls, index) => (
              <Card
                key={cls._id}
                sx={{
                  backgroundColor: theme.palette.background.alt,
                  borderRadius: "0.55rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Thumbnail */}
                <CardMedia
                  component="img"
                  image={cls.image || "https://via.placeholder.com/300x200"} // Using cls.image for the thumbnail
                  alt={cls.name}
                  sx={{
                    height: 140, // Set a fixed height
                    width: "100%", // Full width
                    objectFit: "cover", // Maintain aspect ratio and cover the area
                  }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color={theme.palette.secondary[300]}
                    gutterBottom
                  >
                    {cls.difficultyLevel}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {cls.name}
                  </Typography>
                  <Typography
                    sx={{ mb: "1.5rem" }}
                    color={theme.palette.secondary[300]}
                  >
                    {cls.price ? `${cls.price} تومان` : "رایگان"}
                  </Typography>
                  <Typography variant="body2">
                    {isExpanded === index
                      ? cls.description
                      : getShortDescription(cls.description)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      setIsExpanded(isExpanded === index ? null : index)
                    }
                  >
                    {isExpanded === index ? "See Less" : "See More"}
                  </Button>
                </CardActions>
                <Collapse
                  in={isExpanded === index}
                  timeout="auto"
                  unmountOnExit
                  sx={{
                    color: theme.palette.neutral[300],
                  }}
                >
                  <CardContent>
                    <Typography>Instructor: {cls.instructorName}</Typography>
                    <Typography>Audience: {cls.targetAudience}</Typography>
                    <Typography>Package Goals: {cls.packageGoals}</Typography>
                    <Typography>Format: {cls.packageFormat}</Typography>
                    <Typography>Duration: {cls.packageDuration}</Typography>
                    <Typography>
                      Access Duration: {cls.accessDuration}
                    </Typography>

                    {cls.equipmentRequired?.length > 0 && (
                      <Typography>
                        Equipment Required: {cls.equipmentRequired.join(", ")}
                      </Typography>
                    )}
                    {cls.videoLink && (
                      <Button
                        variant="contained"
                        color="info"
                        href={cls.videoLink}
                        target="_blank"
                        sx={{ mt: 2 }}
                      >
                        Watch Intro Video
                      </Button>
                    )}

                    <Box
                      mt="1rem"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleEditClass(cls._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteClass(cls._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Collapse>
              </Card>
            ))
        )}
      </Box>

      {/* Pagination controls */}
      <Box display="flex" justifyContent="center" mt="20px">
        <Button
          variant="contained"
          color="primary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          قبلی
        </Button>
        <Typography variant="body1" sx={{ mx: 2 }}>
          {currentPage} / {totalPages}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          sx={{ mr: 2 }}
        >
          بعدی
        </Button>
      </Box>
    </Box>
  );
};

export default DashboardClasses;
