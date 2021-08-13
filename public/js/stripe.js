/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";
const stripe = Stripe(
  "pk_test_51JO10jIw3P4HizgIqLgfPdECOWPRv2p3UuQrtTCAtm4P6GmpWoxDG5PcXsTTMr9Rh7sk6cUNHJYNAV8k5VcxNcOM00UUKiKwmC"
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from APIFeatures
    const session = await axios(
      `https://localhost:9000/api/v1/bookings/checkout-session/${tourId}`
    );
    // 2) Create checkout from + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
