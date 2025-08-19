import { auth } from "@/app/utils/auth";
import { and, eq, formFieldMappings, forms } from "@/db/schemas";
import { db } from "@/index";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
    const form_id = req.nextUrl.searchParams.get('form-id');
    const formId = Number(form_id);
    if(!formId || Number.isNaN(formId)){
        return NextResponse.json({
            message: "Invalid form-id, must be a number",
            status: 400
        })
    }

    try {
        const response = await db.select()
                            .from(formFieldMappings)
                            .where(and(eq(formFieldMappings.userId,userId),eq(formFieldMappings.formId,formId)));

        return NextResponse.json({
            formFields: response,
            status: 200
        })
        
    } catch (error) {
        console.error(` error is getting form fields ${error}`);
        return NextResponse.json({ 
            error: "Internal server error", 
            status: 500 
        });
    }
}