
export interface Review {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
}

export interface CarRental {
  id: string;
  district: string;
  model: string;
  brand: string;
  year: number;
  seats: number;
  condition: string;
  morningPrice: number;
  eveningPrice: number;
  deposit: number;
  companyName: string;
  companyColor: 'red' | 'green' | 'blue';
  websiteUrl: string;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  topReview: Review;
  taxiType: '紅的' | '綠的' | '藍的';
  ageRange: string;
  tagline: string;
  isVerifiedStore: boolean;
  distanceKm: number;
}

export interface FilterState {
  onlyTopRated: boolean;
  location: string;
  pickupDate: string;
  returnDate: string;
  shift: '早更' | '晚更' | '特更';
  brands: string[];
  categories: string[];
  features: string[];
  specs: string[];
  ageRanges: string[];
  taxiTypes: string[];
}