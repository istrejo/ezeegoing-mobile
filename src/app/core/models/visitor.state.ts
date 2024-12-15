export interface Visitor {
  id: number;
  external_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  delete_at: null;
  legal_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  is_supplier: boolean;
  company_name: null;
  photo: null;
  card_number: string;
  card_number_qr: string;
  visitor_card_image: null;
  has_vaccine: number;
  document_type: number;
  company: number;
  credid_search_log: null;
  badge: null;
  user: number;
  vehicles: any[];
}

export interface VisitorState {
  visitors: Visitor[];
  loading: boolean;
  error?: any;
}
