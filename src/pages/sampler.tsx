import * as React from "react"
import OfferLandingPage, { Offer } from "../components/OfferLandingPage"
import offers from "../data/offers.json"

export default function SamplerPage() {
  return <OfferLandingPage offer={offers.sampler as unknown as Offer} />
}
