import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import type { User } from "../types";

export default function Login() {
    // const API_URL = process.env.REACT_APP_API_URL;

    const [login, setLogin] = useState<User>({ username: '', password: '' })
    const navigate = useNavigate()
    const { userLogin } = useUserContext();

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setLogin({
            ...login,
            [name]: value
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (login.username && login.password) {
            const response = await userLogin(login);
            console.log("response -> ", response);
            if (response.token) {
                navigate('/');
            }
        }
    }

    return (
        <>
            <section className="bg-black h-screen flex items-center justify-center px-6">
                <div className="flex flex-col items-center justify-center">
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900 shadow md:mt-0 sm:max-w-md w-80 sm:w-96">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <form className="space-y-4 md:space-y-6 flex flex-col" action="#" onSubmit={handleSubmit}>
                                <div className="self-center">
                                    <img className="w-2s0 h-20 object-contain" src="https://www.ironjiujitsu.it/images/homepage_logo@2x.png" alt="logo iron jiu jitsu" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                    <input type="text" name="username" id="username" className="border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-gray-400 dark:text-white focus:outline-none" onChange={onChangeInput} />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" name="password" id="password" className="border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-gray-400 dark:text-white focus:outline-none" onChange={onChangeInput} />
                                </div>
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 align-baseline" onClick={handleSubmit}>Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}