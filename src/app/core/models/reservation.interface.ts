// export interface Reservation {
//   id: number;
//   first_name: string;
//   start_date: string;
//   last_name: string;
//   end_date: string;
//   email: string;
//   building: string;
//   document_type: string;
//   reservation_type_id: number;
// }

export interface ReservationDto {
  start_date: string;
  end_date: string;
  first_name: string;
  last_name: string;
  email: string;
  created_by: number;
  reservation_reference: string;
  reservation_type: number;
  legal_id: string;
  document_type: number;
  phone: string;
  building: number;
}

export interface ReservationType {
  id: number;
  external_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  delete_at: null;
  name: string;
  building: null;
  type_catalogs: any[];
}

export interface Reservation {
  id: number;
  external_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  delete_at: null;
  reservation_reference: string;
  reservation_type_id: number;
  reservation_type_catalog_id: null;
  status: number;
  start_date: string;
  real_start_date: null;
  end_date: string;
  real_end_date: null;
  user_id: null;
  badge_id: null | number;
  badge_card_id: null;
  parking_stall_id: null | number;
  parking_lot_section_id: null;
  created_by_id: number;
  document_type_id: null | number;
  legal_id: null | string;
  first_name: string;
  last_name: string;
  fullname?: string;
  email: string;
  phone: string;
  person_to_visit_id: null | number;
  qr_code: string;
  qr_register_code: null | string;
  car_plate: null | string;
  vehicle_type: null | number;
  badge_vehicle_id: null;
  building_id: number;
  departament_id: null;
  division_id: null;
  duration: null;
  visitor_id: null | number;
  has_vehicle: boolean;
  confirmed: boolean;
  confirmed_sent: boolean;
  is_disability: boolean;
  is_recurrent: boolean;
  recurrence_end: null;
  parent_id: null;
  need_wifi_pass: boolean;
  need_sms_pass: boolean;
  skip_pre_register: boolean;
  controller: null | string;
  alpr_authentication: boolean;
  reservation_type_catalog: string | number;
}
