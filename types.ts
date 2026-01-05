
export interface PageData {
  url: string;
  index: number;
}

export interface BookState {
  currentPage: number; // 현재 왼쪽 페이지 인덱스
  totalPages: number;
  pages: string[];
  aspectRatio: number; // 가로/세로 비율
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
