import { redirect } from "next/navigation";

/** Internal dropship notes stay in docs/. This URL used to list booth freight. */
export default function FulfillmentPage() {
  redirect("/shipping");
}
