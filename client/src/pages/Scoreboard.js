import { useState, useEffect } from "react";
import api from "../utils/api";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
const Scoreboard = ({ auth }) => {

    const [users, setUsers] = useState([])
    const fetchScoreData = async () => {
        const res = await api.get('/users/all');
        console.log(res.data);
        setUsers(res.data);
    }
    useEffect(() => {
        fetchScoreData();
    }, [])

    if (auth.isAuthenticated != true) {
        return <Navigate to="/signup" />
    }
    return (<>

        <div id="score-board" className="w-3/4 md:w-2/3 lg:w-1/2 m-auto py-20">

            <div className="rounded-[50px] bg-[#361728cc] p-10">
                <div id="score-title" className="text-center text-[32px] md:text-[40px] sm:text-[50px] text-orange-300 my-5">
                    Score Board
                </div>

                <div>
                    <table className="w-full text-center">
                        <thead className="sm:text-[26px] text-[16px] text-[#b5eeff] border-b">
                            <tr>
                                <th >Rank</th>
                                <th >Name</th>
                                <th >Score</th>
                            </tr>
                        </thead>
                        <tbody className="text-[22px] text-[#128921] sm:text-[36px] md:text-[40px] lg:text-[48px]">
                            {
                                users.map((user, index) => {
                                    return <tr key={index} className={index == 0 ? "text-[#dfff00]" : ""}
                                    >
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.score}</td>
                                    </tr>
                                })
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>);
}
const mapStateToProps = (state) => ({
    auth: state.auth,
    alerts: state.alert,
});
export default connect(mapStateToProps, null)(Scoreboard);