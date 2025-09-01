import { auth } from "@/app/utils/auth";
import { eq, forms } from "@/db/schemas";
import { db } from "@/index";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) 
{
    const session = await auth.api.getSession({
        headers: await headers()
    })
    
    if(!session){
        return NextResponse.json({
            msg: "Unauthorized",
            status: 401
        })
    }

    const userId = session.user.id;

    const form_id = req.nextUrl.searchParams.get('form-id');
    const formId = Number(form_id);

    if(!formId)
    {
        return NextResponse.json({
            msg: "form not found",
            status: 404
        })
    }

    try {
        const result = await db.select({
                                    sharedUrl: forms.shareUrl
                                })
                               .from(forms)
                               .where(eq(forms.formId,formId)).limit(1);
        if (!result || result.length === 0){
            return NextResponse.json({
                msg: "result not found",
                status: 404
            })
        }

        return NextResponse.json({
            sharedUrl: result[0].sharedUrl,
            status: 200
        })
        
    } catch (error) {
        console.error(`Error in getting shared url ${error}`)
        return NextResponse.json({
            msg: "Internal server error",
            status: 500
        })
    }

}