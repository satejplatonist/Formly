import { db } from "@/index";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schemas from '@/db/schemas';
import {config} from 'dotenv';
import { verification } from "@/db/schemas/verification";
config();
 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", 
        schema:{
            user:schemas.user,
            account: schemas.account,
            verification: verification,
            session: schemas.session
        }
    }), 
    socialProviders:{
        google:{
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            accessType: "offline", 
            prompt: "select_account+consent", 
        }
    },
    advanced:{
        useSecureCookies: true
    },
    session:{
        expiresIn: 60 * 60 * 24 * 7
    }
});