export interface Book {
  id: string;
  title: string;
  author: string;
  quantity: number;
  description: string;
  coverUrl?: string; // Para links externos
}

export interface Rental {
  id: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  rentalDate: string;
  returnDate: string;
  status: 'RENTED' | 'RETURNED';
}