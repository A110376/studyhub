const currentYear = 2025; // Aap yeh har saal update kar sakte hain

// function to get last 5 years including current
const getLastFiveYears = () => {
  const years = [];
  for (let y = currentYear; y > currentYear - 5; y--) {
    years.push(y);
  }
  return years;
};

// subjects list jisme hum sab ka data banayenge
const subjects = [
  "lecturer-english",
  "lecturer-urdu",
  "lecturer-islamiyat",
  "lecturer-physics",
  "lecturer-chemistry",
  "lecturer-biology",
  "lecturer-mathematics",
  "assistant",
  "junior-clerk",
  "naib-qasid",
  "patwari",
  "police-constable",
  " Assistant Sub Inspector",
  "civil-judge",
  "stenotypist",
  "Assistant Private Secretary",
  "veterinary-officer",
  "health-technician",
];

// object mapping for display names (optional, can skip and use keys as is)
const papersData = {};

subjects.forEach((subject) => {
  // Capitalize first letter and replace dashes with spaces for display key
  const displayName = subject
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  papersData[displayName] = getLastFiveYears().map((year) => ({
    year,
    url: `/papers/${subject}/${year}.pdf`,
  }));
});

export default papersData;
