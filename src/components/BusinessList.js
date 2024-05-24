import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchFilter from "./SearchFilter";
import { Link } from "react-router-dom";
import {
  Pagination,
  CircularProgress,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  MenuItem,
  FormControl,
  Rating,
  Select,
} from "@mui/material";

const API_URL = "/v3/businesses/search";

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [term, setTerm] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("New York");
  const [sortBy, setSortBy] = useState("best_match");

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_YELP_API_KEY}`,
          },
          params: {
            term,
            name,
            location,
            limit: 10,
            offset: (page - 1) * 10,
            sort_by: sortBy,
          },
        });
        console.log("API Response:", response.data);
        if (response.data.businesses && response.data.businesses.length > 0) {
          setBusinesses(response.data.businesses);
          setTotalPages(Math.ceil(response.data.total / 10));
        } else {
          setBusinesses([]);
          setTotalPages(0);
        }
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching data from API:",
          error.response ? error.response.data : error.message
        );
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [page, term, name, location, sortBy]);

  return (
    <Box>
      <Box mb={2}>
        <FormControl>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            displayEmpty
          >
            <MenuItem value="best_match">Best Match</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="review_count">Review Count</MenuItem>
            <MenuItem value="distance">Distance</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <SearchFilter
        setTerm={setTerm}
        setName={setName}
        setLocation={setLocation}
      />
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box mt={4}>
          {businesses.length > 0 ? (
            businesses.map((business) => (
              <Card key={business.id} sx={{ display: "flex", mb: 2 }}>
                {business.image_url && (
                  <CardMedia
                    component="img"
                    sx={{ width: 151 }}
                    image={business.image_url}
                    alt={business.name}
                  />
                )}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <CardContent>
                    <Link
                      to={`/business/${business.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Typography component="h5" variant="h5">
                        {business.name}
                      </Typography>
                      <Rating value={business.rating} readOnly />
                      <Typography variant="subtitle1" color="text.secondary">
                        {business.rating} ({business.review_count} reviews)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Address: {business.location.address1}
                      </Typography>
                    </Link>
                  </CardContent>
                </Box>
              </Card>
            ))
          ) : (
            <Typography variant="body1">No businesses found</Typography>
          )}
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              sx={{ mt: 4, display: "flex", justifyContent: "center" }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default BusinessList;
