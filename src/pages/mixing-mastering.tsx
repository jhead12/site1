import * as React from "react"
import OfferLandingPage, { Offer } from "../components/OfferLandingPage"
import offers from "../data/offers.json"

export default function MixingMasteringPage() {
  return <OfferLandingPage offer={offers["mixing-mastering"] as unknown as Offer} />
}
