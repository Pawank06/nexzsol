import { MaintainerDashboardNav } from "./components/dashboardNav";
import { Manrope } from "next/font/google";

const manrop = Manrope({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className={manrop.className}>
        <MaintainerDashboardNav>
          {children}
        </MaintainerDashboardNav>
      </div>
  );
}




