import {NextRequest, NextResponse} from "next/server"

export async function POST(request: NextRequest) {

    const BACKEND_URL=process.env.BACKEND_URL
    try{
        const body = await request.json()
        console.log(body)
        const {name, email, phone, password} = body

        if(!name || !email || !phone || !password){
            return NextResponse.json({error: "All fields are required"}, {status: 400})
        }

        const data=await fetch(`${BACKEND_URL}api/authenticate/v1/sign-up`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })

        const result = await data.json()
        console.log(result)

        return NextResponse.json({data:result}) 
    }catch(error){
        console.log(error)
        return NextResponse.json({error: "Failed to create user"}, {status: 500})
    }
}
