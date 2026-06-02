import { LogIn } from "lucide-react";
import { OverviewCard } from "./OverviewCard";
import { WelcomeLine } from "./WelcomeLine";

export function Dashboard({ role }) {
  return (
    <>
      {role == "mangaka" && (
        <>
          <WelcomeLine roleName={role} />
          <div className="grid grid-cols-2 gap-6 w-full" >
            <OverviewCard iconName={<LogIn color="#ebbfff" size={50} />} iconColor="bg-[#c8b4d1]" contentText="Assigned series" valueNum={3} />
            <OverviewCard iconName={<LogIn color="#ebbfff" size={50} />} iconColor="bg-[#c8b4d1]" contentText="Assigned series" valueNum={3} />
          </div>
        </>)
      }
    </>
  )
}