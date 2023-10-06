import { useEffect, useState } from "react"


const Home= () =>{

    useEffect (() => {
        const fetchWork = async () =>{
            const response = await fetch('')

        }

        fetchWork()

    }, [])


    return(
        <div className="home">
           <h2>Home</h2> 
        </div>
    )
}

export default Home