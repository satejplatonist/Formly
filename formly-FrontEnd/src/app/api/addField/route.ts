import { auth } from "@/app/utils/auth";
import { and, eq, formFieldMappings } from "@/db/schemas";
import { db } from "@/index";
import { gte, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req:NextRequest, res: NextResponse) {
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

    const body = await req.json();
    const {fieldType,columnId,sequenceNum,data} = body;

    if (!fieldType || ![
            "SHORT_ANSWER", "LONG_ANSWER", "MULTIPLE_CHOICE", "CHECKBOXES",
            "DROPDOWN", "MULTI_SELECT", "NUMBER", "EMAIL", "PHONE_NUMBER", "LINK",
            "FILE_UPLOAD", "DATE", "TIME", "LINEAR_SCALE", "MATRIX", "RATING",
            "PAYMENT", "SIGNATURE", "RANKING", "WALLET_CONNECT"
        ].includes(fieldType)) {
            return NextResponse.json({ 
                error: "Invalid field type", 
                status: 400 
            });
    }

    try {

        await db.update(formFieldMappings)
            .set({ sequenceNumber: sql`${formFieldMappings.sequenceNumber} + 1` })
            .where(and(
                eq(formFieldMappings.formId, formId),
                gte(formFieldMappings.sequenceNumber, sequenceNum)
            ));

        const response = await db.insert(formFieldMappings)
                                 .values({
                                    userId: userId,
                                    formId: formId,
                                    fieldType: fieldType,
                                    sequenceNumber: sequenceNum,
                                    data:data,
                                    columnId: columnId
                                }) 
        return NextResponse.json({
            message: "Field added",
            status: 200
        })
    } catch (error) {
        console.error(`Error in adding fields ${error}`)
        return NextResponse.json({ 
            error: "Failed to add field",
            status: 500 
        });
    }
}