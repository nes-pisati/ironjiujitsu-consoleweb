import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";

type LabelStateProps = {
  date: Date | null; 
  feminine?: boolean;
};

const StateLabel: React.FC<LabelStateProps> = ({ date, feminine = false }) => {
  const style = "flex items-center gap-2 px-2 py-1 rounded-xl";
  let icon = faClock;
  let text = "Assente";
  let bgColor = "bg-yellow-500";

  if (date) {
    const today = new Date();
    const startDate = new Date(date);

    const isActive = startDate >= today; 

    if (isActive) {
      icon = faCheck;
      text = feminine ? "attiva" : "attivo";
      bgColor = "bg-black";
    } else {
      icon = faXmarkCircle;
      text = feminine ? "scaduta" : "scaduto";
      bgColor = "bg-red-500";
    }
  }

  return (
    <div className={`${style} ${bgColor}`}>
      <FontAwesomeIcon icon={icon} size="xs" color="white" />
      <p className="text-xs text-white">{text}</p>
    </div>
  );
};

export default StateLabel;
