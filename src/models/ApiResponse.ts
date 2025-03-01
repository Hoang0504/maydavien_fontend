export interface ApiResponse<T> {
    message: string;
    data: T;
    current_page?: number;
    total_pages?: number;
    total?: number;
  }