import { eq, formFieldMappings, forms } from "@/db/schemas";
import { db } from "@/index";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) 
{
    console.log("enter")
    const sharedUrl = req.nextUrl.searchParams.get('shared-url');
    if(!sharedUrl){
        return NextResponse.json({
            msg:"no shared url param found",
            status: 400
        })
    }
    console.log(sharedUrl)
    try {   
        const [form] = await db
            .select({
                formId: forms.formId,
                formName: forms.formName,
            })
            .from(forms)
            .where(eq(forms.shareUrl, sharedUrl));

        if (!form) {
            return NextResponse.json({
                msg: "form not found",
                status: 404
            });
        }

        console.log("Form found:", form);

        const formFields = await db
            .select({
                formFieldMapId: formFieldMappings.formFieldMapId,
                fieldType: formFieldMappings.fieldType,
                columnId: formFieldMappings.columnId,
                sequenceNumber: formFieldMappings.sequenceNumber,
                data: formFieldMappings.data,
            })
            .from(formFieldMappings)
            .where(eq(formFieldMappings.formId, form.formId));

        console.log("Form fields found:", formFields);

        if (!formFields || formFields.length === 0) {
            return NextResponse.json({ 
                msg: "No fields found for this form",
                status: 404
            });
        }

        return NextResponse.json({
            formFields: formFields,
            status: 200
        })
    } catch (error) {
        console.error(`Error getting form fields for shared url ${error}`)
        return NextResponse.json({
            msg:'Internal server error',
            status: 500
        })
    }  
}