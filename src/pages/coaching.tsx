import * as React from "react"
import OfferLandingPage, { Offer } from "../components/OfferLandingPage"
import offers from "../data/offers.json"

export default function CoachingPage() {
  return <OfferLandingPage offer={offers.coaching as unknown as Offer} />
}
