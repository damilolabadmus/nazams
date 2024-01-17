import React, { useEffect, useState } from "react";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
const usePosition = () => {
  const [position, setPosition] = useState(null);
  const [locationHas, setLocationHas] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";
  let foregroundSubscription = null;
  let isMounted = true;
  // Request permissions right after starting the app
  const requestPermissions = async () => {
    const foreground = await Location.requestForegroundPermissionsAsync();
    if (foreground.granted) {
      const granted = await Location.requestBackgroundPermissionsAsync();
      // console.log(granted, "granted background request");
    }
  };

  useEffect(() => {
    return () => {
      isMounted = false;
    };
  }, []);

  // Define the background task for location tracking
  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      // Extract location coordinates from data
      const { locations } = data;
      const location = locations[0];
      if (location) {
        // console.log(location, "ondiscord", locationHas);
        if (isMounted) {
          setPosition(location.coords);
        }
      }
    }
  });
  // Start location tracking in foreground
  const startForegroundUpdate = async () => {
    // Check if foreground permission is granted
    // setLocationHas(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // alert("Permission to access location was denied");
        return;
      }

      const { granted } = await Location.getForegroundPermissionsAsync();
      if (!granted) {
        // alert("location tracking denied foreground");
        return;
      }

      // Make sure that foreground location tracking is not running
      foregroundSubscription?.remove();

      // Start watching position in real-time
      foregroundSubscription = await Location.watchPositionAsync(
        {
          // For better logs, we set the accuracy to the most sensitive option
          accuracy: Location.Accuracy.BestForNavigation,
        },
        (location) => {
          if (isMounted) {
            setPosition(location.coords);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Start location tracking in background
  const startBackgroundUpdate = async () => {
    // Don't track position if permission is not granted
    const { granted } = await Location.getBackgroundPermissionsAsync();
    if (!granted) {
      // alert("location tracking denied background");
      return;
    }

    // Make sure the task is defined otherwise do not start tracking
    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    if (!isTaskDefined) {
      // console.log("Task is not defined");
      return;
    }

    // Don't track if it is already running in background
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      // console.log("Already started");
      return;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      // For better logs, we set the accuracy to the most sensitive option
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 10,
      timeInterval: 10000,
      // Make sure to enable this notification if you want to consistently track in the background
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Location",
        notificationBody: "Location tracking in background",
        notificationColor: "#fff",
      },
    });
  };

  // Stop location tracking in foreground
  const stopForegroundUpdate = () => {
    setPosition(null);
    // setLocationHas(false);
    foregroundSubscription?.remove();
    // console.log("Location tacking stopped front");
  };
  // Stop location tracking in background
  const stopBackgroundUpdate = async () => {
    setPosition(null);
    // setLocationHas(false);

    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  };
  return {
    position,
    stopBackgroundUpdate,
    startBackgroundUpdate,
    stopForegroundUpdate,
    startForegroundUpdate,
    requestPermissions,
  };
};

export default usePosition;
