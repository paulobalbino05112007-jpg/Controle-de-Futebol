export type PlayerStatus = 'Active' | 'Inactive';
export type PaymentType = 'Monthly' | 'PerGame';

export interface Player {
  id: string;
  name: string;
  phone?: string;
  status: PlayerStatus;
  paymentType: PaymentType;
  monthlyValue?: number;
  perGameValue?: number;
}

export interface Game {
  id: string;
  date: string;
  participants: string[]; // Player IDs
}

export interface Payment {
  id: string;
  playerId: string;
  amount: number;
  date: string;
  month: string; // YYYY-MM
  type: 'Monthly' | 'PerGame';
  gameId?: string; // For PerGame payments
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}
