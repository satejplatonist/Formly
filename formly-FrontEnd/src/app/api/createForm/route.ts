import { auth } from "@/app/utils/auth";
import { forms } from "@/db/schemas";
import { db } from "@/index";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) 
{
   const session = await auth.api.getSession({
        headers: await headers()
   }) 
   
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
   const body = await req.json();
   const {formName} = body;
   console.log(`form name isw ${formName}`);

   if (typeof formName !== "string" || formName.trim().length < 3) {
        return NextResponse.json({ error: "Invalid form name" }, { status: 400 });
   }

    try {
        await db.insert(forms).values({
            formName: formName.trim(),
            userId: session.user.id
        });

        return NextResponse.json({
            form: formName.trim(),
            msg: "Form created"
        });

    } catch (error:any) {
        console.error(error);
        if (error.code === '23505') { 
            return NextResponse.json({ error: "Form name already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create form" }, { status: 500 });
    }

}