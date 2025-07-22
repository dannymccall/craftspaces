"use client";

import React, { useState } from "react";
import AllNotifications from "@/app/components/notifications/AllNotifications";
import { Notification } from "@/app/lib/types/Notifications";
import { useFetch } from "@/app/hooks/useFetch";

const Notifications = () => {
  const {
    data: notifications,
    loading,
    error,
    totalPages,
    currentPage,
    hasLoaded,
    setPage,
    query,
    handleSearch,
    refetch,
  } = useFetch<Notification>({
    uri: "/api/users/auth",
    service: "fetchNotifications",
  });
  return (
    <div className="py-20">
      <AllNotifications notifications={notifications} onMarkAsRead={refetch}/>
    </div>
  );
};

export default Notifications;
