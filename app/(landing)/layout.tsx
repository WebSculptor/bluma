// "use client";

import Footer from "@/components/shared/footer";
import React from "react";

export default function LandingPageLayout({ children }: ILayout) {
  // console.log(
  //   "\n\n               :*#*:                :*#*:\n             :%@@@@@#.            .#@@@@@%.\n            *@@@@@@@@@*.        .*@@@@@@@=+=\n          *@@@@@@@@@@@@@*      *@@@@@@@=.=+++-\n        =@@@@@@@=.+@@@@@@@=  =@@@@@@@+  +++++++:\n      =@@@@@@@*.    *@@@%: =@@@@@@@*.    -+++++++:\n    :@@@@@@@#.       .#- :@@@@@@@%.       .=++++++=.\n    %@@@@@%:           .%@@@@@@%.           .=+++++=\n    :@@@@@@@#.       .#@@@@@@@:            =+++++++.\n      =@@@@@@@*     *@@@@@@@=            -+++++++:\n        +@@@@@@@  +@@@@@@@+            :+++++++-\n          *@@@@:=@@@@@@@*            :+++++++=\n           .#@=@@@@@@@#.            =++++++=\n             :%@@@@@%:             .+++++=.\n               :*%*:                .-==.\n\n"
  // );
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col">
        {children}
        <Footer />
      </div>
    </div>
  );
}