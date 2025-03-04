export const mapTargetToEnglish = (target) => {
  const mapping = {
    유아: "infant",
    초등학생: "elementary",
    중고등학생: "teenager",
    성인: "adult",
  };
  return mapping[target] || target;
};

export const mapTimeToMinutes = (time) => {
  return time === "30분" ? 30 : 60;
};
