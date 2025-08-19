export type Session = {
    id: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
} | undefined

export type FieldType =
  | "SHORT_ANSWER"
  | "LONG_ANSWER"
  | "MULTIPLE_CHOICE"
  | "CHECKBOXES"
  | "DROPDOWN"
  | "MULTI_SELECT"
  | "NUMBER"
  | "EMAIL"
  | "PHONE_NUMBER"
  | "LINK"
  | "FILE_UPLOAD"
  | "DATE"
  | "TIME"
  | "LINEAR_SCALE"
  | "MATRIX"
  | "RATING"
  | "PAYMENT"
  | "SIGNATURE"
  | "RANKING"
  | "WALLET_CONNECT";
