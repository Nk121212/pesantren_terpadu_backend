export class TahfidzResponseDto {
  id: number;
  santriId: number;
  juz: number;
  pageStart: number;
  pageEnd: number;
  score?: number;
  remarks?: string;
  teacherId?: number;
  createdAt: Date;
  updatedAt: Date;
  santri?: {
    id: number;
    name: string;
  };
  teacher?: {
    id: number;
    name: string;
  };
}
