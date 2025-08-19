import { auth } from "@/app/utils/auth";
import { and, eq, forms } from "@/db/schemas";
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
    if(!formId){
        return NextResponse.json({
            message: "Invalid form-id, must be a number",
            status: 400
        })
    }
    
    try {
        const response = await  db.select({form_Id: forms.formId})
                                  .from(forms)
                                  .where(and(eq(forms.userId,userId),eq(forms.formId,formId)));
        if(response.length === 0){
            return NextResponse.json({
                message: "form-id not found",
                status: 404
            });
        }
        return NextResponse.json({
            message: "valid form-d for user",
            msg:200
        })
    } catch (error) {
        console.log(`Error no form id found ${error}`);
        return NextResponse.json({
            message: "Internal server error",
            status: 500
        });
    }
}