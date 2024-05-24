import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Rating,
  Button,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";

const BusinessDetail = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/v3/businesses/${id}`, {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_YELP_API_KEY}`,
          },
        });

        setBusiness(response.data);
        setLoading(false);

        const reviewsResponse = await axios.get(
          `/v3/businesses/${id}/reviews`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_YELP_API_KEY}`,
            },
          }
        );

        setReviews(reviewsResponse.data.reviews);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchBusinessDetail();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!business) {
    return <Typography variant="h4">Business not found</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4">{business.name}</Typography>
      {business.photos && business.photos.length > 0 ? (
        <Carousel>
          {business.photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={business.name}
              style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
            />
          ))}
        </Carousel>
      ) : (
        <Typography variant="body1">No photos available</Typography>
      )}
      <Rating value={business.rating} readOnly />
      <Typography variant="body1">{business.review_count} reviews</Typography>
      <Button
        variant="contained"
        color="primary"
        href={`https://www.google.com/maps/search/?api=1&query=${business.coordinates.latitude},${business.coordinates.longitude}`}
        target="_blank"
      >
        See on Google Maps
      </Button>
      <Box mt={2}>
        <Typography variant="h6">Reviews:</Typography>
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <Box key={review.id} mb={2}>
              <Typography variant="subtitle1">{review.user.name}</Typography>
              <Rating value={review.rating} readOnly />
              <Typography variant="body2">{review.text}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body1">No reviews available</Typography>
        )}
      </Box>
    </Box>
  );
};

export default BusinessDetail;
