
export const educationHierarchy = {
  "hs_min_exp": ["hs_min_exp"],
  "bachelor_min_exp": ["hs_min_exp", "bachelor_min_exp"],
  "master_min_exp": ["hs_min_exp", "bachelor_min_exp", "master_min_exp"],
};

export const educationOptions = [
  { value: "hs_min_exp", label: "High School" },
  { value: "bachelor_min_exp", label: "Bachelor" },
  { value: "master_min_exp", label: "Master" },
];

export const getLogoFilenames = () => {
  const requireLogo = require.context('../../public/logo', false, /\.(png|jpe?g|svg)$/);
  return requireLogo.keys().map(requireLogo).map(filePath => {
    const fileName = filePath.split('/').pop(); // Get the file name with hash
    const [agencyName] = fileName.split('.'); // Extract the agency name before the first dot
    return agencyName;
  })
};
