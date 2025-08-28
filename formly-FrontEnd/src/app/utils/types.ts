import { FormFieldMapping } from "@/db/schemas";
import React from "react";

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


export type FormField<T = any> = {
  formFieldMapId: number;
  userId: string;
  formId: number;
  fieldType:FieldType
  columnId: number;
  sequenceNumber: number;
  data: T;
  createdAt: string | null;
  updatedAt: string | null;
};

export type FormFieldsResponse = {
  formFields: FormFieldMapping[];
  status: number;
};

export interface FormFieldRendererProps {
  formField: FormFieldMapping,
  form_id: string
}

export interface ElementProps extends FormFieldRendererProps{
   dragHandle: React.ReactNode
}
