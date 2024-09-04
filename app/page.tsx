import VotingFeature from "@/components/voting/voting-feature";
import { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    "dscvr:canvas:version": "vNext",
    "og:image": "https://my-canvas.com/preview-image.png",
  },
};
export default function Page() {
  return <VotingFeature />;
}
