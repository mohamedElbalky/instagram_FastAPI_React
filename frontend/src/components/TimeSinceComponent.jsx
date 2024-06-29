import React, { useEffect, useState } from 'react';


function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}



const TimeSinceComponent = ({ date }) => {
  const [timeSinceStr, setTimeSinceStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTimeSinceStr(timeSince(new Date(date)));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [date]);

  return <small>created from: {timeSinceStr}</small>;
};

export default TimeSinceComponent;