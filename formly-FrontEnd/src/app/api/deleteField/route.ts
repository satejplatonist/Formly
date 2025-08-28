import { auth } from "@/app/utils/auth";
import { and, eq, formFieldMappings, forms } from "@/db/schemas";
import { db } from "@/index";
import { gte, sql } from "drizzle-orm";
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

    const body = await req.json();
    const { fieldId , sequenceNum} = body;

    try {
        const result =  await db.delete(formFieldMappings)
                        .where(and(eq(formFieldMappings.userId, session.user.id), 
                                   eq(formFieldMappings.formId, formId),
                                   eq(formFieldMappings.formFieldMapId, fieldId)))
                        .returning({ deletedId: formFieldMappings.formFieldMapId });

        await db.update(formFieldMappings)
                    .set({ sequenceNumber: sql`${formFieldMappings.sequenceNumber} - 1` })
                    .where(and(
                        eq(formFieldMappings.formId, formId),
                        gte(formFieldMappings.sequenceNumber, sequenceNum)
                    ));
        if (!result || result.length === 0) {
            return NextResponse.json({ 
                error: "no field to delete", 
                status: 404 
            });
        }

        return NextResponse.json({ 
            message: "field deleted successfully", 
            status: 200 
        });

    } catch (error) {
        console.error("Error deleting field:", error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
            status: 500 
        });
    }
}