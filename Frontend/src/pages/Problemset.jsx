import { useSelector } from "react-redux";

export default function Problemset() {

    const user = useSelector((state) => state.auth.user);
    const auth = useSelector((state) => state.auth);
    console.log(user);

    return (
        <>
            <div className="h-15 w-screen bg-amber-600">

                <h1>Leetlab</h1>
                <h1>{user?.firstname}</h1>

            </div>
        </>
    )
}