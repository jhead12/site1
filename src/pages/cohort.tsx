import * as React from "react"
import OfferLandingPage, { Offer } from "../components/OfferLandingPage"
import offers from "../data/offers.json"

export default function CohortPage() {
  return <OfferLandingPage offer={offers.cohort as unknown as Offer} />
}
