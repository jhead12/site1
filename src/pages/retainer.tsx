import * as React from "react"
import OfferLandingPage, { Offer } from "../components/OfferLandingPage"
import offers from "../data/offers.json"

export default function RetainerPage() {
  return <OfferLandingPage offer={offers.retainer as unknown as Offer} />
}
