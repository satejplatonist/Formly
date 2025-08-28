import { auth } from "@/app/utils/auth";
import { and, eq, formFieldMappings } from "@/db/schemas";
import { db } from "@/index";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, res: NextResponse) 
{
    try {
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
        if (isNaN(formId)) {
            return NextResponse.json(
                { message: "Invalid form-id, must be a number" },
                { status: 400 }
            );
        }
        
        const body = await req.json()
        const { reorderedFields } = body

        if (!reorderedFields || !Array.isArray(reorderedFields)) {
        return NextResponse.json({ error: "Invalid reorderedFields, must be an array" }, { status: 400 })
        }

        await db.transaction(async (tx) => {
        for (const field of reorderedFields) {
            await tx
            .update(formFieldMappings)
            .set({
                sequenceNumber: field.sequenceNumber,
                columnId: field.columnId,
            })
            .where(and(eq(formFieldMappings.formFieldMapId, field.formFieldMapId), eq(formFieldMappings.userId, userId)))
        }
        })

        return NextResponse.json({
            message: "Field positions updated successfully",
            status: 200,
        })
    } catch (error) {
        console.error(`Error in updating field ${error}`);
        return NextResponse.json({
            error: "Internal Server Error",
            status: 500
        });
    }
}