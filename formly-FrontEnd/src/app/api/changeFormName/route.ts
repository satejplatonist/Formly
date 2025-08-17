import { auth } from "@/app/utils/auth";
import { and, eq, forms } from "@/db/schemas";
import { db } from "@/index";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try 
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

        const form_id = req.nextUrl.searchParams.get("form-id");
        const formId = Number(form_id);
        if (Number.isNaN(formId)) 
        {
            return NextResponse.json({ 
                error: "Invalid form-id, must be a number", 
                status: 400 
            });
        }


        const body = await req.json();
        const { formName } = body;

        if (typeof formName !== "string" || formName.trim().length < 3) {
            return NextResponse.json({ 
                error: "Invalid form name", 
                status: 400 
            });
        }

    
        const result = await db.update(forms)
                            .set({ formName: formName.trim() })
                            .where(and(eq(forms.userId, session.user.id), eq(forms.formId, formId)))
                            .returning({ formId: forms.formId });

        if (!result || result.length === 0) {
            return NextResponse.json({ 
                error: "Form not found or not owned by user", 
                status: 404 
            });
        }

        return NextResponse.json({ 
            message: "Form updated successfully", 
            status: 200 
        });

    } catch (error) {
        console.error("Error updating form:", error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
            status: 500 
        });
    }
}
