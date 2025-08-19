import { auth } from "@/app/utils/auth";
import { forms } from "@/db/schemas";
import { db } from "@/index";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {eq} from 'drizzle-orm';


export async function GET(req: NextRequest, res: NextResponse) 
{
    const session = await auth.api.getSession({
        headers: await headers()
    })    

    if(!session)
    {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        const result = await db.select({
                                    name:forms.formName,
                                    formId: forms.formId
                                }).from(forms).where(eq(forms.userId,userId))
        return NextResponse.json({
            formName: result
        });
    } catch (error) {
        console.error(` error is getting forms ${error}`);
        return NextResponse.json({ 
            error: "Failed to get forms", 
            status: 500 
        });
    }
}