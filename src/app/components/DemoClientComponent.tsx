'use client'

import { User } from "@supabase/supabase-js";
import { createClient } from "../../../utils/supabase/client";
import { useEffect,useState } from "react";


export default function DemoClientComponent(){
    const [user,setUser] = useState <User | null >(null);

    useEffect(()=>{
        async function getUser()
            {
                const supaBase = createClient();
                const {data,error} = await supaBase.auth.getUser();
                if(error|| !data.user)
                {
                    console.log("no user");
                }
                else
                {
                    setUser(data.user);
                }
            }
            getUser();
        },[]);
        console.log("hagoo");
        console.log({user});

        return <h2> Client Component </h2>
}