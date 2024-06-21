export const emitEventNotification = async ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications.");
    return;
  }

  Notification.requestPermission().then((perm) => {
    if (perm === "granted") {
      new Notification(title, {
        body: description,
        icon: "/assets/logo.png",
      });
    } else {
      console.log("Permission denied");
    }
  });
};

export const createAccountSuccessEmail = async (email: string) => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_NOTIFICATION_ENDPOINT
      }/createAccount?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("ACCOUNT CREATED:", data);
      return true;
    } else {
      const errorData = await response.json();
      console.log("ERROR:", errorData);
      return false;
    }
  } catch (error) {
    console.log("ERROR SENDING SUCCESS EMAIL:", error);
    return false;
  }
};

export const createEventSuccessEmail = async (
  email: string,
  eventTitle: string,
  location: string
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NOTIFICATION_ENDPOINT}/createEvent`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          eventTitle,
          location,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("EVENT CREATED:", data);
      return true;
    } else {
      const errorData = await response.json();
      console.log("ERROR:", errorData);
      return false;
    }
  } catch (error) {
    console.log("ERROR CREATING EVENT:", error);
    return false;
  }
};
