export interface RawSchool {
  province_name: string;
  city_name: string;
  district: string;
  npsn: string;
  school_name: string;
  stage: string;
  status: string;
  street_name: string;
  lat: number;
  long: number;
}

export interface School {
  npsn: string;
  name: string;
  stage: string;
  status: string;
  province: string;
  city: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
}
