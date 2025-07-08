import Image from "next/image";
import MapComp from "./MapComp";
// import { GoogleMap, Marker, useLoadScript, Circle, StandaloneSearchBox } from "@react-google-maps/api";
export default function Home() {
  const url = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&callback=console.debug&libraries=maps,marker&v=beta`
  
  return (
    // <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    // <script async src={url}></script>
    
    //   {/* <gmp-map center="47.6412239074707,26.243818283081055" zoom="14" map-id="DEMO_MAP_ID">
    //     <gmp-advanced-marker position="47.6412239074707,26.243818283081055" title="My location"></gmp-advanced-marker>
    //   </gmp-map> */}
    // </div>
    <MapComp />
  );
}
