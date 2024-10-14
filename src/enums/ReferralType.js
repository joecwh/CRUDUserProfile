// ReferralType.js
const ReferralType = {
    None: 0,
    Friend: 1,
    Advertisement: 2,
    SocialMedia: 3,
    Others: 4,
  };
  
  // Create a mapping for display names
  const ReferralTypeDisplay = {
    [ReferralType.None]: 'None',
    [ReferralType.Friend]: 'Friend',
    [ReferralType.Advertisement]: 'Advertisement',
    [ReferralType.SocialMedia]: 'Social Media',
    [ReferralType.Others]: 'Others',
  };
  
  export { ReferralType, ReferralTypeDisplay };
  