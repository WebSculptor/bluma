"use client";

import { Button } from "@/components/ui/button";
import icon from "@/public/assets/logo.png";

export default function ProfilePage() {
  const handleNotification = () => {
    Notification.requestPermission().then((perm) => {
      if (perm === "granted") {
        new Notification("Confirmed transaction", {
          body: "Transaction has been confirmed, your account has been created!",
          icon: "/assets/logo.png",
          silent: false,
          vibrate: [200, 100, 200],
        });
      }
    });
  };

  return (
    <div>
      <Button onClick={handleNotification}>Click</Button>
    </div>
  );
}
