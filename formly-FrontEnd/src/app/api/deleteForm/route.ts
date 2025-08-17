import { auth } from "@/app/utils/auth";
import { and, eq, forms } from "@/db/schemas";
import { db } from "@/index";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, res: NextResponse) 
{
    const session = await auth.api.getSession({ 
        headers: await headers() 
    });

    if (!session) {
        return NextResponse.json({ 
            error: "Unauthorized", 
            status: 401 
        });
    }  
    
    const form_id = req.nextUrl.searchParams.get('form-id');
    const formId = Number(form_id);
    if(Number.isNaN(formId))
    {
        return NextResponse.json({
            message: "Invalid form-id, it should be number",
            status: 400
        })
    }

    try {
        const result =  await db.delete(forms)
                        .where(and(eq(forms.userId, session.user.id), eq(forms.formId, formId)))
                        .returning({ deletedId: forms.formId });
        if (!result) {
            return NextResponse.json({ 
                error: "Form not found or not owned by user", 
                status: 404 
            });
        }

        return NextResponse.json({ 
            message: "Form deleted successfully", 
            status: 200 
        });

    } catch (error) {
        console.error("Error deleting form:", error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
            status: 500 
        });
    }
}